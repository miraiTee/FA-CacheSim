const cacheAccessTime = 10;
const memoryAccessTime = 100;
const missPenalty = memoryAccessTime;

function totalAccessCount(sequence) {
    return sequence.length;
}

function hitRate(hitCount, totalAccess) {
    if (totalAccess === 0) return 0;
    return hitCount / totalAccess;
}

function missRate(hitRate) {
    return 1 - hitRate;
}

function missCount(totalAccess, hitCount) {
    return totalAccess - hitCount;
}

function TMAT(totalAccess, AMAT) {
    return totalAccess * AMAT;
}

function AMAT(cacheAccessTime, missRate, missPenalty) {
    return cacheAccessTime + (missRate * missPenalty);
}

function hitCountMRU(sequence, cacheBlocks, mappingType, associativity = 0) {
    let cache = [];
    let hitCount = 0;
    
    let sets = [];
    let numSets = 0;
    
    if (mappingType === "set-associative") {
        numSets = Math.floor(cacheBlocks / associativity);
        sets = Array.from({length: numSets}, () => []);
    }
    
    for (let block of sequence) {
        let cacheToUse;
        let blockIndex;
        
        if (mappingType === "direct") {
            const index = block % cacheBlocks;
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

function hitCountLRU(sequence, cacheBlocks, mappingType, associativity = 0) {
    let cache = [];
    let hitCount = 0;
    
    let sets = [];
    let numSets = 0;
    
    if (mappingType === "set-associative") {
        numSets = Math.floor(cacheBlocks / associativity);
        sets = Array.from({length: numSets}, () => []);
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

function runCacheSimulation(params) {
    const {
        sequence,
        cacheBlocks,
        mappingType,
        replacementPolicy,
        cacheAccessTime,
        memoryAccessTime,
        readPolicy,
        associativity = 0
    } = params;
    
    let missPenalty;
    if (readPolicy === "non-load thru") {
        missPenalty = memoryAccessTime;
    } else if (readPolicy === "load thru") {
        missPenalty = memoryAccessTime; 
    } else {
        missPenalty = memoryAccessTime;
    }
    
    const totalAccess = totalAccessCount(sequence);
    
    let hitCnt;
    if (replacementPolicy === "MRU") {
        hitCnt = hitCountMRU(sequence, cacheBlocks, mappingType, associativity);
    } else if (replacementPolicy === "LRU") {
        hitCnt = hitCountLRU(sequence, cacheBlocks, mappingType, associativity);
    }
    
    const missCnt = missCount(totalAccess, hitCnt);
    const hRate = hitRate(hitCnt, totalAccess);
    const mRate = missRate(hRate);
    const amat = AMAT(cacheAccessTime, mRate, missPenalty);
    const tmat = TMAT(totalAccess, amat);
    
    return {
        totalAccess,
        hitCount: hitCnt,
        missCount: missCnt,
        hitRate: hRate,
        missRate: mRate,
        AMAT: amat,
        TMAT: tmat,
        cacheAccessTime,
        missPenalty,
        mappingType,
        replacementPolicy,
        readPolicy,
        cacheBlocks,
        associativity: associativity || 0
    };
}