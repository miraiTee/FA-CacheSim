import React from 'react';

export default function StatTracker({ title, lru, mru }) {
  return (
    <div className="stat-card">
      <div className="stat-card-title">{title}</div>
      <div className="stat-row">
        <span className="label-lru">LRU:</span>
        <span className="stat-val">{lru}</span>
      </div>
      <div className="stat-row">
        <span className="label-mru">MRU:</span>
        <span className="stat-val">{mru}</span>
      </div>
    </div>
  );
}