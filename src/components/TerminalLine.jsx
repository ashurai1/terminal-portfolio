import React from 'react';
import TerminalPrompt from './TerminalPrompt';

const TerminalLine = ({ entry }) => {
    // entry structure: { type: 'input' | 'output' | 'error', cmd?: string, content?: any }

    if (entry.type === 'input') {
        return (
            <div className="terminal-line input-mode">
                <TerminalPrompt />
                <span className="input-command">{entry.cmd}</span>
            </div>
        );
    }

    const renderContent = (content) => {
        if (typeof content === 'string') {
            return content.split('\n').map((str, i) => (
                <div key={i} style={{ minHeight: str === '' ? '1em' : 'auto' }}>
                    {str}
                </div>
            ));
        }

        if (Array.isArray(content)) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {content.map((item, idx) => {
                        if (typeof item === 'string') {
                            return <div key={idx}>{item}</div>;
                        }

                        // Command list item (help)
                        if (item.cmd) {
                            return (
                                <div key={idx} className="help-item">
                                    <span className="help-cmd">{item.cmd}</span>
                                    <span className="help-desc">{item.desc}</span>
                                </div>
                            );
                        }

                        // Project item
                        if (item.title) {
                            return (
                                <div key={idx} className="project-item">
                                    <div className="project-title">
                                        {item.title}
                                    </div>
                                    <div className="project-desc">
                                        {item.desc}
                                    </div>
                                    {item.tech && (
                                        <div className="project-tech">
                                            <span className="tech-label">[Tech]</span> {item.tech}
                                        </div>
                                    )}
                                    {item.link && (
                                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="project-link">
                                            {item.link}
                                        </a>
                                    )}
                                </div>
                            );
                        }

                        return <div key={idx}>{JSON.stringify(item)}</div>;
                    })}
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`terminal-line ${entry.type === 'error' ? 'error-msg' : 'output-msg'}`}>
            {renderContent(entry.content)}
        </div>
    );
};

export default TerminalLine;
