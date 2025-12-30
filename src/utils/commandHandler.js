import { commandsList, commandResponses } from '../data/commands';

export const handleCommand = (cmdInput) => {
    const trimmedCmd = cmdInput.trim().toLowerCase();

    if (!trimmedCmd) return { type: 'empty' };

    if (trimmedCmd === 'clear') {
        return { type: 'clear' };
    }

    if (trimmedCmd === 'help') {
        return {
            type: 'help',
            content: commandsList
        };
    }

    if (trimmedCmd === 'ls') {
        return {
            type: 'general',
            content: "about  skills  projects  experience  education  contact  README.md"
        };
    }

    if (trimmedCmd === 'whoami') {
        return {
            type: 'general',
            content: "ashwanirai"
        };
    }

    if (trimmedCmd === 'date') {
        return {
            type: 'general',
            content: new Date().toString()
        };
    }

    if (commandResponses[trimmedCmd]) {
        return {
            type: 'response',
            content: commandResponses[trimmedCmd],
            cmd: trimmedCmd
        };
    }

    return {
        type: 'error',
        content: `zsh: command not found: ${trimmedCmd}`
    };
};
