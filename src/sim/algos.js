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
    return cacheAccess + (missRateVal * penalty);
}

export function hitCountMRU(sequence, cacheBlocks, mappingType, associativity = 0) {
    let cache = [];
    let hitCount = 0;
    
    let sets = [];
    let numSets = 0;
    
    if (mappingType === "set-associative") {
        numSets = Math.floor(cacheBlocks / associativity);
        sets = Array.from({ length: numSets }, () => []);
    }
    
    for (let block of sequence) {
        let cacheToUse;
        let blockIndex;
        
        if (mappingType === "direct") {
            cacheToUse = cache;
            blockIndex = cache.findIndex(b => b === block);
        } else if (mappingType === "full") {
            cacheToUse = cache;
            blockIndex = cache.indexOf(block);
        } else if (mappingType === "set-associative") {
            const setIndex = block % numSets;
            cacheToUse = sets[setIndex];
            blockIndex = cacheToUse.indexOf(block);
        }
        
        if (blockIndex !== -1) {
            hitCount++;
            if (mappingType === "set-associative") {
                cacheToUse.splice(blockIndex, 1);
                cacheToUse.push(block);
            } else {
                cache.splice(blockIndex, 1);
                cache.push(block);
            }
        } else {
            if (mappingType === "set-associative") {
                if (cacheToUse.length < associativity) {
                    cacheToUse.push(block);
                } else {
                    cacheToUse.pop();
                    cacheToUse.push(block);
                }
            } else {
                if (cache.length < cacheBlocks) {
                    cache.push(block);
                } else {
                    cache.pop();
                    cache.push(block);
                }
            }
        }
    }
    
    return hitCount;
}

export function hitCountLRU(sequence, cacheBlocks, mappingType, associativity = 0) {
    let cache = [];
    let hitCount = 0;
    
    let sets = [];
    let numSets = 0;
    
    if (mappingType === "set-associative") {
        numSets = Math.floor(cacheBlocks / associativity);
        sets = Array.from({ length: numSets }, () => []);
    }
    
    for (let block of sequence) {
        let cacheToUse;
        let blockIndex;
        
        if (mappingType === "direct") {
            cacheToUse = cache;
            blockIndex = cache.findIndex(b => b === block);
        } else if (mappingType === "full") {
            cacheToUse = cache;
            blockIndex = cache.indexOf(block);
        } else if (mappingType === "set-associative") {
            const setIndex = block % numSets;
            cacheToUse = sets[setIndex];
            blockIndex = cacheToUse.indexOf(block);
        }
        
        if (blockIndex !== -1) {
            hitCount++;
            if (mappingType === "set-associative") {
                cacheToUse.splice(blockIndex, 1);
                cacheToUse.push(block);
            } else {
                cache.splice(blockIndex, 1);
                cache.push(block);
            }
        } else {
            if (mappingType === "set-associative") {
                if (cacheToUse.length < associativity) {
                    cacheToUse.push(block);
                } else {
                    cacheToUse.shift();
                    cacheToUse.push(block);
                }
            } else {
                if (cache.length < cacheBlocks) {
                    cache.push(block);
                } else {
                    cache.shift();
                    cache.push(block);
                }
            }
        }
    }
    
    return hitCount;
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
        associativity = 0
    } = params;
    
    let calculatedMissPenalty = mAccTime;
    
    const totalAccess = totalAccessCount(sequence);
    
    let hitCnt = 0;
    if (replacementPolicy === "MRU") {
        hitCnt = hitCountMRU(sequence, cacheBlocks, mappingType, associativity);
    } else if (replacementPolicy === "LRU") {
        hitCnt = hitCountLRU(sequence, cacheBlocks, mappingType, associativity);
    }
    
    const missCnt = missCount(totalAccess, hitCnt);
    const hRate = hitRate(hitCnt, totalAccess);
    const mRate = missRate(hRate);
    const amatVal = AMAT(cAccTime, mRate, calculatedMissPenalty);
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
        missPenalty: calculatedMissPenalty,
        mappingType,
        replacementPolicy,
        readPolicy,
        cacheBlocks,
        associativity: associativity || 0
    };
}

