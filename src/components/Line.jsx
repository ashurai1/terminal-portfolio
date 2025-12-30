import React from 'react';
import Prompt from './Prompt';

const Line = ({ entry }) => {
    // entry: { type: 'input' || 'output', content, path }

    if (entry.type === 'input') {
        return (
            <div className="terminal-line input-mode">
                {/* Render prompt with the path at time of execution */}
                <Prompt path={entry.path || '~'} />
                <span className="input-command">{entry.content}</span>
            </div>
        );
    }

    // Output - Rich Content Handler
    const renderContent = (content) => {
        // String output (with link detection)
        if (typeof content === 'string') {
            const lines = content.split('\n');
            return lines.map((l, i) => {
                const linkRegex = /(https?:\/\/[^\s]+)/g;
                const parts = l.split(linkRegex);
                return (
                    <div key={i} style={{ minHeight: l === '' ? '1.4em' : 'auto' }}>
                        {parts.length > 1 ? parts.map((part, pIdx) => {
                            if (part.match(linkRegex)) {
                                return <a key={pIdx} href={part} target="_blank" rel="noreferrer">{part}</a>;
                            }
                            return part;
                        }) : l}
                    </div>
                );
            });
        }

        // Array output (for lists, projects, skills)
        if (Array.isArray(content)) {
            return content.map((item, idx) => {
                // Simple string item in array
                if (typeof item === 'string') {
                    return <div key={idx} style={{ minHeight: '1.4em' }}>{item}</div>;
                }

                // Project/Experience Object
                if (typeof item === 'object') {
                    // Project
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
                                    <div>
                                        <a href={item.link} target="_blank" rel="noreferrer" className="project-link">
                                            {item.link}
                                        </a>
                                    </div>
                                )}
                            </div>
                        );
                    }
                    // Key-Value (e.g. general info)
                    if (item.key && item.val) {
                        return (
                            <div key={idx} style={{ display: 'flex', gap: '10px' }}>
                                <span style={{ color: '#febc2e', minWidth: '120px' }}>{item.key}:</span>
                                <span>{item.val}</span>
                            </div>
                        );
                    }
                }
                return null;
            });
        }

        return null;
    };

    if (entry.type === 'output') {
        return (
            <div className="terminal-line output-mode">
                {renderContent(entry.content)}
            </div>
        );
    }

    return null;
};

export default Line;
