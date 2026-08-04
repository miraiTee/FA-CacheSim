import React, { useState } from 'react';
import './Configs.css'; // <-- Imports all the CSS rules you just pasted
import {
    DEFAULT_CONFIG,
    BLOCK_SIZE_OPTIONS,
    CACHE_BLOCK_OPTIONS
} from '../data/configs.js'; // Adjust relative path if needed

export default function Configs({ onRunSimulation }) {
    const [config, setConfig] = useState(DEFAULT_CONFIG);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const parsedValue = (name === 'readPolicy' || name === 'sequence') ? value : Number(value);

        setConfig((prev) => ({ ...prev, [name]: parsedValue }));
    };

    const handleRun = () => {
        // Pass current choices to the parent App component
        onRunSimulation(config);
    };

    return (
        <div className="config-container">
        <h2>System Parameters</h2>

        {/* Block Size */}
        <div className="field">
        <label> Block Size: </label>
        <select name="blockSize" value={config.blockSize} onChange={handleChange}>
        {BLOCK_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>{size} words</option>
        ))}
        </select>
        </div>

        {/* Number of Cache Blocks */}
        <div className="field">
        <label> Cache Blocks: </label>
        <select name="numCacheBlocks" value={config.numCacheBlocks} onChange={handleChange}>
        {CACHE_BLOCK_OPTIONS.map((blocks) => (
            <option key={blocks} value={blocks}>{blocks} blocks </option>
        ))}
        </select>
        </div>

        {/* Main Memory Size (Fixed at 1024) */}
        <div className="field">
        <label> Main Memory: </label>
        <input type="text"
        value={`${config.mainMemoryBlocks} blocks`}
         disabled />
        </div>

        {/* Read Policy */}
        <div className="field">
        <label>Read Policy: </label>
        <select name="readPolicy" value={config.readPolicy} onChange={handleChange}>
        <option value="Load-Through">Load-through</option>
        <option value="Non-Load-Through">Non-load-through</option>
        </select>
        </div>

        {/* Sequence Selection */}
        <div className="field">
        <label>Sequence: </label>
        <select name="sequence" value={config.sequence} onChange={handleChange}>
        <option value="A">Sequential</option>
        <option value="B">Mid-repeat</option>
        <option value="C">Random</option>
        </select>
        </div>

        {/* Submit Button */}
        <button className="run-btn" onClick={handleRun}>
        RUN SIMULATION
        </button>
        </div>
    );
}
