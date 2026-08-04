import React from "react";
import Player from "./Player";
import TraceLog from "./TraceLog";
import "./CenterElems.css";

/** Wrapper for central items (player/trace log) */
export default function CenterElems({ playerProps, traceLogs }) {
  return (
    <div className="main-panel">
      <section className="player-section">
        <Player playerProps={playerProps} />
      </section>

      <section className="trace-section">
        <TraceLog sequence={traceLogs} />
      </section>
    </div>
  );
}
