[![Typing SVG](https://readme-typing-svg.herokuapp.com?size=22&duration=3000&color=FFFFFF&background=000000&center=true&vCenter=true&lines=🚀+Live+on+Vercel;Click+to+Open+Website)](https://terminal-portfolio-ten-rouge.vercel.app/)

[![Live Website](https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif)](https://terminal-portfolio-ten-rouge.vercel.app/)




# Terminal Portfolio

A hyper-realistic macOS Terminal-style portfolio website built with React and Vite. This project simulates a Zsh shell environment, complete with a virtual filesystem, command history, themes, and responsive design.

## Features

- **Realistic Terminal Simulation**:
  - Boot sequence with "Last login" timestamp.
  - Active cursor (caret) with blinking animation.
  - Command history navigation (Up/Down arrows).
  - Tab completion (simulated).
  - Realistic command processing delay.

- **Virtual Filesystem**:
  - `cd`, `ls`, `pwd`, `cat` commands work as expected.
  - Explore directories and read files (e.g., `cat resume.txt`).

- **Custom Commands**:
  - `about`, `skills`, `projects`, `contact`: Display portfolio information.
  - `theme`: Change color schemes (default, green, amber).
  - `open`: Launch external links (e.g., `open github`).

- **Visuals**:
  - Pixel-perfect macOS window controls.
  - JetBrains Mono font for authentic coding feel.
  - Mobile responsive (fullscreen terminal on small screens).

## Tech Stack

- **Frontend**: React, Vite
- **Styling**: Pure CSS (No external UI libraries)
- **Logic**: Custom Shell Engine & Virtual Filesystem

## Installation & Running

1.  Clone the repository:
    ```bash
    git clone https://github.com/ashurai1/terminal-portfolio.git
    cd terminal-portfolio
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173`.

## License

MIT License

Copyright (c) 2025 Ashwani Rai

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
