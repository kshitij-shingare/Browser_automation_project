# DADB Course Automator — Project Workspace Guide

**Project Owner & Author:** Kshitij Shingare  
**Repository Purpose:** Autonomous Natural Completion of DADB Academy Courses (`academy.dadb.com`)

## Agent Instructions for Antigravity

When this workspace is opened on any laptop or device and the user gives prompts such as:
- *"start course"*
- *"complete dadb course"*
- *"run the automation"*
- *"finish my course"*

You should immediately:
1. Ensure Google Chrome is running with `--remote-debugging-port=9222` and the course page (`academy.dadb.com`) is loaded.
   - If not running, invoke `.\launch-chrome.bat` or tell the user to open Chrome with port 9222.
2. Launch the engine in the background:
   ```powershell
   node index.js
   ```
3. Allow the engine to run autonomously until 100% course completion.
4. Report milestone updates to the user with concise progress summaries.

## Core Architecture
- `index.js`: Main CLI entry point.
- `src/engine.js`: Master state machine and controller.
- `src/cdp-client.js`: Pure Node.js CDP client with native hardware mouse click dispatching.
- `src/quiz-solver.js`: AI knowledge base and heuristic solver for all DADB course questions and exams.
- `src/unit-handlers.js`: Individual unit drivers (Videos, Quizzes, PDFs, SCORM, and multi-tier navigation).
- `src/config.js`: Global configuration (ports, speeds, delays).
- `launch-chrome.bat`: Windows launcher for Chrome with CDP port 9222.
- `start.bat`: Windows one-click runner for the automator.
