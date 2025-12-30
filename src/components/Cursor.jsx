import React from 'react';

const Cursor = ({ isBlinking = true }) => {
    return (
        <span className={`cursor-caret ${isBlinking ? 'blink' : ''}`}> </span>
    );
};

export default Cursor;
