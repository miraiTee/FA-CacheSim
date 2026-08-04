# CacheSim
Group 6 - S05

### Group Roster:
* Borromeo, Anton Miguel
* Dela Cruz, Mirai
* Reyes, Nicos
* Roldan, Beatrice
* Ruiz, Joseph Benjamin

**Github Link:** https://github.com/miraiTee/FA-CacheSim

### Background

> Cache memory is a small, high-speed storage layer between the CPU and main memory that reduces average memory access time by storing frequently used data closer to the processor. 

### Key Cache Parameters

    Block Size: The unit of data transferred between memory and cache

    Cache Blocks: The number of data blocks the cache can hold

    Mapping Type: How memory blocks map to cache locations (Direct, Fully Associative, Set-Associative)

    Replacement Policy: Which block to evict when the cache is full

        LRU (Least Recently Used): Evicts the least recently accessed block

        MRU (Most Recently Used): Evicts the most recently accessed block

    Read Policy: Non-load-through (CPU waits during miss) or load-through (CPU continues)

# Cache Performance Comparison: Simulation Results & Scenario Analysis

This document provides a comparative analysis of actual cache simulation results alongside the performance dynamics across the target scenario configurations.

---

## Part 1: Simulation Benchmark Results (From Screenshots)

| Metric / Configuration | Test Case 1 | Test Case 2 | Test Case 3 |
| :--- | :--- | :--- | :--- |
| **Block Size** | 2 Words | 128 Words | 16 Words |
| **Cache Blocks** | 4 Blocks | 128 Blocks | 32 Blocks |
| **Main Memory** | 1024 Blocks | 1024 Blocks | 1024 Blocks |
| **Read Policy** | Non-Load-Through | Load-Through | Non-Load-Through |
| **Access Sequence** | Random | Sequential | Mid-Repeat |
| **Memory Accessed** | 64 / 64 | 512 / 512 | 320 / 320 |
| **LRU Hit Rate (Hits)** | 3.13% (2) | 0.00% (0) | 10.00% (32) |
| **MRU Hit Rate (Hits)** | 3.13% (2) | 25.00% (128) | 49.06% (157) |
| **LRU Miss Rate (Misses)** | 96.88% (62) | 100.00% (512) | 90.00% (288) |
| **MRU Miss Rate (Misses)** | 96.88% (62) | 75.00% (384) | 50.94% (163) |
| **LRU Avg. Access Time** | 106.88 ns | 110.00 ns | 100.00 ns |
| **MRU Avg. Access Time** | 106.88 ns | 85.00 ns | 60.94 ns |

---

## Part 2: Detailed Performance Analysis

### Test Case 1 Data
* Configuration: 2-word blocks, 4 cache blocks, non-load-through, random sequence.
* Performance: Very low hit rates across both policies (3.13%).
* Behavior: Extremely small capacity combined with a non-repeating random sequence minimizes spatial and temporal locality. Replacement policies (LRU vs. MRU) yield identical results because access patterns lack temporal structure.

### Test Case 2 Data
* Configuration: 128-word blocks, 128 cache blocks, load-through, sequential access.
* Performance: LRU achieves 0.00% hit rate (100% miss rate), whereas MRU achieves 25.00% hit rate.
* Behavior: Continuous sequential access across a large address space leads to complete cache thrashing under LRU. MRU retains older blocks at the head of the cache, allowing occasional hits and reducing average memory access time from 110.00 ns to 85.00 ns.

### Test Case 3 Data
* Configuration: 16-word blocks, 32 cache blocks, non-load-through, mid-repeat sequence.
* Performance: LRU reaches a 10.00% hit rate, while MRU reaches 49.06% (157 hits).
* Behavior: The mid-repeat sequence creates predictable temporal re-access patterns. MRU retains the static working set significantly better than LRU, resulting in a much faster average memory access time (60.94 ns vs 100.00 ns).

---

## Key Takeaways

* Access Sequence Dominance: Random access renders cache replacement policies ineffective, while structured patterns (mid-repeat) significantly favor MRU over LRU in these specific looping sequences.
* Impact of Read Policy: Load-through policies lower overall latency during cache misses by serving the requested word to the processor without waiting for the full block transfer.