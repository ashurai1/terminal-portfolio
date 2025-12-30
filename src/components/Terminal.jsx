import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import WindowHeader from './WindowHeader';
import Prompt from './Prompt';
import Cursor from './Cursor';
import Line from './Line';
import { executeShell } from '../engine/shellEngine';
import { themes } from '../data/themes';

const BOOT_NOTION = `Last login: ${new Date().toString().slice(0, 24)} on ttys000`;

const WELCOME_MSG = `
    ___      __                   _ 
   /   | ___/ /_      ______ _____ (_)
  / /| |/ __/ __ \\ | /| / / __ \`/ __ \\/ /
 / ___ / /_/ / / / |/ |/ / /_/ / / / / / 
/_/  |_\\__/_/ /_/|__/|__/\\__,_/_/ /_/_/  

Welcome to Ashwani Terminal

Access Level: USER
System: macOS UNIX Environment
Shell: zsh (simulated)
Status: Online

Type 'help' to list available commands.`;

const Terminal = () => {
    // --- STATE ---
    const [booted, setBooted] = useState(false);
    const [lines, setLines] = useState([]); // [{type: 'output'|'input', content, path}]
    const [path, setPath] = useState('~');
    const [inputStr, setInputStr] = useState('');
    const [cursorPos, setCursorPos] = useState(0);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [commandHistory, setCommandHistory] = useState([]);
    const [currentTheme, setCurrentTheme] = useState('default');
    const [isExited, setIsExited] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    // --- BOOT SEQUENCE ---
    useEffect(() => {
        // Restore session
        const savedTheme = localStorage.getItem('term_theme');
        if (savedTheme && themes[savedTheme]) setCurrentTheme(savedTheme);

        setTimeout(() => {
            setBooted(true);
            setLines([
                { type: 'output', content: BOOT_NOTION },
                { type: 'output', content: WELCOME_MSG }
            ]);
        }, 200);
    }, []);

    // --- PERSISTENCE ---
    useEffect(() => {
        localStorage.setItem('term_theme', currentTheme);
    }, [currentTheme]);

    // --- SCROLLING ---
    // Only auto-scroll if user is already near bottom
    useLayoutEffect(() => {
        // Detect mobile keyboard opening by checking resize or focus?
        // Browser usually handles "scrollIntoView" well.
        if (bottomRef.current) {
            // Force scroll on new input for CLI feel, especially on mobile to see what you type
            // On mobile, keyboard shrinks viewport, so we MUST scroll to bottom
            bottomRef.current.scrollIntoView({ behavior: 'auto', block: 'nearest' });
        }
    }, [lines, isProcessing, inputStr]); // Added inputStr to keep scroll at bottom while typing on mobile

    // --- HANDLERS ---
    const handleTerminalClick = (e) => {
        // Check if selecting text
        if (window.getSelection().toString()) return;

        // On mobile, verify we aren't tapping a link
        if (e.target.tagName === 'A') return;

        // Focus input
        // preventScroll: true prevents jumpy browser behavior
        inputRef.current?.focus({ preventScroll: true });
    };

    const handleKeyDown = async (e) => {
        if (isProcessing || isExited) return;

        if (e.key === 'Enter') {
            const cmd = inputStr;

            // Add input line
            const newInputLine = { type: 'input', content: cmd, path };
            setLines(prev => [...prev, newInputLine]);

            setInputStr('');
            setCursorPos(0);
            setHistoryIndex(-1);
            setIsProcessing(true);

            const delay = Math.floor(Math.random() * 140) + 120; // 120-260ms random delay

            setTimeout(() => {
                const output = executeShell(cmd, { path, theme: currentTheme, commandHistory }, { setPath, setTheme: setCurrentTheme, setCommandHistory, setIsExited });

                if (output === 'CLEAR_SIGNAL') {
                    setLines([]);
                } else if (output) {
                    setLines(prev => [...prev, { type: 'output', content: output }]);
                }

                setIsProcessing(false);
            }, delay);

            return;
        }

        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            setLines([]);
            return;
        }

        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            setLines(prev => [...prev, { type: 'input', content: inputStr + '^C', path }]);
            setInputStr('');
            setCursorPos(0);
            return;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const newIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
                setHistoryIndex(newIdx);
                const cmd = commandHistory[newIdx];
                setInputStr(cmd);
                setCursorPos(cmd.length);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex !== -1) {
                const newIdx = historyIndex + 1;
                if (newIdx >= commandHistory.length) {
                    setHistoryIndex(-1);
                    setInputStr('');
                    setCursorPos(0);
                } else {
                    setHistoryIndex(newIdx);
                    const cmd = commandHistory[newIdx];
                    setInputStr(cmd);
                    setCursorPos(cmd.length);
                }
            }
        }
    };

    const handleInputChange = (e) => {
        if (isProcessing) return;
        setInputStr(e.target.value);
        setCursorPos(e.target.selectionStart);
    };

    const handleSelect = (e) => {
        setCursorPos(e.target.selectionStart);
    };

    // --- CLOSE LOGIC ---
    const handleClose = () => {
        setIsExited(true); // Reuse exit logic or add specific closed state?
        // Using a specific state for window close vs shell exit might be cleaner
        // But for now, let's use a new state 'isWindowClosed'
    };

    const [isWindowClosed, setIsWindowClosed] = useState(false);

    const onWindowClose = () => setIsWindowClosed(true);
    const restartSession = () => {
        setIsWindowClosed(false);
        setBooted(false);
        setLines([]);
        setTimeout(() => {
            setBooted(true);
            setLines([
                { type: 'output', content: BOOT_NOTION },
                { type: 'output', content: WELCOME_MSG }
            ]);
        }, 200);
    };

    // Theme Application
    const themeStyles = {
        '--bg-color': themes[currentTheme].bg,
        '--text-color': themes[currentTheme].text,
        '--prompt-user': themes[currentTheme].promptUser,
        '--prompt-loc': themes[currentTheme].promptLoc,
    };

    if (isWindowClosed) {
        return (
            <div className="terminal-wrapper" style={themeStyles}>
                <div
                    className="session-ended-msg"
                    onClick={restartSession}
                    style={{ color: '#666', fontFamily: 'monospace', cursor: 'pointer' }}
                >
                    <p>Session ended.</p>
                    <p style={{ fontSize: '0.8em', opacity: 0.7 }}>(Click to restart)</p>
                </div>
            </div>
        );
    }

    if (!booted) return <div style={{ backgroundColor: '#000', height: '100vh', width: '100vw' }} />;

    return (
        <div className="terminal-wrapper" style={themeStyles}>
            <div className="terminal-window" onClick={handleTerminalClick}>
                <WindowHeader onClose={onWindowClose} />
                <div className="terminal-body">
                    {/* Previous Lines */}
                    {lines.map((line, i) => (
                        <Line key={i} entry={line} />
                    ))}

                    {/* Active Input */}
                    {!isExited && !isProcessing && (
                        <div className="active-line">
                            <Prompt path={path} />
                            <div className="cmd-container">
                                {/* Hidden Input for Logic */}
                                <input
                                    ref={inputRef}
                                    className="hidden-input"
                                    type="text"
                                    value={inputStr}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    onSelect={handleSelect}
                                    autoFocus
                                    spellCheck="false"
                                    autoComplete="off"
                                />
                                {/* Visual Layer */}
                                <div className="visual-layer">
                                    <span className="pre-cursor">{inputStr.slice(0, cursorPos)}</span>
                                    <Cursor />
                                    <span className="post-cursor">{inputStr.slice(cursorPos)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {isExited && <div className="logout-msg">[Process completed]</div>}

                    <div ref={bottomRef} style={{ height: 1 }} />
                </div>
            </div>
        </div>
    );
};

export default Terminal;
