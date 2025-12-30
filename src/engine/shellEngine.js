import { fileSystem } from '../data/filesystem';
import { commands } from '../data/commands';
import { themes } from '../data/themes';

// Helper to look up a node in filesystem
const resolveNode = (currentPath, targetPath) => {
    // If absolute path from root (~ or /)
    if (targetPath.startsWith('~') || targetPath.startsWith('/')) {
        const parts = targetPath.replace(/^~|^\//, '').split('/').filter(Boolean);
        let current = fileSystem['~'];
        for (const p of parts) {
            if (current.children && current.children[p]) {
                current = current.children[p];
            } else {
                return null;
            }
        }
        return current;
    }

    // Relative path logic
    // ".." logic simplified: we only support simple navigation for now
    // Real implementation would track path stack
    if (targetPath === '..') {
        // Naive parent check
        // If we are in ~/projects, we go to ~
        // If we are in ~, we stay
        // This needs knowledge of current absolute path, which we have passing in
        return 'PARENT_SIGNAL';
    }

    // Normal relative child
    const parts = currentPath.split('/').filter(p => p && p !== '~');
    let current = fileSystem['~'];
    // Navigate to current dir
    for (const part of parts) {
        if (current.children && current.children[part]) {
            current = current.children[part];
        }
    }

    // Now navigate down
    if (current.children && current.children[targetPath]) {
        return current.children[targetPath];
    }
    return null;
};

export const executeShell = (cmdStr, state, setters) => {
    const { path, theme, commandHistory } = state;
    const { setPath, setTheme, setCommandHistory, setIsExited } = setters;

    const args = cmdStr.trim().split(/\s+/);
    const cmd = args[0].toLowerCase();
    const param = args[1];

    if (!cmd) return null;

    // Add to history if not empty
    setCommandHistory(prev => [...prev, cmdStr]);

    // FILESYSTEM COMMANDS
    if (cmd === 'ls') {
        const node = resolveNode(path, '.'); // current node
        if (node && node.children) {
            return Object.entries(node.children)
                .map(([name, data]) => data.type === 'dir' ? name + '/' : name)
                .join('  ');
        }
        return '';
    }

    if (cmd === 'cd') {
        if (!param || param === '~') {
            setPath('~');
            return null;
        }
        if (param === '..') {
            if (path === '~') return null;
            // Go up one level
            const newPath = path.substring(0, path.lastIndexOf('/'));
            setPath(newPath || '~');
            return null;
        }

        // Check child
        const node = resolveNode(path, param);
        if (node && node.type === 'dir') {
            setPath(path === '~' ? `~/${param}` : `${path}/${param}`);
            return null;
        }
        return `cd: no such file or directory: ${param}`;
    }

    if (cmd === 'pwd') {
        return path.replace('~', '/Users/ashwanirai');
    }

    if (cmd === 'cat') {
        if (!param) return 'usage: cat <file>';
        const node = resolveNode(path, param);
        if (node) {
            if (node.type === 'dir') return `cat: ${param}: Is a directory`;
            return node.content;
        }
        return `cat: ${param}: No such file or directory`;
    }

    if (cmd === 'open') {
        if (param === 'github') {
            window.open('https://github.com/ashurai1', '_blank');
            return '';
        }
        if (param === 'linkedin') {
            window.open('https://linkedin.com/in/ashwanirai', '_blank');
            return '';
        }
        return `open: application not found: ${param}`;
    }

    // SYSTEM COMMANDS
    if (cmd === 'clear') return 'CLEAR_SIGNAL';

    if (cmd === 'history') {
        return commandHistory.map((c, i) => `${i + 1}  ${c}`).join('\n');
    }

    if (cmd === 'theme') {
        if (themes[param]) {
            setTheme(param);
            return `Theme set to ${param}`;
        }
        return `usage: theme [default|green|amber]`;
    }

    if (cmd === 'whoami') return 'ashwanirai';
    if (cmd === 'date') return new Date().toString();
    if (cmd === 'exit') {
        setIsExited(true);
        return 'logout';
    }

    // STATIC CONTENT (fallback to commands.js)
    if (commands[cmd]) {
        return commands[cmd];
    }

    return `zsh: command not found: ${cmd}`;
};
