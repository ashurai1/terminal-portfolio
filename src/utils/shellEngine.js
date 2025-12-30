import { fileSystem } from '../data/filesystem';
import { commands } from '../data/commands';

export const resolvePath = (currentPath, targetPath) => {
    if (targetPath === '~' || targetPath === '/' || !targetPath) return '~';
    if (targetPath === '..') {
        // Basic parent logic for ~ rooted system
        // ~/projects -> ~
        if (currentPath === '~') return '~';
        const parts = currentPath.split('/');
        parts.pop();
        return parts.join('/') || '~';
    }
    // For simplicity traverse downwards only one level relative or absolute to ~
    // e.g. cd projects
    const newPath = currentPath === '~' ? `~/${targetPath}` : `${currentPath}/${targetPath}`;
    // verify existence
    // This is a naive implementation; normally we'd walk the tree
    // Let's assume shallow tree for portfolio: ~ has children, that's it
    return newPath;
};

// Returns node at path or null
export const getNode = (path) => {
    if (path === '~') return fileSystem['~'];
    const parts = path.split('/').filter(p => p !== '' && p !== '~');
    let current = fileSystem['~'];
    for (const part of parts) {
        if (current.children && current.children[part]) {
            current = current.children[part];
        } else {
            return null;
        }
    }
    return current;
};

export const executeCommand = (cmdStr, currentPath, setPath) => {
    const parts = cmdStr.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (!cmd) return null;

    // FILESYSTEM COMMANDS
    if (cmd === 'ls') {
        const node = getNode(currentPath);
        if (!node || !node.children) return '';
        return Object.keys(node.children).join('  ');
    }

    if (cmd === 'cd') {
        const target = args[0] || '~';

        // Handle home
        if (target === '~') {
            setPath('~');
            return null;
        }

        // Handle parent
        if (target === '..') {
            if (currentPath === '~') return null; // Already at home
            // Only support 1 level deep for now (e.g. ~/projects)
            if (currentPath.includes('/')) {
                setPath('~');
            }
            return null;
        }

        // Checking child existence
        // Assumes simple traversal relative to current
        const node = getNode(currentPath);
        if (node && node.children && node.children[target] && node.children[target].type === 'dir') {
            setPath(currentPath === '~' ? `~/${target}` : `${currentPath}/${target}`);
            return null;
        }

        return `cd: no such file or directory: ${target}`;
    }

    if (cmd === 'pwd') {
        return currentPath === '~' ? '/Users/ashwanirai' : `/Users/ashwanirai/${currentPath.replace('~/', '')}`;
    }

    if (cmd === 'cat') {
        const filename = args[0];
        if (!filename) return 'cat: usage: cat <filename>';

        const node = getNode(currentPath);
        if (node && node.children && node.children[filename]) {
            if (node.children[filename].type === 'file') {
                return node.children[filename].content;
            }
            return `cat: ${filename}: Is a directory`;
        }
        return `cat: ${filename}: No such file or directory`;
    }

    // SYSTEM COMMANDS
    if (cmd === 'clear') return 'CLEAR'; // Special signal
    if (cmd === 'whoami') return 'ashwanirai';
    if (cmd === 'date') return new Date().toString();

    if (cmd === 'open') {
        const target = args[0];
        if (target === 'github') {
            window.open('https://github.com/ashurai1', '_blank');
            return '';
        }
        if (target === 'linkedin') {
            window.open('https://linkedin.com/in/ashwanirai', '_blank');
            return '';
        }
        return `open: application not found: ${target}`;
    }

    // STATIC COMMANDS
    if (cmd === 'help') {
        const builtins = ['ls', 'cd', 'pwd', 'cat', 'clear', 'open', 'whoami', 'date'];
        const custom = Object.keys(commands).map(k => `${k}`);
        return `Available commands:\n${builtins.join('  ')}\n${custom.join('  ')}`;
    }

    if (commands[cmd]) {
        return commands[cmd].output;
    }

    return `zsh: command not found: ${cmd}`;
};