export function formatWay(mappingType, setIndex, position) {
    if (mappingType === 'set-associative') {
        return `S${setIndex}W${position}`;
    }
    if (mappingType === 'direct') {
        return `B${setIndex}`;
    }
    return position === null || position === undefined ? 'N/A' : `W${position}`;
}

export function simulateCacheWithLogs(params) {
    const {
        sequence,
        cacheBlocks,
        mappingType,
        replacementPolicy,
        cacheAccessTime: cAccTime = 10,
        memoryAccessTime: mAccTime = 100,
        readPolicy,
        associativity = 0
    } = params;

    let hitCount = 0;
    let logs = [];

    let cache = [];
    let numSets = 1;

    if (mappingType === 'set-associative') {
        numSets = Math.max(1, Math.floor(cacheBlocks / associativity));
        cache = Array.from({ length: numSets }, () => []);
    } else if (mappingType === 'direct') {
        numSets = cacheBlocks;
        cache = Array.from({ length: numSets }, () => []);
    }

    for (let step = 0; step < sequence.length; step++) {
        const block = sequence[step];
        let cacheToUse;
        let blockIndex;
        let setIndex = null;
        let way = null;
        let evicted = null;
        let result;

        if (mappingType === 'set-associative' || mappingType === 'direct') {
            setIndex = block % numSets;
            cacheToUse = cache[setIndex];
            blockIndex = cacheToUse.indexOf(block);
        } else {
            // Fully Associative
            cacheToUse = cache;
            blockIndex = cacheToUse.indexOf(block);
        }

        if (blockIndex !== -1) {
            // HIT
            hitCount++;
            result = 'HIT';

            if (mappingType === 'direct') {
                way = formatWay(mappingType, setIndex, 0);
            } else {
                way = formatWay(mappingType, setIndex, blockIndex);
                cacheToUse.splice(blockIndex, 1);
                cacheToUse.push(block);
            }
        } else {
            // MISS
            result = 'MISS';

            if (mappingType === 'direct') {
                if (cacheToUse.length > 0) {
                    evicted = cacheToUse.pop();
                }
                cacheToUse.push(block);
                way = formatWay(mappingType, setIndex, 0);
            } else {
                const maxCapacity = mappingType === 'set-associative' ? associativity : cacheBlocks;

                if (cacheToUse.length < maxCapacity) {
                    // Cache line/way is available
                    cacheToUse.push(block);
                    way = formatWay(mappingType, setIndex, cacheToUse.length - 1);
                } else {
                    // Eviction required
                    if (replacementPolicy === 'MRU') {
                        evicted = cacheToUse.pop(); // Remove MRU (end of array)
                    } else {
                        evicted = cacheToUse.shift(); // Remove LRU (start of array)
                    }
                    cacheToUse.push(block);
                    way = formatWay(mappingType, setIndex, cacheToUse.length - 1);
                }
            }
        }

        // Clone state for step logs
        const currentSnapshot = mappingType === 'full' 
            ? [...cache] 
            : cache.map(set => [...set]);

        logs.push({
            step: step + 1,
            blk: block,
            policy: replacementPolicy,
            way,
            result,
            evict: evicted !== null ? evicted : 'N/A',
            snapshot: currentSnapshot
        });
    }

    const totalAccess = totalAccessCount(sequence);
    const missCnt = missCount(totalAccess, hitCount);
    const hRate = hitRate(hitCount, totalAccess);
    const mRate = missRate(hRate);
    const calculatedMissPenalty = mAccTime;
    const amatVal = AMAT(cAccTime, mRate, calculatedMissPenalty);
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
        missPenalty: calculatedMissPenalty,
        mappingType,
        replacementPolicy,
        readPolicy,
        cacheBlocks,
        associativity: associativity || 0,
        logs
    };
}