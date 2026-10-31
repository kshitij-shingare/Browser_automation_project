---
name: dadb-course-automator
description: Autonomous course completion agent for DADB Academy (academy.dadb.com) created by Kshitij Shingare. Use whenever the user asks to start, automate, run, or complete their DADB / LearnWorlds course.
---

# DADB Course Automator Skill
**Author:** Kshitij Shingare  
**Platform:** DADB Academy / LearnWorlds (`academy.dadb.com`)

Use this skill whenever the user asks:
- "start dadb course"
- "complete course"
- "run dadb automation"
- "continue dadb course"
- or any similar request.

## Workflow

### 1. Verify Chrome Debugging Port
The engine communicates with Chrome via Chrome DevTools Protocol (CDP) on port 9222.
Check if Chrome is already active on port 9222:
```powershell
curl.exe -s http://127.0.0.1:9222/json/version
```
- If active, verify that a tab with `academy.dadb.com` is open:
  ```powershell
  curl.exe -s http://127.0.0.1:9222/json/list
  ```
- If Chrome is not running or port 9222 is closed, launch Chrome using the workspace helper:
  ```powershell
  .\launch-chrome.bat
  ```
  Ask the user to log in and open the course player URL.

### 2. Launch the Autonomous Automator Engine
Launch the automator as a background daemon process using `run_command` with `IsDaemon: true`:
```powershell
node index.js
```
or
```powershell
npm start
```

### 3. Monitor Uninterrupted Progress
- The engine automatically:
  1. Plays videos naturally at 2x native speed.
  2. Dispatches native CDP clicks to dismiss sound overlays and auto-recover paused buffers.
  3. Replays videos naturally if required by prerequisite tracking.
  4. Solves and submits all Learning Controls and Examinations (including Intermediate and Final Exams) using the built-in comprehensive knowledge heuristics.
  5. Automatically approves confirmation modals (`iziToast` "Yes" button).
  6. Scrolls Study Notes PDFs and handles SCORM modules.
  7. Advances sequence seamlessly until reaching **100% Course Completion**.
- Periodically check the engine log to provide concise updates to the user.
