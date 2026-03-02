# 🍎 Tabbie on macOS — Setup Guide

> Run Tabbie's full dashboard on your Mac — no robot hardware required!
> All features (Tasks, Stats, Habits, Workspaces, Tools, Smart Insights) work entirely in-browser.

---

## What You Get (Mac Mode)

| Feature | Description |
|---|---|
| ✅ **Tasks** | Full task manager with priorities, due dates & Pomodoro |
| 📊 **Stats** | Productivity analytics — tasks, focus time, habit streaks |
| 🔁 **Habits & Reminders** | Daily/weekly habit tracker with streak counters |
| 🖥️ **Workspaces** | Group URLs and open them all in one click |
| 🗣️ **Talk** | Coming soon — voice interface |
| 🛠️ **Tools** | Quick timer, box breathing, focus links |
| ✨ **Smart Insights** | Pattern analysis from your local data (private, no cloud) |
| 🤖 **Tabbie AI** | Lightweight on-device insights (no external API) |

---

## Prerequisites

| Tool | Version | Link |
|---|---|---|
| **Node.js** | v18 or newer | [nodejs.org](https://nodejs.org/) |
| **Git** | Any | Pre-installed or `brew install git` |
| **Homebrew** *(optional)* | Any | [brew.sh](https://brew.sh) |

### Install Node.js

```bash
# Option A — via Homebrew (recommended)
brew install node

# Option B — download the installer directly
# https://nodejs.org/en/download
```

Verify:

```bash
node --version   # should print v18 or higher
npm --version    # should print 9 or higher
```

---

## Quick Start (5 minutes)

### 1. Clone the repository

```bash
git clone https://github.com/codermoderSD/tabbie.git
cd tabbie
```

### 2. Install dashboard dependencies

```bash
cd app
npm install
```

### 3. Start the dashboard

```bash
npm run dev
```

The app will open at **http://localhost:8080** (or the port shown in your terminal).

> 💡 Tip: Bookmark `http://localhost:8080` — it becomes your "Tabbie on Mac" home page.

---

## Feature Tour

### Tasks
- Click **Tasks** in the sidebar → add tasks with priorities and due dates
- Start a **Pomodoro** session for any task to stay focused
- Categories let you group tasks by project or context

### Stats
- Click **Stats** to see how productive you've been
- View daily bar charts, completion rates, and focus minutes

### Habits & Reminders
- Click **Habits** → add daily or weekly habits (e.g. "Drink water", "Exercise")
- Check off habits each day to build streaks 🔥
- Add **Reminders** with custom times and repeat days

### Workspaces
- Click **Workspaces** → create named groups of URLs
- Example: "Dev Setup" → GitHub, Jira, Notion, Terminal
- Click **Launch** to open all tabs at once

### Tools
- **Quick Timer** — pick 1, 3, 5, 10, 15 or 20 minute countdown
- **Box Breathing** — guided 4-4-4-2 breathing exercise
- **Quick Links** — one-click access to common productivity sites
- **Focus Tips** — daily rotating tips from proven productivity techniques

### Smart Insights
- Click **Smart Insights** to see Tabbie's analysis of your data
- Insights include: peak productive hour, best day of week, habit streaks,
  task backlog alerts, and weekly completion trends
- All computation happens **locally in your browser** — nothing is sent anywhere

### Tabbie (Hardware Control)
- The **Tabbie** page is for controlling the physical robot (ESP32)
- On Mac without hardware, you can still preview animations and servo patterns
- See `docs/get_started.md` for hardware setup

---

## Running as a Persistent App (Optional)

### Option A: Keep a terminal tab open
Just run `npm run dev` in the `app/` directory and leave it running.

### Option B: Run in background with a shell alias

Add to `~/.zshrc` or `~/.bashrc`:

```bash
alias tabbie='cd ~/path/to/tabbie/app && npm run dev &'
```

Then just type `tabbie` in any terminal.

### Option C: Open automatically at login (launchd)

Create `~/Library/LaunchAgents/com.tabbie.dashboard.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.tabbie.dashboard</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/npm</string>
    <string>run</string>
    <string>dev</string>
  </array>
  <key>WorkingDirectory</key>
  <string>/Users/YOUR_USERNAME/tabbie/app</string>
  <key>RunAtLoad</key>
  <true/>
  <key>StandardOutPath</key>
  <string>/tmp/tabbie.log</string>
  <key>StandardErrorPath</key>
  <string>/tmp/tabbie-error.log</string>
</dict>
</plist>
```

Replace `YOUR_USERNAME` with your macOS username and the path with where you cloned the repo. Then:

```bash
launchctl load ~/Library/LaunchAgents/com.tabbie.dashboard.plist
```

The dashboard will now start automatically every time you log in.

---

## Memory Usage

Tabbie is designed to be **lightweight**:

| Component | Approximate RAM |
|---|---|
| Vite dev server (Node.js) | ~50–80 MB |
| Browser tab (Chrome/Safari) | ~30–80 MB |
| **Total** | **~80–160 MB** |

All data is stored in `localStorage` (no database, no cloud). Tabbie never sends data anywhere.

---

## Tips for Mac Users

- **Pin the tab**: In Chrome, right-click the Tabbie tab → "Pin Tab" so it's always visible
- **Use Split View**: Put Tabbie on the right side of your screen next to your editor
- **Keyboard shortcut**: Set a custom shortcut in macOS to open `http://localhost:8080` in your browser
- **Dark mode**: Tabbie respects your macOS dark mode setting, or you can override it in Settings

---

## Updating Tabbie

```bash
cd tabbie
git pull
cd app
npm install   # only needed if dependencies changed
# Restart your dev server
```

---

## Troubleshooting

### Port already in use
```bash
# Find what's using port 8080
lsof -i :8080
# Kill it
kill -9 <PID>
```

Or change the port in `app/vite.config.ts`.

### npm install fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### App won't open
```bash
# Check Node.js version
node --version  # needs v18+

# Try reinstalling Node via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
nvm use 20
```

---

## Next Steps

- 📖 Full hardware setup: [`docs/get_started.md`](get_started.md)
- 🤝 Contribute: [`CONTRIBUTING.md`](../CONTRIBUTING.md)
- 💬 Community: [Reddit r/deskbuddy](https://www.reddit.com/r/deskbuddy/) · [Discord](https://discord.gg/7er2Ysjc)
