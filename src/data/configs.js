// Helper to generate powers of 2 from 2^minPower up to 2^maxPower
const generatePowersOfTwo = (minPower, maxPower) =>
    Array.from({ length: maxPower - minPower + 1 }, (_, i) => Math.pow(2, minPower + i));

// Power-of-2 Options up to 2^12 (4096)
export const BLOCK_SIZE_OPTIONS = generatePowersOfTwo(1, 12);  // [2, 4, 8, 16, ..., 4096]
export const CACHE_BLOCK_OPTIONS = generatePowersOfTwo(2, 12); // [4, 8, 16, ..., 4096]

export const READ_POLICY = {
    NON_LOAD_THROUGH: 'non-load-through',
    LOAD_THROUGH: 'load-through',
};

export const SEQUENCE = {
    A: 'A',
    B: 'B',
    C: 'C',
};

export const SIMULATION_MODE = {
    STEP_BY_STEP: 'step-by-step',
    INSTANT: 'instant',
};

// Default Configuration Parameters
export const DEFAULT_CONFIG = {
    blockSize: 16,                        // Minimum 2 words
    numCacheBlocks: 16,                   // Minimum 4 blocks
    mainMemoryBlocks: 1024,               // Fixed at 1024 blocks
    readPolicy: READ_POLICY.NON_LOAD_THROUGH,
    sequence: SEQUENCE.A,
    simulationMode: SIMULATION_MODE.STEP_BY_STEP,
};

/**
 * Test Case Sequence Generator
 * n = total number of cache blocks
 * Returns an array of numeric block indexes (e.g., [0, 1, 2, ...])
 */
export function generateTestCaseSequence(testCaseType, numCacheBlocks) {
    const n = Number(numCacheBlocks);
    let sequence = [];

    switch (testCaseType) {
        case SEQUENCE.A: {
            // Sequential: Access up to 2n blocks, repeat sequence twice.
            const seq = Array.from({ length: 2 * n }, (_, i) => i);
            sequence = [...seq, ...seq];
            break;
        }

        case SEQUENCE.B: {
            // Mid-repeat blocks:
            const seq1 = Array.from({ length: n }, (_, i) => i);
            const seq2 = Array.from({ length: 2 * n }, (_, i) => i);
            const rev1 = [...seq1].reverse();
            const rev2 = [...seq2].reverse();

            sequence = [
                ...seq1,
                ...seq2,
                ...seq2,
                ...rev1,
                ...rev2,
                ...rev2
            ];
            break;
        }

        case SEQUENCE.C: {
            // Random sequence: 64 block accesses from 0 to 1023
            const totalAccesses = 64;
            const maxBlockIndex = 1024;
            sequence = Array.from({ length: totalAccesses }, () =>
                Math.floor(Math.random() * maxBlockIndex)
            );
            break;
        }

        default:
            sequence = [];
    }

    return sequence;
}