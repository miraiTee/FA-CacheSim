import React from 'react';
import StatTracker from './StatTracker';
import './StatsBox.css';

export default function StatsBox({
  lruStats = {},
  mruStats = {},
}) {
  return (
    <div className="stats-container">
      <div className="stats-box">
        {/* TOP ROW */}
          <StatTracker
            title="Tot. Memory Time Access"
            lru={lruStats.totalTime ?? "0 ns"}
            mru={mruStats.totalTime ?? "0 ns"}
          />
        <div className="stats-row-grid">
          <StatTracker
            title="Cache Hit"
            lru={lruStats.hits ?? 0}
            mru={mruStats.hits ?? 0}
          />
          <StatTracker
            title="Cache Miss"
            lru={lruStats.misses ?? 0}
            mru={mruStats.misses ?? 0}
          />
        </div>

        <br />

        {/* BOTTOM ROW */}
        <div className="stats-row-grid">
          <StatTracker
            title="Ave. Memory Time Access"
            lru={lruStats.amat ?? "0.00 ns"}
            mru={mruStats.amat ?? "0.00 ns"}
          />
          <StatTracker
            title="Hit Rate"
            lru={lruStats.hitRate ?? "0.00%"}
            mru={mruStats.hitRate ?? "0.00%"}
          />
          <StatTracker
            title="Miss Rate"
            lru={lruStats.missRate ?? "0.00%"}
            mru={mruStats.missRate ?? "0.00%"}
          />
        </div>
      </div>
    </div>
  );
}