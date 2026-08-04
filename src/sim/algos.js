const cacheAccessTime = 10;
const memoryAccessTime = 100;
const missPenalty = memoryAccessTime;

export function totalAccessCount(sequence) {
  return sequence.length;
}

export function hitRate(hitCount, totalAccess) {
  if (totalAccess === 0) return 0;
  return hitCount / totalAccess;
}

export function missRate(hitRateVal) {
  return 1 - hitRateVal;
}

export function missCount(totalAccess, hitCount) {
  return totalAccess - hitCount;
}

export function TMAT(totalAccess, amatVal) {
  return totalAccess * amatVal;
}

export function AMAT(cacheAccess, missRateVal, penalty) {
  return cacheAccess + missRateVal * penalty;
}

export function hitCountMRU(
  sequence,
  cacheBlocks,
  mappingType,
  associativity = 0,
) {
  return simulateCacheWithLogs({
    sequence,
    cacheBlocks,
    mappingType,
    replacementPolicy: "MRU",
    associativity,
  }).hitCount;
}

export function hitCountLRU(
  sequence,
  cacheBlocks,
  mappingType,
  associativity = 0,
) {
  return simulateCacheWithLogs({
    sequence,
    cacheBlocks,
    mappingType,
    replacementPolicy: "LRU",
    associativity,
  }).hitCount;
}

export function runCacheSimulation(params) {
  const {
    sequence,
    cacheBlocks,
    mappingType,
    replacementPolicy,
    cacheAccessTime: cAccTime = cacheAccessTime,
    memoryAccessTime: mAccTime = memoryAccessTime,
    readPolicy,
    associativity = 0,
  } = params;

  const simResult = simulateCacheWithLogs(params);
  const totalAccess = totalAccessCount(sequence);
  const hitCnt = simResult.hitCount;
  const missCnt = missCount(totalAccess, hitCnt);
  const hRate = hitRate(hitCnt, totalAccess);
  const mRate = missRate(hRate);
  const amatVal = AMAT(cAccTime, mRate, mAccTime);
  const tmatVal = TMAT(totalAccess, amatVal);

  return {
    totalAccess,
    hitCount: hitCnt,
    missCount: missCnt,
    hitRate: hRate,
    missRate: mRate,
    AMAT: amatVal,
    TMAT: tmatVal,
    cacheAccessTime: cAccTime,
    missPenalty: mAccTime,
    mappingType,
    replacementPolicy,
    readPolicy,
    cacheBlocks,
    associativity: associativity || 0,
  };
}

export function formatWay(mappingType, setIndex, position) {
  if (mappingType === "set-associative") {
    return `S${setIndex}W${position}`;
  }
  if (mappingType === "direct") {
    return `B${setIndex}`;
  }
  return position === null || position === undefined ? "N/A" : `W${position}`;
}

export function simulateCacheWithLogs(params) {
  const {
    sequence,
    cacheBlocks,
    mappingType = "full",
    replacementPolicy,
    cacheAccessTime: cAccTime = 10,
    memoryAccessTime: mAccTime = 100,
    readPolicy,
    associativity = 0,
  } = params;

  let hitCount = 0;
  let logs = [];

  // Fixed physical cache slots [null, null, null, null]
  let cache = new Array(cacheBlocks).fill(null);

  // Recency Queue tracking block access order: [LRU ... MRU]
  let recencyStack = [];

  for (let step = 0; step < sequence.length; step++) {
    const block = sequence[step];
    let setIndex = null;
    let way = null;
    let evicted = null;
    let result = "MISS";

    let targetSlot = -1;

    if (mappingType === "direct") {
      setIndex = block % cacheBlocks;
      targetSlot = setIndex;
      way = formatWay(mappingType, setIndex, 0);

      if (cache[targetSlot] === block) {
        result = "HIT";
        hitCount++;
      } else {
        result = "MISS";
        if (cache[targetSlot] !== null) {
          evicted = cache[targetSlot];
        }
        cache[targetSlot] = block;
      }
    } else {
      // Fully Associative & Set Associative physical mapping
      const hitIndex = cache.indexOf(block);

      if (hitIndex !== -1) {
        // HIT: Block stays at its physical slot!
        result = "HIT";
        hitCount++;
        way = formatWay(mappingType, 0, hitIndex);

        // Update recency stack (move hit block to MRU position)
        recencyStack = recencyStack.filter((b) => b !== block);
        recencyStack.push(block);
      } else {
        // MISS
        result = "MISS";

        // Find first empty physical slot
        targetSlot = cache.indexOf(null);

        if (targetSlot === -1) {
          // Cache full: identify victim based on policy
          const victimBlock =
            replacementPolicy === "MRU"
              ? recencyStack[recencyStack.length - 1] // MRU Block
              : recencyStack[0]; // LRU Block

          targetSlot = cache.indexOf(victimBlock);
          evicted = victimBlock;

          // Remove victim from recency queue
          recencyStack = recencyStack.filter((b) => b !== victimBlock);
        }

        // Place incoming block in physical slot
        cache[targetSlot] = block;
        way = formatWay(mappingType, 0, targetSlot);

        // Update recency queue (push incoming to MRU)
        recencyStack.push(block);
      }
    }

    logs.push({
      step: step + 1,
      blk: block,
      policy: replacementPolicy,
      way,
      result,
      evict: evicted !== null ? evicted : "N/A",
      snapshot: [...cache], // Physical slot state [#0, #1, #2, #3]
      recencyQueue: [...recencyStack], // Dynamic access order [LRU ... MRU]
    });
  }

  const totalAccess = totalAccessCount(sequence);
  const missCnt = missCount(totalAccess, hitCount);
  const hRate = hitRate(hitCount, totalAccess);
  const mRate = missRate(hRate);
  const amatVal = AMAT(cAccTime, mRate, mAccTime);
  const tmatVal = TMAT(totalAccess, amatVal);

  return {
    totalAccess,
    hitCount,
    missCount: missCnt,
    hitRate: hRate,
    missRate: mRate,
    AMAT: amatVal,
    TMAT: tmatVal,
    cacheAccessTime: cAccTime,
    missPenalty: mAccTime,
    mappingType,
    replacementPolicy,
    readPolicy,
    cacheBlocks,
    associativity: associativity || 0,
    logs,
  };
}
