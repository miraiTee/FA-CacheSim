import React from 'react';
import StatsBox from './StatsBox';
import SequencePanel from './SequencePanel';
import './RightElems.css';

export default function RightElems({
  lruStats = null,
  mruStats = null,
  sequenceData = [],
  isRandom = false,
}) {
  return (
    <div className="right-elems">
      {/* 1. STATS BOX */}
      <div className="stats-section">
        <StatsBox lruStats={lruStats} mruStats={mruStats} />
      </div>

      {/* 2. SEQUENCE PANEL */}
      <div className="sequence-section">
        <SequencePanel 
          sequence={sequenceData} 
          isRandom={isRandom}
        />
      </div>
    </div>
  );
}