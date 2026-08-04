import React, { useState } from 'react';
import './TraceLog.css';

export default function TraceLog({ sequence = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  // Download sequence trace as a .txt file
  const handleDownload = () => {
    if (sequence.length === 0) return;

    const traceText = sequence
      .map((item) => (typeof item === 'object' ? item.address : item))
      .join('\n');

    const blob = new Blob([traceText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `cache_trace_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="trace-panel-container">
      <div className="trace-log-card">
        {/* Hanging Bookmark Tabs Bar */}
        <div className="trace-bookmark-bar">
          <div className="trace-bookmark-tab main-label">TRACE LOG</div>
          
          {/* Action Tabs replacement */}
          <div className="trace-bookmark-actions">
            <button
              className="trace-tab-btn"
              onClick={() => setIsOpen(true)}
              disabled={sequence.length === 0}
            >
              EXPAND
            </button>
            <button
              className="trace-tab-btn"
              onClick={handleDownload}
              disabled={sequence.length === 0}
            >
              DOWNLOAD .TXT
            </button>
          </div>
        </div>

        {/* Clean Sequence Stream Body */}
        <div className="trace-log-body">
          <div className="trace-stream-container">
            {sequence.length === 0 ? (
              <span className="empty-snippet">No trace log detected.</span>
            ) : (
              sequence.map((item, idx) => {
                const address = typeof item === 'object' ? item.address : item;
                return (
                  <div key={idx} className="trace-tile">
                    <span className="trace-val">{address}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Expanded Blurred Overlay Modal */}
      {isOpen && (
        <div className="trace-overlay" onClick={() => setIsOpen(false)}>
          <div className="trace-modal" onClick={(e) => e.stopPropagation()}>
            <div className="trace-modal-ribbon">
              <span className="ribbon-title">FULL TRACE SEQUENCE</span>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            <div className="trace-modal-body">
              <div className="expanded-sequence-grid">
                {sequence.map((item, idx) => {
                  const address = typeof item === 'object' ? item.address : item;
                  return (
                    <div key={idx} className="modal-tile">
                      <span className="modal-val">{address}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="trace-modal-footer">
              <span className="count-info">{sequence.length} TOTAL ACCESSES</span>
              <button className="trace-tab-btn modal-download" onClick={handleDownload}>
                DOWNLOAD .TXT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}