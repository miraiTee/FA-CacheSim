import React, { useState, useEffect, useCallback } from "react";
import "./index.css";

import Configs from "./Configs.jsx";
import CenterElems from "./mainpanel/CenterElems.jsx";
import RightElems from "./mainpanel/RightElems.jsx";
import CacheContainer from "./simulation/CacheContainer.jsx";

import { simulateCacheWithLogs } from "../sim/algos.js";
import {
  DEFAULT_CONFIG,
  SEQUENCE,
  generateTestCaseSequence,
} from "../data/configs.js";

// Helper to calculate live stats for the current playback step
const getLiveStats = (simResult, currentStep) => {
  if (!simResult || !simResult.logs || simResult.logs.length === 0)
    return simResult;

  const currentLogs = simResult.logs.slice(0, currentStep + 1);
  const totalAccess = currentLogs.length;
  const hitCount = currentLogs.filter((log) => log.result === "HIT").length;
  const missCount = totalAccess - hitCount;
  const hitRate = totalAccess > 0 ? hitCount / totalAccess : 0;
  const missRate = 1 - hitRate;

  const cacheAccessTime = simResult.cacheAccessTime || 10;
  const missPenalty = simResult.missPenalty || 100;

  // AMAT = Hit Time + (Miss Rate * Miss Penalty)
  const AMAT = cacheAccessTime + missRate * missPenalty;
  // Total Access Time (TMAT) = Total Accesses * AMAT
  const TMAT = totalAccess * AMAT;

  return {
    ...simResult,
    totalAccess,
    hitCount,
    missCount,
    hitRate,
    missRate,
    AMAT,
    TMAT,
  };
};

