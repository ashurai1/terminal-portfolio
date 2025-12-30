import { useState } from 'react';

const useCommandHistory = () => {
    const [history, setHistory] = useState([]);
    const [pointer, setPointer] = useState(-1);

    const add = (cmd) => {
        if (cmd.trim()) {
            setHistory((prev) => [...prev, cmd]);
        }
        setPointer(-1); // Reset pointer after new command
    };

    const traverseUp = () => {
        if (history.length === 0) return '';
        const newPointer = pointer === -1 ? history.length - 1 : Math.max(0, pointer - 1);
        setPointer(newPointer);
        return history[newPointer];
    };

    const traverseDown = () => {
        if (pointer === -1) return '';
        const newPointer = pointer + 1;
        if (newPointer >= history.length) {
            setPointer(-1);
            return '';
        }
        setPointer(newPointer);
        return history[newPointer];
    };

    const resetPointer = () => setPointer(-1);

    return { add, traverseUp, traverseDown, resetPointer };
};

export default useCommandHistory;
