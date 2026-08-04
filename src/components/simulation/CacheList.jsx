import React from 'react';

export default function CacheList({ slots = [] }) {
  return (
    <div className="cache-table-container">
      <table className="cache-table">
        <thead>
          <tr>
            <th className="col-slot">SLOT</th>
            <th className="col-data">DATA</th>
            <th className="col-recency">RECENCY</th>
            <th className="col-pointer">POINTER</th>
          </tr>
        </thead>

        <tbody>
          {slots.length === 0 ? (
            <tr>
              <td colSpan="4" className="empty-cache-cell">
                No cache slots initialized.
              </td>
            </tr>
          ) : (
            slots.map((slot) => {
              const recency = Math.max(0, Math.min(100, slot.recencyPercent));
              const isEmpty = slot.data === null || slot.data === undefined;

              return (
                <tr key={slot.slotIndex} className={`cache-row status-${slot.status}`}>
                  {/* Slot Number */}
                  <td className="col-slot">#{slot.slotIndex}</td>

                  {/* Data Tag */}
                  <td className="col-data">
                    {isEmpty ? (
                      <span className="empty-tag">-- EMPTY --</span>
                    ) : (
                      <span className="data-tag">[ {slot.data} ]</span>
                    )}
                  </td>

                  {/* Recency Percentage & Visual Bar */}
                  <td className="col-recency">
                    <div className="recency-cell">
                      <span className="recency-val">{Math.round(recency)}%</span>
                      <div className="recency-bar-track">
                        <div
                          className="recency-bar-fill"
                          style={{ width: `${recency}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Pointer Badge */}
                  <td className="col-pointer">
                    {slot.pointerTag ? (
                      <span className="pointer-badge">{slot.pointerTag}</span>
                    ) : (
                      <span className="pointer-none">-</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}