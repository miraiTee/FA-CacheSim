import React, { useState, useEffect } from 'react';
import './Player.css';

export default function Player({ 
  currentStep = 0, 
  totalSteps = 0, 
  onStepChange 
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play timer
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        onStepChange((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false); // Stop at end
            return prev;
          }
          return prev + 1;
        });
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalSteps, onStepChange]);

  const handlePrev = () => {
    setIsPlaying(false);
    onStepChange((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    onStepChange((prev) => Math.min(totalSteps - 1, prev + 1));
  };

  const togglePlay = () => {
    if (totalSteps === 0) return;
    if (currentStep >= totalSteps - 1) {
      onStepChange(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleScrubberChange = (e) => {
    setIsPlaying(false);
    onStepChange(Number(e.target.value));
  };

  return (
    <div className="player-panel-container">
      <div className="player-panel">
        {/* Top Pinned Ribbon Tab */}
        <div className="player-bookmark-bar">
          <div className="player-bookmark-tab">PLAYER</div>
        </div>

        {/* Timeline Scrubber */}
        <div className="player-scrubber-wrapper">
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={totalSteps === 0 ? 0 : currentStep}
            onChange={handleScrubberChange}
            disabled={totalSteps === 0}
            className="player-timeline-scrubber"
          />
        </div>

        {/* Controls & Counter */}
        <div className="player-controls-row">
          <div className="player-button-group">
            {/* Step Back */}
            <button 
              className="player-btn" 
              onClick={handlePrev} 
              disabled={currentStep === 0 || totalSteps === 0}
              title="Step Back"
            >
               ⮌
            </button>

            {/* Play / Pause Toggle */}
            <button 
              className="player-btn" 
              onClick={togglePlay} 
              disabled={totalSteps === 0}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>

            {/* Step Forward */}
            <button 
              className="player-btn" 
              onClick={handleNext} 
              disabled={currentStep >= totalSteps - 1 || totalSteps === 0}
              title="Step Forward"
            >
              ⮎
            </button>
          </div>

          {/* Step Count */}
          <div className="player-counter">
            MEMORY ACCESSED <span className="player-step-num">{totalSteps > 0 ? currentStep + 1 : 0}</span> / {totalSteps}
          </div>
        </div>
      </div>
    </div>
  );
}