export default function SimulationApp() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  // 1. Memory Sequence
  const [sequenceList, setSequenceList] = useState(() =>
    generateTestCaseSequence(
      DEFAULT_CONFIG.sequence,
      DEFAULT_CONFIG.numCacheBlocks,
    ),
  );
  const [currentMem, setCurrentMem] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 2. Compute full simulations (stats + full step logs) directly on render
  const lruSimResult = simulateCacheWithLogs({
    sequence: sequenceList,
    cacheBlocks: config.numCacheBlocks,
    mappingType: config.mappingType || "full",
    replacementPolicy: "LRU",
    cacheAccessTime: config.cacheAccessTime || 10,
    memoryAccessTime: config.memoryAccessTime || 100,
    readPolicy: config.readPolicy,
    associativity: config.associativity || 0,
  });

  const mruSimResult = simulateCacheWithLogs({
    sequence: sequenceList,
    cacheBlocks: config.numCacheBlocks,
    mappingType: config.mappingType || "full",
    replacementPolicy: "MRU",
    cacheAccessTime: config.cacheAccessTime || 10,
    memoryAccessTime: config.memoryAccessTime || 100,
    readPolicy: config.readPolicy,
    associativity: config.associativity || 0,
  });

  // 3. Derive current live state directly from step logs
  const traceLogs = lruSimResult.logs.slice(0, currentMem + 1);

  // Compute step-synchronized stats for UI cards
  const liveLruStats = getLiveStats(lruSimResult, currentMem);
  const liveMruStats = getLiveStats(mruSimResult, currentMem);

  // Instant mode / Jump to end handler
  const handleJumpToEnd = useCallback(() => {
    setIsPlaying(false);
    if (sequenceList.length > 0) {
      setCurrentMem(sequenceList.length - 1);
    }
  }, [sequenceList.length]);

  // Helper to map snapshot array to slot state
  // Helper to map snapshot array to static physical slots with dynamic recency
  const buildCacheState = (simResult, currentStep, totalCacheBlocks) => {
    const currentLog = simResult.logs[currentStep];
    if (!currentLog) return [];

    const physicalSlots = currentLog.snapshot || []; // Fixed slot values
    const recencyQueue = currentLog.recencyQueue || []; // Access order [LRU ... MRU]
    const activeBlock = currentLog.blk;
    const resultType = currentLog.result;

    const lruBlock = recencyQueue.length > 0 ? recencyQueue[0] : null;
    const mruBlock =
      recencyQueue.length > 0 ? recencyQueue[recencyQueue.length - 1] : null;

    return Array.from({ length: totalCacheBlocks }, (_, slotIndex) => {
      // Data stays pinned to physical slot index!
      const blockVal = physicalSlots[slotIndex] ?? null;

      // Find where this block sits in the recency queue
      const recencyIndex = recencyQueue.indexOf(blockVal);
      let recencyPercent = 0;
      if (blockVal !== null && recencyIndex !== -1 && recencyQueue.length > 0) {
        recencyPercent =
          recencyQueue.length === 1
            ? 100
            : Math.round((recencyIndex / (recencyQueue.length - 1)) * 100);
      }

      // Dynamic pointers: attach badges to whichever physical slot holds lruBlock or mruBlock
      let pointerTag = null;
      if (blockVal !== null) {
        if (blockVal === mruBlock) pointerTag = "MRU";
        else if (blockVal === lruBlock) pointerTag = "LRU";
      }

      const isAccessedSlot = blockVal !== null && blockVal === activeBlock;

      return {
        slotNumber: `#${slotIndex}`,
        data: blockVal,
        recencyPercent,
        status: isAccessedSlot
          ? resultType === "HIT"
            ? "hit"
            : "miss"
          : "idle",
        pointerTag,
      };
    });
  };

  // 4. Declare cache states for both policies
  const lruCacheState = buildCacheState(
    lruSimResult,
    currentMem,
    config.numCacheBlocks,
  );
  const mruCacheState = buildCacheState(
    mruSimResult,
    currentMem,
    config.numCacheBlocks,
  );

  // 5. Config change handler
  const handleConfigChange = (newConfig, isSequenceSelection = false) => {
    const isCacheSizeChanged =
      newConfig.numCacheBlocks !== config.numCacheBlocks;

    let updatedSequence = sequenceList;
    if (
      isSequenceSelection ||
      isCacheSizeChanged ||
      newConfig.sequence !== config.sequence
    ) {
      updatedSequence = generateTestCaseSequence(
        newConfig.sequence,
        newConfig.numCacheBlocks,
      );
      setSequenceList(updatedSequence);
    }

    setConfig(newConfig);

    if (newConfig.simulationMode === "instant") {
      setIsPlaying(false);
      setCurrentMem(Math.max(0, updatedSequence.length - 1));
    } else {
      setCurrentMem(0);
      setIsPlaying(false);
    }
  };

  // 6. Playback Timer Effect
  useEffect(() => {
    let interval = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentMem((prev) => {
          if (prev + 1 >= sequenceList.length) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isPlaying, sequenceList.length]);

  // Playback Control Handlers
  const handleTogglePlay = () => {
    if (!isPlaying && currentMem + 1 >= sequenceList.length) {
      setCurrentMem(0);
    }
    setIsPlaying((prev) => !prev);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const totalMemoryWords =
    (config.blockSize || 0) * (config.mainMemoryBlocks || 0);

  const playerProps = {
    currentMem,
    totalMem: sequenceList.length,
    isPlaying,
    onTogglePlay: handleTogglePlay,
    onPause: handlePause,
    onJumpToEnd: handleJumpToEnd,
    totalMemoryWords,
  };

  return (
    <div className="simulation-layout">
      {/* 1. TOP SECTION (Cache Tables) */}
      <main className="simulation-area">
        <div className="cache-containers-wrapper">
          <CacheContainer
            key={`lru-${config.numCacheBlocks}`}
            policy="LRU"
            numCacheBlocks={config.numCacheBlocks}
            cacheState={lruCacheState}
          />
          <CacheContainer
            key={`mru-${config.numCacheBlocks}`}
            policy="MRU"
            numCacheBlocks={config.numCacheBlocks}
            cacheState={mruCacheState}
          />
        </div>
      </main>

      {/* 2. BOTTOM BAR */}
      <aside className="config-bottombar">
        {/* Column 1: Config */}
        <div className="bottombar-col bottombar-col--left">
          <Configs
            config={config}
            onRunSimulation={handleConfigChange}
            onJumpToEnd={handleJumpToEnd}
          />
        </div>

        {/* Column 2: Player & Trace Log */}
        <div className="bottombar-col bottombar-col--center">
          <CenterElems playerProps={playerProps} traceLogs={traceLogs} />
        </div>

        {/* Column 3: Stats & Sequence Panel */}
        <div className="bottombar-col bottombar-col--right">
          <RightElems
            lruStats={liveLruStats}
            mruStats={liveMruStats}
            sequenceData={sequenceList}
            isRandom={config.sequence === SEQUENCE.C}
          />
        </div>
      </aside>
    </div>
  );
}
