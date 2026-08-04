import React from 'react';
import './Player.css';

export default function Player({ 
  playerProps: { currentMem = 0, totalMem = 0, isPlaying = false, onTogglePlay } 
}) {
  return (
    <div className="player-panel-container">
      <div className="player-panel">
        <div className="player-bookmark-bar">
          <div className="player-bookmark-tab">PLAYER</div>
        </div>

        <div className="player-scrubber-wrapper">
          <input
            type="range"
            min={0}
            max={Math.max(0, totalMem - 1)}
            value={totalMem === 0 ? 0 : currentMem}
            disabled={true}
            className="player-timeline-scrubber"
          />
        </div>

        <div className="player-controls-row">
          <div className="player-button-group">
            <button 
              className="player-btn" 
              onClick={onTogglePlay} 
              disabled={totalMem === 0}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>

          <div className="player-counter">
            MEMORY ACCESSED <span className="player-step-num">{totalMem > 0 ? currentMem + 1 : 0}</span> / {totalMem}
          </div>
        </div>
      </div>
    </div>
  );
}