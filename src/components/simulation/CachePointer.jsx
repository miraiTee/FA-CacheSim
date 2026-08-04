import React from 'react';

export const CachePointer = ({ type }) => {
  const isMRU = type === 'MRU';

  const badgeStyles = isMRU
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/40 shadow-[0_0_8px_rgba(99,102,241,0.2)]';

  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-mono font-bold animate-pulse ${badgeStyles}`}>
      <span>←</span>
      <span>{type}</span>
    </div>
  );
};