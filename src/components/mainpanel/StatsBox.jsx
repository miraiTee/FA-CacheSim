import React from "react";
import StatTracker from "./StatTracker";
import "./StatsBox.css";

export default function StatsBox({ lruStats, mruStats }) {
  const lru = lruStats || {};
  const mru = mruStats || {};

  // Helpers to format rates and timings cleanly
  const formatPercent = (val) =>
    val !== undefined && val !== null ? `${(val * 100).toFixed(2)}%` : "0.00%";

  const formatNs = (val) =>
    val !== undefined && val !== null
      ? `${Number(val).toFixed(2)} ns`
      : "0.00 ns";

  return (
    <div className="stats-box-container">
      {/* ROW 1 */}
      <StatTracker
        title="Tot. Mem. Access"
        lru={formatNs(lru.TMAT)}
        mru={formatNs(mru.TMAT)}
      />
      <StatTracker
        title="Cache Hit"
        lru={lru.hitCount ?? 0}
        mru={mru.hitCount ?? 0}
      />
      <StatTracker
        title="Cache Miss"
        lru={lru.missCount ?? 0}
        mru={mru.missCount ?? 0}
      />

      {/* ROW 2 */}
      <StatTracker
        title="Ave. Mem. Access"
        lru={formatNs(lru.AMAT)}
        mru={formatNs(mru.AMAT)}
      />
      <StatTracker
        title="Hit Rate"
        lru={formatPercent(lru.hitRate)}
        mru={formatPercent(mru.hitRate)}
      />
      <StatTracker
        title="Miss Rate"
        lru={formatPercent(lru.missRate)}
        mru={formatPercent(mru.missRate)}
      />
    </div>
  );
}
