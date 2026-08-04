import React from 'react';
import './SequencePanel.css';

export default function SequencePanel({ sequence = [] }) {
  return (
    <div className="panel-container">
      <div className="panel">
        {/* Title */}
        <div className="bookmark-bar">
          <div className="bookmark-tab">SEQUENCE</div>
        </div>

        {/* Dynamic Stream Container */}
        <div className="stream-container">
          {sequence.length === 0 ? (
            <span className="empty-sequence-text">No sequence detected.</span>
          ) : (
            sequence.map((item, idx) => {
              const address = typeof item === 'object' ? item.address : item;

              return (
                <div key={idx} className="seq-tile">
                  <span className="seq-val">{address}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}