import React, { useState } from 'react';
import './index.css';

import Configs from './Configs.jsx';
import CenterElems from './mainpanel/CenterElems.jsx';
import RightElems from './mainpanel/RightElems.jsx';
import CacheContainer from './simulation/CacheContainer.jsx';

import { DEFAULT_CONFIG, generateTestCaseSequence } from '../data/configs.js';

export default function SimulationApp() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [lruCacheState, setLruCacheState] = useState([]);
  const [mruCacheState, setMruCacheState] = useState([]);
  const [sequenceList, setSequenceList] = useState(() => 
    generateTestCaseSequence(DEFAULT_CONFIG.sequence, DEFAULT_CONFIG.numCacheBlocks)
  );

  const handleConfigChange = (newConfig) => {
    setConfig(newConfig);
    const updatedSequence = generateTestCaseSequence(
      newConfig.sequence,
      newConfig.numCacheBlocks
    );
    setSequenceList(updatedSequence);
  };

  const handleRunSimulation = (finalConfig) => {
    setConfig(finalConfig);
    const generatedSequence = generateTestCaseSequence(
      finalConfig.sequence,
      finalConfig.numCacheBlocks
    );
    setSequenceList(generatedSequence);
    setLruCacheState([]);
    setMruCacheState([]);
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

      {/* 2. BOTTOM BAR (3 Distinct Control/Stats Columns) */}
      <aside className="config-bottombar">
        {/* Column 1: Config (Fixed 320px) */}
        <div className="bottombar-col bottombar-col--left">
          <Configs 
            config={config} 
            onRunSimulation={handleRunSimulation} 
          />
        </div>
    
        {/* Column 2: Center Controls (Flex Grow) */}
        <div className="bottombar-col bottombar-col--center">
          <CenterElems config={config} sequence={sequenceList} />
        </div>

        {/* Column 3: Stats (Auto / Flex-Shrink 0) */}
        <div className="bottombar-col bottombar-col--right">
          <RightElems sequence={sequenceList} />
        </div>
      </aside>
    </div>
  );
}