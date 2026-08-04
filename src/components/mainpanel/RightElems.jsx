import React from 'react';
import StatsBox from '../mainpanel/StatsBox';
import SequencePanel from '../mainpanel/SequencePanel';
import './RightElems.css';

/** Wrapper for rightmost items (player/trace log) */
export default function RightElems({
  lruStats,
  mruStats,
  sequenceData,
}) {
  return (
    <div className="right-elems">
      <div className="stats-section">
        <StatsBox lruStats={lruStats} mruStats={mruStats} />
      </div>
      <div className="sequence-section">
        <SequencePanel data={sequenceData} />
      </div>
    </div>
  );
}