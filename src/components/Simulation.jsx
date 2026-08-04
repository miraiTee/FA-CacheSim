import React, { useState, useEffect } from 'react';
import './index.css';

import Configs from './Configs.jsx';
import CenterElems from './mainpanel/CenterElems.jsx';
import RightElems from './mainpanel/RightElems.jsx';
import CacheContainer from './simulation/CacheContainer.jsx';

import { DEFAULT_CONFIG, SEQUENCE, generateTestCaseSequence } from '../data/configs.js';

const DEFAULT_STATS = {
  totalMemoryAccessTime: 0,
  cacheHitCount: 0,
  cacheMissCount: 0,
  avgMemoryAccessTime: 0,
  hitRate: 0,
  missRate: 0,
};

export default function SimulationApp() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [lruCacheState, setLruCacheState] = useState([]);
  const [mruCacheState, setMruCacheState] = useState([]);
  const [lruStats, setLruStats] = useState(null);
  const [mruStats, setMruStats] = useState(null);

  // Initialized to 0 by default
  const [currentMem, setCurrentMem] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [traceLogs, setTraceLogs] = useState([]);

  // Initial sequence state generated directly from DEFAULT_CONFIG
  const [sequenceList, setSequenceList] = useState(() =>
    generateTestCaseSequence(DEFAULT_CONFIG.sequence, DEFAULT_CONFIG.numCacheBlocks)
  );

  // 1. Reset steps, playback, stats, and cache when config/sequence changes
  const handleConfigChange = (newConfig, isSequenceSelection = false) => {
    const isCacheSizeChanged = newConfig.numCacheBlocks !== config.numCacheBlocks;

    setConfig(newConfig);

    // Reset currentMem to 0 along with stats, logs, and playback state
    setCurrentMem(0);
    setIsPlaying(false);
    setLruStats(DEFAULT_STATS);
    setMruStats(DEFAULT_STATS);
    setLruCacheState([]);
    setMruCacheState([]);
    setTraceLogs([]);

    if (isSequenceSelection || isCacheSizeChanged) {
      const updatedSequence = generateTestCaseSequence(
        newConfig.sequence,
        newConfig.numCacheBlocks
      );
      setSequenceList(updatedSequence);
    }
  };

  // 2. Playback Control Handlers
  const handleTogglePlay = () => {
    // If playback reached the end, restart from 0 on play
    if (!isPlaying && currentMem + 1 >= sequenceList.length) {
      setCurrentMem(0);
    }
    setIsPlaying((prev) => !prev);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  // 3. Step progression timer effect when playing
  useEffect(() => {
    let interval = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentMem((prev) => {
          // Pause automatically when sequence ends
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

  const totalMemoryWords = (config.blockSize || 0) * (config.mainMemoryBlocks || 0);

  const playerProps = {
    currentMem,
    totalMem: sequenceList.length,
    isPlaying,
    onTogglePlay: handleTogglePlay,
    onPause: handlePause,
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
            lruStats={lruStats}
            mruStats={mruStats}
            sequenceData={sequenceList}
            isRandom={config.sequence === SEQUENCE.C}
          />
        </div>
      </aside>
    </div>
  );
}