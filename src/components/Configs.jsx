import React, { useState } from 'react';
import './Configs.css';
import {
    DEFAULT_CONFIG,
    BLOCK_SIZE_OPTIONS,
    CACHE_BLOCK_OPTIONS,
    READ_POLICY,
    SEQUENCE,
    SIMULATION_MODE
} from '../data/configs.js'; // Adjust path as needed

export default function Configs({ onRunSimulation }) {
    const [config, setConfig] = useState(DEFAULT_CONFIG);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Keep string fields as strings, parse numeric inputs to Numbers
        const stringFields = ['readPolicy', 'sequence', 'simulationMode'];
        const parsedValue = stringFields.includes(name) ? value : Number(value);

        setConfig((prev) => ({ ...prev, [name]: parsedValue }));
    };

    const handleRun = () => {
        onRunSimulation(config);
    };

    return (
        <div className="config-container">
            <h2>System Parameters</h2>

            {/* Block Size */}
            <div className="field">
                <label>Block Size:</label>
                <select name="blockSize" value={config.blockSize} onChange={handleChange}>
                    {BLOCK_SIZE_OPTIONS.map((size) => (
                        <option key={size} value={size}>{size} Words</option>
                    ))}
                </select>
            </div>

            {/* Number of Cache Blocks */}
            <div className="field">
                <label>Cache Blocks:</label>
                <select name="numCacheBlocks" value={config.numCacheBlocks} onChange={handleChange}>
                    {CACHE_BLOCK_OPTIONS.map((blocks) => (
                        <option key={blocks} value={blocks}>{blocks} Blocks</option>
                    ))}
                </select>
            </div>

            {/* Main Memory Size (Fixed at 1024) */}
            <div className="field">
                <label>Main Memory:</label>
                <input type="text" value={`${config.mainMemoryBlocks} Blocks`} disabled />
            </div>

            {/* Read Policy */}
            <div className="field">
                <label>Read Policy:</label>
                <select name="readPolicy" value={config.readPolicy} onChange={handleChange}>
                    <option value={READ_POLICY.NON_LOAD_THROUGH}>Non-Load-Through</option>
                    <option value={READ_POLICY.LOAD_THROUGH}>Load-Through</option>
                </select>
            </div>

            {/* Sequence Selection */}
            <div className="field">
                <label>Sequence:</label>
                <select name="sequence" value={config.sequence} onChange={handleChange}>
                    <option value={SEQUENCE.A}>Sequential </option>
                    <option value={SEQUENCE.B}>Mid-Repeat </option>
                    <option value={SEQUENCE.C}>Random </option>
                </select>
            </div>

            {/* Simulation Mode Dropdown */}
            <div className="field">
                <label>Execution Mode:</label>
                <select name="simulationMode" value={config.simulationMode} onChange={handleChange}>
                    <option value={SIMULATION_MODE.STEP_BY_STEP}>Step-by-Step </option>
                    <option value={SIMULATION_MODE.INSTANT}>Final Snapshot</option>
                </select>
            </div>

            {/* Submit Button */}
            <button className="run-btn" onClick={handleRun}>
                RUN SIMULATION
            </button>
        </div>
    );
}