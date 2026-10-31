# 🚀 DADB Academy Course Automator

> **Autonomous Natural Course Completion Engine for DADB Academy / LearnWorlds (`academy.dadb.com`)**  
> **Author & Creator:** [Kshitij Shingare](https://github.com/kshitij-shingare)  
> **Email:** kshitijshingare49@gmail.com  
> **Built for:** Node.js (v18+) & Standalone CLI  

---

## 🌟 Overview

The **DADB Academy Course Automator** is an enterprise-grade automation framework designed to naturally complete any DADB Academy course (such as *Internet of Things - IoT*, *Industry 4.0*, *Robotics*, etc.) without hacks, skips, or artificial seeking.

### ✨ Key Capabilities
- **100% Natural Playback**: Plays videos at natural 2x native playback speed.
- **Hardware-Level CDP Mouse Click Integration**: Uses Chrome DevTools Protocol to dismiss sound overlays, click video centers, and trigger Vue navigation buttons directly via real hardware coordinates.
- **Automated Pause Recovery**: Automatically detects video pauses, network buffering stalls, or sound prompts, and resumes playback seamlessly.
- **Prerequisite Replay Handling**: Automatically handles LearnWorlds prerequisite watch requirements by naturally replaying units if required by platform rules.
- **High-Precision Assessment Solver**: Built-in comprehensive knowledge engine covering all 46 modules:
  - IoT Concepts, Architectures & RAMI 4.0
  - Protocols: MQTT, MQTT-SN, Sparkplug B, OPC UA (Client-Server & Pub-Sub), LWM2M
  - Industrial Fieldbus: Profibus, Profinet, EtherCAT, Modbus
  - LPWAN Technologies: LoRa, LoRaWAN (EU868 band, EIRP), Sigfox, Mioty
  - 5G, Network Slicing, and Industrial Automation Pyramids
  - IIoT Cloud Platforms: AWS IoT Core, Greengrass, Device Defender
  - Product Development, Design Thinking, Stage-Gate, FMEA (RPN analysis), DFMA
  - CAD Formats & Generative Manufacturing: STEP, IGES, STL, DXF, B-Rep, CNC Integration
  - Robotics: Kinematics (forward/inverse), Dynamics, SCARA, Articulated, Cobots, Cartesian Systems
- **Modal Confirmations**: Automatically handles confirmation dialogs (`iziToast` modals on Intermediate and Final Exams).
- **Multi-Tier Navigation**: Uses iframe controls, top-bar navigation, and sidebar sequence fallbacks for 100% reliable unit transitions.
- **Dynamic Path-Player Detection & Auto-Reconnection**: Seamlessly discovers and attaches to the active `path-player` course tab and auto-reconnects if the user switches or logs in.
- **Zero External Dependencies**: Operates entirely on standard Node.js (v18+) using native global `WebSocket` and `fetch` APIs. No `npm install` required!

---

## 💻 How to Use on Another Laptop

### 📁 Step 1: Copy or Transfer the Project
Simply copy this entire folder to your other laptop, or clone your repository:
```bash
git clone https://github.com/kshitij-shingare/Browser_automation_project.git
```

---

### 📦 Step 2: Install & Verify Dependencies
Run the environment installer to check and configure Node.js, Google Chrome, and project files:

#### Option A: One-Click Installer (Windows - Recommended)
Double-click `install.bat`.

#### Option B: Command Line
```bash
npm run setup
```

---

### 🌐 Step 3: Start Google Chrome with Remote Debugging
The automator interacts with Chrome via port `9222`.

#### Option A: One-Click Launcher (Windows - Recommended)
Double-click `launch-chrome.bat`.
> **Note for Modern Chrome (Chrome 136+):** Chrome requires a dedicated profile (`--user-data-dir`) when remote debugging is enabled. `launch-chrome.bat` automatically handles this using an isolated local `.chrome_profile`.

#### Option B: Terminal Command
Run in PowerShell / CMD:
```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="$PWD\.chrome_profile" "https://academy.dadb.com"
```
Or in Command Prompt:
```cmd
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="%CD%\.chrome_profile" "https://academy.dadb.com"
```

> **Important:** In the Chrome window that opens, log into your DADB Academy account and navigate into your course until the video/lesson player is visible on screen.

---

### 🤖 Step 4: Start the Automator

You can run the automator via the **One-Click Runner** or the **Command Line**:

#### Option A: One-Click Runner (Windows)
Double-click `start.bat`.

#### Option B: Command Line (PowerShell / CMD / Bash)
```bash
node index.js
```
or
```bash
npm start
```

---

## 🛠️ Project Structure

```text
dadb-couse/
├── src/
│   ├── cdp-client.js               # Zero-dependency CDP WebSocket client
│   ├── config.js                   # Speed, ports, and navigation settings
│   ├── engine.js                   # Master autonomous state machine
│   ├── quiz-solver.js              # Comprehensive AI & heuristic quiz solver
│   └── unit-handlers.js            # Video, Quiz, PDF, SCORM, and Nav drivers
├── index.js                        # CLI entry point
├── install.bat                     # Windows one-click dependency & environment installer
├── launch-chrome.bat               # Windows one-click Chrome launcher
├── start.bat                       # Windows one-click automator runner
├── package.json                    # Project definition & metadata
└── README.md                       # Documentation & guide
```

---

## ⚙️ Customization (`src/config.js`)

You can easily adjust behavior in `src/config.js`:
```javascript
module.exports = {
  cdp: {
    port: 9222,
    host: '127.0.0.1',
    targetPattern: 'academy.dadb.com'
  },
  playback: {
    speedMultiplier: 2.0,       // 1.0, 1.25, 1.5, or 2.0 native speed
    pollIntervalMs: 15000,      // Video status polling cadence
    maxStuckChecks: 2,          // Pause recovery threshold
    replayOnPrereqLock: true    // Auto-replay on platform tracking requirements
  },
  assessments: {
    autoSolve: true,            // Solve all learning controls & exams
    autoSubmit: true,           // Submit quizzes automatically
    autoConfirmModals: true     // Auto-confirm iziToast modals ("Yes")
  }
};
```

---

## 📋 System Requirements
- **OS**: Windows 10/11, macOS, or Linux.
- **Node.js**: Version 18.0.0 or newer (download from [nodejs.org](https://nodejs.org/)).
- **Browser**: Google Chrome.

---

## 👤 Author & Credits

- **Creator:** Kshitij Shingare
- **GitHub:** [@kshitij-shingare](https://github.com/kshitij-shingare)
- **Email:** kshitijshingare49@gmail.com
- **License:** MIT License
