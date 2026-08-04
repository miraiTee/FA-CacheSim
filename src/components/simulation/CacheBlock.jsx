import React from 'react';

export default function CacheBlock({ 
  slotIndex, 
  data, 
  recencyPercent = 0, // 0 to 100
  status = 'idle', // 'idle' | 'hit' | 'miss' | 'evicted'
  children // Place for CachePointer(s) on the right side
}) {
  // Glow effect styles based on current state
  const statusGlows = {
    idle: 'border-slate-700 bg-slate-900',
    hit: 'border-emerald-500 bg-emerald-950/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    miss: 'border-amber-500 bg-amber-950/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
    evicted: 'border-rose-500 bg-rose-950/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]',
  };

  return (
    <div className="relative flex items-center gap-3">
      {/* Main Cache Block */}
      <div 
        className={`flex-1 flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-300 ${statusGlows[status]}`}
      >
        {/* Block / Slot Number */}
        <div className="w-16 font-mono text-xs text-slate-400">
          SLOT #{slotIndex}
        </div>

        {/* Data Content */}
        <div className="flex-1 px-4 text-center">
          {data !== null && data !== undefined ? (
            <span className="font-bold text-lg text-slate-100 font-mono">
              [ {data} ]
            </span>
          ) : (
            <span className="text-sm italic text-slate-600">-- EMPTY --</span>
          )}
        </div>

        {/* Recency Bar */}
        <div className="w-28 flex flex-col gap-1">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>REC</span>
            <span>{Math.round(recencyPercent)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 transition-all duration-300"
              style={{ width: `${Math.max(0, Math.min(100, recencyPercent))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Right Side Pointer Container */}
      <div className="w-20 flex flex-col justify-center items-start min-h-[44px]">
        {children}
      </div>
    </div>
  );
}