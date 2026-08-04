import React from 'react';
import './StatTracker.css';

export default function StatTracker({ title, lru, mru }) {
  return (
    <div className="stat-card">
      <div className="title">{title}</div>
      <div className="stat-row">
        <span className="lru">LRU:</span>
        <span className="stat-val">{lru}</span>
      </div>
      <div className="stat-row">
        <span className="mru">MRU:</span>
        <span className="stat-val">{mru}</span>
      </div>
    </div>
  );
}