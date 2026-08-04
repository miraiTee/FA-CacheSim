import React, { useState, useEffect } from 'react';
import './index.css';

import Configs from './Configs.jsx';
import CenterElems from './mainpanel/CenterElems.jsx';
import RightElems from './mainpanel/RightElems.jsx';
import CacheContainer from './simulation/CacheContainer.jsx';

import { 
  runCacheSimulation,
  createCacheSimulator,
  simulateStep 
} from '../sim/algos.js';
import { DEFAULT_CONFIG, SEQUENCE, generateTestCaseSequence } from '../data/configs.js';

const DEFAULT_STATS = {
  totalAccess: 0,
  hitCount: 0, 
  missCount: 0,
  AMAT: 0,
  TMAT: 0,
  hitRate: 0,
  missRate: 0,
};

export default function SimulationApp() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  // Initial sequence generated directly from DEFAULT_CONFIG
  const [sequenceList, setSequenceList] = useState(() =>
    generateTestCaseSequence(DEFAULT_CONFIG.sequence, DEFAULT_CONFIG.numCacheBlocks)
  );

  const [currentMem, setCurrentMem] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [traceLogs, setTraceLogs] = useState([]);

  // Simulators & Live Cache Display States
  const [lruSimulator, setLruSimulator] = useState(() =>
    createCacheSimulator({
      sequence: generateTestCaseSequence(DEFAULT_CONFIG.sequence, DEFAULT_CONFIG.numCacheBlocks),
      cacheBlocks: DEFAULT_CONFIG.numCacheBlocks,
      mappingType: "full",
      replacementPolicy: "LRU"
    })
  );

  const [mruSimulator, setMruSimulator] = useState(() =>
    createCacheSimulator({
      sequence: generateTestCaseSequence(DEFAULT_CONFIG.sequence, DEFAULT_CONFIG.numCacheBlocks),
      cacheBlocks: DEFAULT_CONFIG.numCacheBlocks,
      mappingType: "full",
      replacementPolicy: "MRU"
    })
  );

  const [lruCacheState, setLruCacheState] = useState([]);
  const [mruCacheState, setMruCacheState] = useState([]);

  // Direct calculation of LRU and MRU stats on render
  const lruStats = runCacheSimulation({
    sequence: sequenceList,
    cacheBlocks: config.numCacheBlocks,
    mappingType: "full",
    replacementPolicy: "LRU",
    cacheAccessTime: 10,
    memoryAccessTime: 100,
    readPolicy: config.readPolicy
  }) || DEFAULT_STATS;

  const mruStats = runCacheSimulation({
    sequence: sequenceList,
    cacheBlocks: config.numCacheBlocks,
    mappingType: "full",
    replacementPolicy: "MRU",
    cacheAccessTime: 10,
    memoryAccessTime: 100,
    readPolicy: config.readPolicy
  }) || DEFAULT_STATS;

  // 1. Reset steps, playback, logs, and cache when config/sequence changes
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

    // Reset stepping states
    setCurrentMem(0);
    setIsPlaying(false);
    setTraceLogs([]);

    // Initialize fresh simulators
    const newLruSim = createCacheSimulator({
      sequence: updatedSequence,
      cacheBlocks: newConfig.numCacheBlocks,
      mappingType: "full",
      replacementPolicy: "LRU"
    });

    const newMruSim = createCacheSimulator({
      sequence: updatedSequence,
      cacheBlocks: newConfig.numCacheBlocks,
      mappingType: "full",
      replacementPolicy: "MRU"
    });

    setLruSimulator(newLruSim);
    setMruSimulator(newMruSim);
    setLruCacheState([]);
    setMruCacheState([]);
  };

  // 2. Step progression timer effect when playing
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

  // 3. Step forward simulators whenever currentMem advances
  useEffect(() => {
    if (!lruSimulator || !mruSimulator || sequenceList.length === 0) return;

    let nextLruSim = { ...lruSimulator };
    let nextMruSim = { ...mruSimulator };

    if (nextLruSim.currentStep <= currentMem && !nextLruSim.finished) {
      nextLruSim = simulateStep(nextLruSim);
      nextMruSim = simulateStep(nextMruSim);

      setLruSimulator(nextLruSim);
      setMruSimulator(nextMruSim);

      setLruCacheState([...nextLruSim.cache]);
      setMruCacheState([...nextMruSim.cache]);

      if (nextLruSim.logs.length > 0) {
        setTraceLogs([...nextLruSim.logs]);
      }
    }
  }, [currentMem]);

  // Playback Control Handlers
  const handleTogglePlay = () => {
    if (!isPlaying && currentMem + 1 >= sequenceList.length) {
      handleConfigChange(config);
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