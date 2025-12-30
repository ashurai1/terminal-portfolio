import React from 'react';

const TerminalHeader = () => {
    return (
        <div className="terminal-header">
            <div className="window-controls">
                <button className="window-btn red" title="Close" />
                <button className="window-btn yellow" title="Minimize" />
                <button className="window-btn green" title="Zoom" />
            </div>
            <div className="terminal-title">
                <span className="folder-icon">📂</span>
                <span>ashwanirai — -zsh — 80×24</span>
            </div>
        </div>
    );
};

export default TerminalHeader;
