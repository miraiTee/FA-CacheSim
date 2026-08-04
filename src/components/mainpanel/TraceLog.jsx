import React, { useState } from "react";
import "./TraceLog.css";

export default function TracePanel({ sequence = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  // Download sequence trace as a .txt file
  const handleDownload = () => {
    if (sequence.length === 0) return;

    const traceText = sequence
      .map((item) => (typeof item === "object" ? item.address : item))
      .join("\n");

    const blob = new Blob([traceText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `cache_trace_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="panel-container">
      <div className="card">
        {/* Hanging Bookmark Tabs Bar */}
        <div className="bookmark-bar">
          <div className="bookmark-label">TRACE LOG</div>

          {/* Action Tabs */}
          <div className="bookmark-actions">
            <button
              className="tab-btn"
              onClick={() => setIsOpen(true)}
              disabled={sequence.length === 0}>
              EXPAND
            </button>
            <button
              className="tab-btn"
              onClick={handleDownload}
              disabled={sequence.length === 0}>
              DOWNLOAD .TXT
            </button>
          </div>
        </div>

        {/* Clean Sequence Stream Body */}
        <div className="card-body">
          <div className="stream-container">
            {sequence.length === 0 ? (
              <span className="empty-snippet">No trace log detected.</span>
            ) : (
              sequence.map((item, idx) => {
                const address = typeof item === "object" ? item.address : item;
                return (
                  <div key={idx} className="tile">
                    <span className="val">{address}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Expanded Blurred Overlay Modal */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-ribbon">
              <span className="ribbon-title">FULL TRACE SEQUENCE</span>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="sequence-grid">
                {sequence.map((item, idx) => {
                  const address =
                    typeof item === "object" ? item.address : item;
                  return (
                    <div key={idx} className="modal-tile">
                      <span className="modal-val">{address}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="modal-footer">
              <span className="count-info">
                {sequence.length} TOTAL ACCESSES
              </span>
              <button
                className="tab-btn modal-download"
                onClick={handleDownload}>
                DOWNLOAD .TXT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
