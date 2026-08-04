import React from "react";
import CacheList from "./CacheList";
import "./CacheComponents.css";

export default function CacheContainer({
  policy = "LRU",
  numCacheBlocks = 16,
  cacheState = [],
}) {
  // Safely extract total slots from config
  const parsedCount =
    typeof numCacheBlocks === "string"
      ? parseInt(numCacheBlocks.replace(/\D/g, ""), 10)
      : Number(numCacheBlocks);

  const totalSlots =
    parsedCount && !isNaN(parsedCount) && parsedCount > 0 ? parsedCount : 16;

  // Map slots directly from cacheState provided by SimulationApp
  const slots = Array.from({ length: totalSlots }, (_, index) => {
    const liveData = cacheState[index];
    const hasData = liveData?.data !== null && liveData?.data !== undefined;

    return {
      slotIndex: index,
      data: hasData ? liveData.data : null,
      recencyPercent: hasData ? (liveData?.recencyPercent ?? 0) : 0,
      status: hasData ? (liveData?.status ?? "idle") : "idle", // Force empty slots to stay 'idle'
      pointerTag: hasData ? (liveData?.pointerTag ?? null) : null, // Prevent pointers on empty slots
    };
  });

  return (
    <div className={`cache-container cache-container--${policy.toLowerCase()}`}>
      <div className="cache-container__header">
        <h2 className="cache-container__title">{policy.toUpperCase()} Cache</h2>
        <span className="cache-container__subtitle">
          {policy === "LRU" ? "Least Recently Used" : "Most Recently Used"}
        </span>
      </div>

      <CacheList key={`${policy}-${totalSlots}`} slots={slots} />
    </div>
  );
}
