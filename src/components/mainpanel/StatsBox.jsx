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
        <div className="stats-grid">
          <StatTracker
            title="Tot. Mem. Access"
            lru={lruStats.totalTime ?? "0 ns"}
            mru={mruStats.totalTime ?? "0 ns"}
          />
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
          <StatTracker
            title="Ave. Mem. Access"
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