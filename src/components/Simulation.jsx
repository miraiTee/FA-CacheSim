import React, { useState, useEffect, useCallback } from 'react';
import './index.css';

import Configs from './Configs.jsx';
import CenterElems from './mainpanel/CenterElems.jsx';
import RightElems from './mainpanel/RightElems.jsx';
import CacheContainer from './simulation/CacheContainer.jsx';

import { simulateCacheWithLogs } from '../sim/algos.js';
import { DEFAULT_CONFIG, SEQUENCE, generateTestCaseSequence } from '../data/configs.js';

export default function SimulationApp() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  // 1. Memory Sequence
  const [sequenceList, setSequenceList] = useState(() =>
    generateTestCaseSequence(DEFAULT_CONFIG.sequence, DEFAULT_CONFIG.numCacheBlocks)
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
    associativity: config.associativity || 0
  });

  const mruSimResult = simulateCacheWithLogs({
    sequence: sequenceList,
    cacheBlocks: config.numCacheBlocks,
    mappingType: config.mappingType || "full",
    replacementPolicy: "MRU",
    cacheAccessTime: config.cacheAccessTime || 10,
    memoryAccessTime: config.memoryAccessTime || 100,
    readPolicy: config.readPolicy,
    associativity: config.associativity || 0
  });

  // 3. Derive current live state directly from step logs
  const traceLogs = lruSimResult.logs.slice(0, currentMem + 1);

  // Instant mode / Jump to end handler
  const handleJumpToEnd = useCallback(() => {
    setIsPlaying(false);
    if (sequenceList.length > 0) {
      setCurrentMem(sequenceList.length - 1);
    }
  }, [sequenceList.length]);

  // Helper to map snapshot array to slot state
  const buildCacheState = (simResult, currentStep) => {
    const currentLog = simResult.logs[currentStep];
    const snapshot = currentLog?.snapshot || [];
    const activeBlock = currentLog?.blk;
    const resultType = currentLog?.result; // 'HIT' or 'MISS'

    return snapshot.map((blockVal, idx) => {
      const isCurrent = blockVal === activeBlock;

      // In the snapshot array, index 0 is LRU and index (len - 1) is MRU
      const recencyPercent = snapshot.length > 1
        ? Math.round((idx / (snapshot.length - 1)) * 100)
        : 100;

      let status = 'idle';
      if (isCurrent) {
        status = resultType === 'HIT' ? 'hit' : 'miss';
      }

      return {
        data: blockVal,
        recencyPercent,
        status,
        pointerTag: idx === 0 ? 'LRU' : idx === snapshot.length - 1 ? 'MRU' : null,
      };
    });
  };

  // 4. Declare cache states for both policies
  const lruCacheState = buildCacheState(lruSimResult, currentMem);
  const mruCacheState = buildCacheState(mruSimResult, currentMem);

  // 5. Config change handler
  const handleConfigChange = (newConfig, isSequenceSelection = false) => {
    const isCacheSizeChanged = newConfig.numCacheBlocks !== config.numCacheBlocks;

    let updatedSequence = sequenceList;
    if (isSequenceSelection || isCacheSizeChanged || newConfig.sequence !== config.sequence) {
      updatedSequence = generateTestCaseSequence(
        newConfig.sequence,
        newConfig.numCacheBlocks
      );
      setSequenceList(updatedSequence);
    }

    setConfig(newConfig);

    // Reset or complete step position depending on mode
    if (newConfig.simulationMode === 'instant') {
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

  const totalMemoryWords = (config.blockSize || 0) * (config.mainMemoryBlocks || 0);

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
          <CenterElems 
            playerProps={playerProps} 
            traceLogs={traceLogs}
          />
        </div>

        {/* Column 3: Stats & Sequence Panel */}
        <div className="bottombar-col bottombar-col--right">
          <RightElems 
            lruStats={lruSimResult}
            mruStats={mruSimResult}
            sequenceData={sequenceList}
            isRandom={config.sequence === SEQUENCE.C}
          />
        </div>
      </aside>
    </div>
  );
}