import { useState } from 'react';

export const useHistory = () => {
    const [history, setHistory] = useState([]);
    const [position, setPosition] = useState(-1);
    const [commandHistory, setCommandHistory] = useState([]); // Stores just the commands for up/down

    const addToHistory = (cmd, output, path) => {
        // entry: { type: 'input'|'output', content: string|node, path: string }

        // Add command input
        const inputEntry = { type: 'input', content: cmd, path };

        // Add command output (if any)
        const outputEntry = output ? { type: 'output', content: output } : null;

        setHistory(prev => outputEntry ? [...prev, inputEntry, outputEntry] : [...prev, inputEntry]);

        if (cmd.trim()) {
            setCommandHistory(prev => [...prev, cmd]);
        }
        setPosition(-1); // Reset pointer
    };

    const clearHistory = () => {
        setHistory([]);
    };

    const traverseHistory = (direction) => {
        if (commandHistory.length === 0) return '';

        if (direction === 'up') {
            const newPos = position === -1 ? commandHistory.length - 1 : Math.max(0, position - 1);
            setPosition(newPos);
            return commandHistory[newPos];
        } else {
            if (position === -1) return '';
            const newPos = position + 1;
            if (newPos >= commandHistory.length) {
                setPosition(-1);
                return '';
            }
            setPosition(newPos);
            return commandHistory[newPos];
        }
    };

    return { history, addToHistory, clearHistory, traverseHistory };
};
