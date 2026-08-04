import React from 'react';
import CacheList from './CacheList';
import './CacheComponents.css';

export default function CacheContainer({
  policy = 'LRU',
  numCacheBlocks = 16,
  cacheState = [],
}) {
  // Extract numbers safely even if passed as "4 Blocks" or a raw number
  const parsedCount = typeof numCacheBlocks === 'string'
    ? parseInt(numCacheBlocks.replace(/\D/g, ''), 10)
    : Number(numCacheBlocks);

  const totalSlots = parsedCount && !isNaN(parsedCount) && parsedCount > 0 
    ? parsedCount 
    : 16;

  // Find min/max recency values to identify LRU and MRU pointers
  const activeRecencies = cacheState.map((item) => item?.recencyPercent ?? 0);
  const maxRecency = Math.max(...activeRecencies, 0);
  const minRecency = Math.min(...activeRecencies, 100);

  const slots = Array.from({ length: totalSlots }, (_, index) => {
    const liveData = cacheState[index];
    const recency = liveData?.recencyPercent ?? 0;

    // Optional pointer tagging logic
    let pointerTag = liveData?.pointerTag ?? null;
    if (!pointerTag && liveData?.data !== null && liveData?.data !== undefined) {
      if (recency === maxRecency) pointerTag = 'MRU';
      else if (recency === minRecency) pointerTag = 'LRU';
    }

    return {
      slotIndex: index,
      data: liveData?.data ?? null,
      recencyPercent: recency,
      status: liveData?.status ?? 'idle', // 'idle' | 'hit' | 'miss' | 'evicted'
      pointerTag: pointerTag,
    };
  });

  return (
    <div className={`cache-container cache-container--${policy.toLowerCase()}`}>
      <div className="cache-container__header">
        <h2 className="cache-container__title">{policy.toUpperCase()} Cache</h2>
        <span className="cache-container__subtitle">
          {policy === 'LRU' ? 'Least Recently Used' : 'Most Recently Used'}
        </span>
      </div>

      <CacheList slots={slots} />
    </div>
  );
}