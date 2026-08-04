import React from 'react';
import CacheList from './CacheList';
import CacheBlock from './CacheBlock';
import CachePointer from './CachePointer';

export default function CacheContainer({
  policy = 'LRU',
  cacheState = [],
}) {
  const isLRUPolicy = policy.toUpperCase() === 'LRU';

  return (
    <div className={`cache-container cache-container--${policy.toLowerCase()}`}>
      <div className="cache-container__header">
        <h2 className="cache-container__title">
          {policy.toUpperCase()} Cache
        </h2>

        <span className="cache-container__subtitle">
          {isLRUPolicy ? 'Least Recently Used' : 'Most Recently Used'}
        </span>
      </div>

      <CacheList>
        {cacheState.map((slot, index) => (
          <CacheBlock
            key={`${policy.toLowerCase()}-slot-${index}`}
            slotIndex={index}
            data={slot.data}
            recencyPercent={slot.recencyPercent}
            status={slot.status}
          >
            {slot.isMRU && <CachePointer type="MRU" />}
            {slot.isLRU && <CachePointer type="LRU" />}
          </CacheBlock>
        ))}
      </CacheList>
    </div>
  );
}