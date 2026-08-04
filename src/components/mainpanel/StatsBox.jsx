import React from 'react';
import StatTracker from './StatTracker';
import './StatsBox.css';

export default function StatsBox({
  lruStats,
  mruStats,
}) {
  const lru = lruStats || {};
  const mru = mruStats || {};

  return (
    <div className="stats-box-container">
      {/* ROW 1 */}
      <StatTracker
        title="Tot. Mem. Access"
        lru={lru.totalTime ?? "0 ns"}
        mru={mru.totalTime ?? "0 ns"}
      />
      <StatTracker
        title="Cache Hit"
        lru={lru.hits ?? 0}
        mru={mru.hits ?? 0}
      />
      <StatTracker
        title="Cache Miss"
        lru={lru.misses ?? 0}
        mru={mru.misses ?? 0}
      />

      {/* ROW 2 */}
      <StatTracker
        title="Ave. Mem. Access"
        lru={lru.amat ?? "0.00 ns"}
        mru={mru.amat ?? "0.00 ns"}
      />
      <StatTracker
        title="Hit Rate"
        lru={lru.hitRate ?? "0.00%"}
        mru={mru.hitRate ?? "0.00%"}
      />
      <StatTracker
        title="Miss Rate"
        lru={lru.missRate ?? "0.00%"}
        mru={mru.missRate ?? "0.00%"}
      />
    </div>
  );
}