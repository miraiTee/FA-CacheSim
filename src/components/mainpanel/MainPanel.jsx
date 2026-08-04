import React from 'react';
import StatsBox from './StatsBox';
import './MainPanel.css';

export default function MainPanel({ lruStats, mruStats }) {
    return (
        <div className="main-panel">
        {/* 1. STATS BOX CONTAINER */}
        <section className="main-panel-section">
        <StatsBox lruStats={lruStats} mruStats={mruStats} />
        </section>

        {/* 2. SEQUENCE SECTION (Slot ready for later!) */}
        <section className="main-panel-section sequence-slot">
        {/* <Sequence /> component will go here later */}
        </section>
        </div>
    );
}
