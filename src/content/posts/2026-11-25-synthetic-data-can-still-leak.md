---
title: "Why synthetic data can still leak private records"
description: "A walkthrough of SyntheticShield, a research prototype that audits synthetic-data generators for memorization and membership leakage using canary records and membership tests."
pubDate: 2026-11-25
category: ai-ml
tags: ["AI security", "privacy", "synthetic data", "machine learning"]
---

A common claim about synthetic data is that it is safe to share because the records are generated rather than copied from real people. That is not always true. A generator that memorizes training rows, or that stays too close to them, can still reveal private information — sometimes almost verbatim, sometimes through membership inference.

[SyntheticShield](https://github.com/tejas-ml/SyntheticShield) is a lightweight research repository for auditing that failure mode. It creates a private tabular dataset, inserts rare canary records, trains several synthetic-data generators, and measures whether generated samples are too close to private training records. This post explains the design. I am not reporting numerical results here; the public repository is set up so those numbers can be produced locally from a single experiment command.

This is a compact, reproducible research prototype, not a formal privacy certification.

## The audit setup

The intended experiment is a small, end-to-end paper-style pipeline:

1. Build a private tabular dataset and insert rare canary records.
2. Fit generators under several defense settings.
3. Draw synthetic samples.
4. Score utility and privacy with the same auditor.

The auditor looks at three views of the same run, which the repo plots as panels:

- **Utility** of the synthetic data
- **Membership leakage**
- **Canary exposure versus rarity**

The point of putting those panels side by side is to make the usual tradeoff visible. A generator can look useful on a downstream task and still be leaking, and a defense can improve privacy while hurting utility. Reporting only one of those numbers is easy and incomplete.

## Three generator settings

SyntheticShield compares three generator settings:

1. **No defense.** A memorizing nearest-neighbor bootstrap generator that perturbs sampled private rows with small noise. This is the pessimistic baseline: it is designed to stay close to the training data.
2. **DP training.** A clipped Gaussian generator with simple DP-inspired parameter noise.
3. **Deduplication.** A pre-processing defense that removes duplicate and high-outlier rows before fitting a bootstrap generator with stronger perturbation.

The second setting is labeled **DP-inspired** on purpose. It is not a formal differential-privacy guarantee. To make formal DP claims, the generator would need to be replaced with a certified DP training algorithm and a privacy accountant. I would rather be explicit about that than dress a prototype in language it has not earned.

## What the auditor reports

The auditor scores each generator on:

- **TSTR utility AUC.** Train a downstream classifier on synthetic data, then test it on held-out real data (train on synthetic, test on real).
- **Membership inference AUC.** Use nearest-neighbor distance to synthetic records as the attack score.
- **Leakage rate at 5% FPR.** The true-positive rate of that membership attack when false positives on non-members are capped at 5%.
- **Canary exposure.** Nearest-neighbor closeness of the inserted canaries in the generated data, grouped by rarity.

Canaries are useful because rarity is a knob. A unique or almost-unique record is a harder test than a common one. If a generator reproduces or hugs those rare rows, “synthetic” has not done much work.

A typical run looks like this:

```bash
python scripts/run_experiment.py --config configs/default.json --out outputs
python scripts/make_figures.py \
  --results outputs/metrics_summary.csv \
  --canaries outputs/canary_exposure.csv \
  --out outputs/figures
```

That writes summary tables, a threshold sweep, synthetic previews under each defense, and the figures the accompanying write-up expects.

## What this does not claim

SyntheticShield is an audit harness, not a proof that a given generator is safe. Nearest-neighbor membership attacks and canary exposure are practical tests, not the full space of attacks. A generator that looks clean under these metrics can still leak under a stronger adversary, a different distance, or a different downstream query. The DP-inspired setting should not be cited as differential privacy.

If you work with synthetic data in health or finance, the habit I would take from this repo is simple: evaluate utility and leakage on the same split, include rare canaries, and treat “it is synthetic” as a hypothesis to test rather than a property of the sampling step.

The code, configs, and write-up live in the [SyntheticShield repository](https://github.com/tejas-ml/SyntheticShield).
