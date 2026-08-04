import React from 'react';
import Player from './Player';
import TraceLog from './TraceLog';
import './CenterElems.css';

export default function CenterElems({ 
  playerProps, 
  traceLogs 
}) {
  return (
    <div className="main-panel">
      {/* 1. Player Controls */}
      <section className="main-panel-section">
        <Player {...playerProps} />
      </section>

      {/* 2. Trace Log (Expands vertically) */}
      <section className="main-panel-section main-panel-section--trace">
        <TraceLog logs={traceLogs} />
      </section>
    </div>
  );
}