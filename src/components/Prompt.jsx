import React from 'react';

const Prompt = ({ path = '~' }) => {
    return (
        <span className="prompt">
            <span className="prompt-user">ashwanirai@macbook-air</span>
            {/* Path formatting: if path is ~, use standard. */}
            {/* Real term: ~ % (spaces) */}
            <span className="prompt-location"> {path}</span>
            <span className="prompt-symbol"> %</span>
        </span>
    );
};

export default Prompt;
