import React from 'react';
import './SequencePanel.css';

export default function SequencePanel({ sequence = [] }) {
  return (
    <div className="sequence-panel-container">
      <div className="sequence-panel">
        {/* Top Pinned Bookmark Ribbon */}
        <div className="sequence-bookmark-bar">
          <div className="sequence-bookmark-tab">SEQUENCE</div>
        </div>

        {/* Content Stream Area */}
        <div className="sequence-stream-container">
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