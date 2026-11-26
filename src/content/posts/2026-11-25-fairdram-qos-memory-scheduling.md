---
title: "QoS-aware memory scheduling for CPU–AI co-execution"
description: "How FairDRAM, a research prototype built on Ramulator 2, gives latency-sensitive CPU requests bounded priority when an accelerator is flooding memory bandwidth."
pubDate: 2026-11-25
category: computer-architecture
tags: ["computer architecture", "systems", "memory", "scheduling"]
---

When a CPU and an AI accelerator share a DRAM channel, bandwidth is not the only scarce resource. Accelerators tend to issue dense, throughput-oriented traffic. Latency-sensitive CPU tasks can stall behind that flood, even if average bandwidth still looks healthy. Quality of service, in this setting, is about making sure the CPU does not wait indefinitely without wrecking accelerator throughput.

[FairDRAM](https://github.com/tejas-ml/tejas-ml/tree/main/projects/FairDRAM) is a runnable research artifact for that problem. The idea is straightforward: detect sparse or aged CPU memory requests, give them bounded priority, and keep a quota plus a row-locality fallback so the accelerator is not starved. This post describes the scheduler and how the artifact is meant to be evaluated. I am not reporting experimental numbers here.

This is research software — a course- and prototype-scale scheduler, not a production memory controller.

## Where it sits

FairDRAM is implemented as a scheduler for [Ramulator 2](https://github.com/CMU-SAFARI/ramulator2). The artifact ships a C++ scheduler, an installer that copies it into a Ramulator tree and patches CMake, a synthetic trace generator, an experiment driver, and plotting scripts.

After installation, a Ramulator config can select the scheduler and its knobs:

```yaml
Scheduler:
  impl: FairDRAM
  cpu_source_ids: "0"
  cpu_low_queue_threshold: 4
  age_gap_threshold: 128
  cpu_quota_pct: 70
  epoch_len: 1024
```

The source convention in the synthetic traces is simple. The CPU is trace index 0 (`source_id = 0`); an AI accelerator proxy is trace index 1 (`source_id = 1`). The trace generator writes SimpleO3-style records of the form `<bubble_count> <load_addr> [store_addr]`.

## How a request is chosen

For each candidate request in the selected Ramulator request buffer, the scheduler:

1. Computes the next prerequisite DRAM command.
2. Marks whether that command is ready under DRAM timing constraints.
3. Marks whether the request comes from the CPU source set.
4. Marks CPU requests urgent when the CPU queue is sparse, or when the CPU request is old relative to other queued requests.
5. Selects by: ready command, urgent CPU request, row-buffer hit, then first-come first-served.
6. Enforces an approximate CPU-priority quota per epoch so AI throughput is not destroyed.

Urgency is the QoS signal. A sparse CPU queue is a hint that the CPU is not flooding the channel and that its next request is more likely to be on the critical path. Age is the safety net: even if the queue is not sparse, a CPU request that has waited a long time relative to its neighbors should not sit behind a steady stream of accelerator traffic.

The quota is what keeps that preference bounded. Without it, a rule that always favors urgent CPU requests can collapse accelerator throughput. With it, CPU priority is a budget that resets each epoch rather than a permanent override.

The implementation is intentionally simple and easy to extend. One limitation already noted in the artifact is that the quota is updated inside `get_best_request()`. A cleaner design would move the quota update into the controller after a command actually issues, so the budget tracks issued work rather than selection attempts.

## How the artifact is evaluated

The intended comparison is against FRFCFS, using CPU-alone, AI-alone, and mixed CPU+AI runs on the generated traces. For each mix and scheduler, the scripts define three metrics:

- **CPU slowdown** = `cpu_mixed_cycles / cpu_alone_cycles`. Lower is better.
- **Accelerator throughput loss** = `100 * (1 - ai_alone_cycles / ai_mixed_cycles)`. Lower is better.
- **Jain fairness** over normalized throughputs, where CPU normalized throughput is `cpu_alone_cycles / cpu_mixed_cycles` and AI normalized throughput is `ai_alone_cycles / ai_mixed_cycles`. Higher is better.

Those definitions are part of the artifact. I am not attaching numbers to them in this post. The repository also includes a demo plotting path that produces illustrative fake data so the figure pipeline can be checked without Ramulator. Those demo figures are not experimental results, and I am not using them here.

The Ramulator-backed path is:

```bash
python3 ramulator2_patch/install_fairdram.py /path/to/ramulator2 --build --jobs 8
python3 scripts/gen_traces.py --out traces --insts 50000 --working-set-mb 128
python3 scripts/run_ramulator2_experiments.py \
  --ramulator2 /path/to/ramulator2/ramulator2 \
  --traces traces \
  --out results \
  --insts 50000 \
  --schedulers FRFCFS FairDRAM
python3 scripts/plot_results.py --summary results/summary.csv --out figures
```

## Why this is the right shape of problem

Shared-memory QoS is an old systems question that has become more visible as CPU cores and accelerators sit next to each other and contend for the same DRAM. The interesting design tension is not “always favor the CPU” or “always maximize bandwidth.” It is how to detect when a latency-sensitive request is being delayed, how to help it without ignoring row-buffer locality and timing readiness, and how to cap that help so a throughput workload still makes progress.

FairDRAM is one small answer to that tension: urgency from sparsity and age, then a quota, then the usual locality and FCFS fallbacks. The code and scripts are in the [FairDRAM project directory](https://github.com/tejas-ml/tejas-ml/tree/main/projects/FairDRAM).
