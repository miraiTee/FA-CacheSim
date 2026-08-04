import React from 'react';
import StatsBox from '../mainpanel/StatsBox';
import SequencePanel from '../mainpanel/SequencePanel';
import './RightElems.css';

export default function RightElems({
  lruStats,
  mruStats,
  sequenceData,
}) {
  return (
    <div className="right-elems">
      <div className="right-elems__section">
        <StatsBox lruStats={lruStats} mruStats={mruStats} />
      </div>
      <div className="right-elems__section right-elems__section--sequence">
        <SequencePanel data={sequenceData} />
      </div>
    </div>
  );
}