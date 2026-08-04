import React, { useState } from "react";
import "./TraceLog.css";

export default function TraceLog({ sequence = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to safely extract block value regardless of data format
  const getBlockVal = (item) => {
    if (typeof item === "object" && item !== null) {
      return item.blk !== undefined ? item.blk : (item.address ?? "N/A");
    }
    return item;
  };

  // Download trace log sequence as a formatted .txt file matching the new structure
  const handleDownload = () => {
    if (sequence.length === 0) return;

    const traceText = [
      "idx\tblk\t|\tLRU: way\tres\tevict\t|\tMRU: way\tres\tevict",
      ...sequence.map((item, idx) => {
        if (
          typeof item === "object" &&
          item !== null &&
          item.step !== undefined
        ) {
          const lruWay = item.lruWay ?? "-";
          const lruRes = item.lruResult || "-";
          const lruEvict =
            item.lruEvict !== "N/A" &&
            item.lruEvict !== null &&
            item.lruEvict !== undefined
              ? item.lruEvict
              : "-";

          const mruWay = item.mruWay ?? "-";
          const mruRes = item.mruResult || "-";
          const mruEvict =
            item.mruEvict !== "N/A" &&
            item.mruEvict !== null &&
            item.mruEvict !== undefined
              ? item.mruEvict
              : "-";

          return `${idx}\t${item.blk}\t|\t${lruWay}\t${lruRes}\t${lruEvict}\t|\t${mruWay}\t${mruRes}\t${mruEvict}`;
        }
        return `${idx}\t${getBlockVal(item)}\t|\t-\t-\t-\t|\t-\t-\t-`;
      }),
    ].join("\n");

    const blob = new Blob([traceText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `cache_trace_log_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="panel-container">
      <div className="card">
        {/* Hanging Bookmark Bar (Pinned to Top) */}
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
                const blockVal = getBlockVal(item);
                return (
                  <div key={idx} className="tile">
                    <span className="val">{blockVal}</span>
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
          <div
            className="modal modal--wide"
            onClick={(e) => e.stopPropagation()}>
            <div className="modal-ribbon">
              <span className="ribbon-title">CACHE TRACE LOG</span>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              {typeof sequence[0] === "object" &&
              sequence[0]?.step !== undefined ? (
                <div className="table-wrapper">
                  <table className="trace-table">
                    <thead>
                      <tr>
                        <th rowSpan="2" className="col-idx">
                          idx
                        </th>
                        <th rowSpan="2" className="col-blk">
                          blk
                        </th>
                        <th rowSpan="2" className="col-divider">
                          |
                        </th>
                        <th colSpan="3" className="header-group lru-header">
                          LRU
                        </th>
                        <th rowSpan="2" className="col-divider">
                          |
                        </th>
                        <th colSpan="3" className="header-group mru-header">
                          MRU
                        </th>
                      </tr>
                      <tr>
                        <th className="sub-header lru-header">way</th>
                        <th className="sub-header lru-header">res</th>
                        <th className="sub-header lru-header">evict</th>
                        <th className="sub-header mru-header">way</th>
                        <th className="sub-header mru-header">res</th>
                        <th className="sub-header mru-header">evict</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sequence.map((log, idx) => (
                        <tr key={idx}>
                          <td className="col-idx">{idx}</td>
                          <td className="col-blk">{log.blk}</td>
                          <td className="col-divider">|</td>

                          {/* LRU Columns */}
                          <td className="lru-col">{log.lruWay ?? "-"}</td>
                          <td className="lru-col">
                            <span
                              className={`status-badge badge--${log.lruResult?.toLowerCase()}`}>
                              {log.lruResult || "-"}
                            </span>
                          </td>
                          <td className="lru-col">
                            {log.lruEvict !== "N/A" &&
                            log.lruEvict !== null &&
                            log.lruEvict !== undefined
                              ? log.lruEvict
                              : "-"}
                          </td>

                          <td className="col-divider">|</td>

                          {/* MRU Columns */}
                          <td className="mru-col">{log.mruWay ?? "-"}</td>
                          <td className="mru-col">
                            <span
                              className={`status-badge badge--${log.mruResult?.toLowerCase()}`}>
                              {log.mruResult || "-"}
                            </span>
                          </td>
                          <td className="mru-col">
                            {log.mruEvict !== "N/A" &&
                            log.mruEvict !== null &&
                            log.mruEvict !== undefined
                              ? log.mruEvict
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Fallback Grid View for simple sequence lists */
                <div className="sequence-grid">
                  {sequence.map((item, idx) => (
                    <div key={idx} className="modal-tile">
                      <span className="modal-val">{getBlockVal(item)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <span className="count-info">
                {sequence.length} ACCESSED STEPS
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
