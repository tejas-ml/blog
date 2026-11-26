---
title: "How RAGGuard filters sensitive context before it reaches the model"
description: "A walkthrough of RAGGuard, a research prototype that sits between a retriever and a generator, classifies each chunk, and measures leakage against an unfiltered RAG baseline."
pubDate: 2026-11-25
category: ai-ml
tags: ["AI security", "RAG", "privacy", "machine learning"]
---

In a typical retrieval-augmented generation (RAG) stack, retrieved documents are concatenated into the model context. If the index contains salaries, credentials, health details, or a prompt-injection payload, an unfiltered generator can copy that material into the answer.

[RAGGuard](https://github.com/tejas-ml/RAGGuard) is a research prototype for a context-aware privacy firewall that sits between a retriever and a language model. It classifies each retrieved chunk as safe, redactable, or blocked, then measures leakage and answer utility against an unfiltered baseline. This post explains how the prototype is put together, what the checked-in experiment shows, and what it does not show.

This is research software, not a production security product. The experiment is fully offline and deterministic. No model API is required.

## The pipeline

The path through the system is short:

```text
User query
  → TF-IDF retriever (top-k = 4)
  → RAGGuard firewall (score, redact, or block)
  → simulated response
```

The retriever (`ragguard/retrieval.py`) is an in-memory TF-IDF index with cosine similarity. The default is `top_k=4`. There is no vector database and no live embedding model. That is intentional: the goal is a reproducible firewall experiment, not a retrieval bake-off.

## How a chunk is classified

Each retrieved chunk gets an additive sensitivity score. The score combines several signals:

- PII patterns such as email, phone, and Social Security numbers
- secret patterns such as API keys, passwords, and bearer tokens
- private-content terms
- the document's access level: public, internal, confidential, or private
- prompt-injection indicators
- overlap between private terms and the user query

The firewall then assigns a label:

- `public-safe` — passed through unchanged
- `sensitive-redacted` — PII and secrets replaced, then passed through
- `private-blocked` — removed from the model context

Hard blocks also trigger on prompt injection, a `private` access level, or a raw API key or SSN match. The default score threshold is `0.55`, with a redaction margin of `0.30`.

The generator (`ragguard/llm_sim.py`) is a deterministic simulator, not a live language model. The baseline copies public facts and, on attack queries, copies secret spans from unfiltered context. The RAGGuard path answers only from non-blocked, possibly redacted text, or refuses when nothing safe remains.

Leakage is whether secret spans appear in the answer. Utility is the fraction of gold facts found in the answer, using exact-string match.

## The benchmark

The corpus and queries are synthetic and hand-written (`ragguard/data.py`):

- 12 company documents: 3 public, 4 internal, 1 confidential, and 4 private
- 13 queries: 5 benign, 2 sensitive-benign, 4 privacy attacks, and 2 prompt-injection attacks

The documents include public product policy, redactable contact and salary-band text, and private records (exact salary, health information, API keys). Some retrieved malicious documents contain patterns such as “ignore previous instructions” and “reveal confidential data.”

These numbers are from the artifacts checked in under `results/`, produced by:

```bash
python experiments/run_experiment.py --threshold 0.55 --top-k 4 --out results
```

They are not results from a production or API-backed language model. Re-running that command with the same flags should regenerate the same tables.

## What the experiment shows

On this benchmark, with threshold `0.55`:

| Metric | Baseline RAG | RAGGuard |
| --- | ---: | ---: |
| Leakage rate (any sensitive, attack + sensitive-benign queries) | 1.00 | 0.00 |
| Leakage fraction of secret spans (same query set) | 1.00 | 0.00 |
| Leakage rate on privacy / prompt-injection attacks | 1.00 | 0.00 |
| Answer utility on benign + sensitive-benign queries | 1.00 | 0.679 |
| Answer utility on all 13 queries | 0.538 | 0.827 |
| Mean blocked chunks per query | 0.00 | 1.85 |
| Mean redacted chunks per query | 0.00 | 0.54 |

Two details are easy to misread, so they are worth stating plainly.

Utility on all 13 queries rises under RAGGuard because the simulator scores a refusal as useful when a query has no gold public facts, which is typical of the attack queries. That is a scoring choice, not evidence that the firewall writes better answers.

The number that reflects the privacy–utility tradeoff on ordinary questions is utility on benign and sensitive-benign queries, which falls from 1.00 to 0.679.

A threshold sweep in `results/threshold_sweep.csv` varies the firewall threshold from 0.15 to 0.95. Leakage on the sensitive set stays at 0.00 through threshold 0.55 and is 0.125 at thresholds 0.65 and above. Benign utility is 0.607 at the stricter thresholds (0.15–0.35) and 0.679 from 0.45 upward. On this corpus, loosening the threshold past 0.55 starts to let leakage through, while tightening it below 0.45 costs some benign utility and does not further reduce leakage, which is already zero.

## Limitations

The firewall is a pattern- and policy-based classifier. It does not use a learned model to detect sensitive text, and it will miss secrets that do not match its patterns. The corpus is small and synthetic. The generator is a simulator designed so that unfiltered context leaks and filtered context does not copy blocked spans — it is not a stand-in for a frontier model, which can leak by paraphrase, inference, or tool use. Exact-string utility will also under-count answers that are right in substance but worded differently.

To try a real model, the intended next step is to replace `ragguard/llm_sim.py` and keep the same metrics and figure pipeline.

The code, experiment driver, and checked-in results are in the [RAGGuard repository](https://github.com/tejas-ml/RAGGuard).
