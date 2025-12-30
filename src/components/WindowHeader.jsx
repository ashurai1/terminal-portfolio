import React from 'react';

const WindowHeader = ({ onClose }) => {
    return (
        <div className="terminal-header">
            <div className="window-controls">
                <button
                    className="window-btn red"
                    title="Close"
                    onClick={onClose}
                >
                    <span className="icon">×</span>
                </button>
                <button className="window-btn yellow" title="Minimize">
                    <span className="icon">−</span>
                </button>
                <button className="window-btn green" title="Zoom">
                    <span className="icon">+</span>
                </button>
            </div>
            <div className="terminal-title">
                <span className="folder-icon">📂</span>
                <span>ashwanirai — -zsh — 80×24</span>
            </div>
        </div>
    );
};

export default WindowHeader;
