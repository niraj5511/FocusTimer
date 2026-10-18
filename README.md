# Focus Timer

A Pomodoro-style timer built with React and Vite. Switch between focus and break sessions, set your own lengths, name the task you are working on, and get a sound and a desktop notification when a session ends.

## Features

- Focus and break modes (default 25 and 5 minutes)
- Start, pause, and reset
- Custom focus and break lengths, from 1 to 120 minutes
- Progress bar and a countdown that is also shown in the browser tab title
- Automatic switch to the other mode when the timer reaches zero (the next session is not started automatically)
- Beep and desktop notification when a session ends
- Completed focus sessions counter, saved in the browser with `localStorage`, with a "Clear sessions" button
- Task name field ("What are you working on?"), saved in the browser
- Light and dark theme, saved in the browser
- Keyboard shortcuts: `S` to start or pause, `R` to reset
- Red accent for focus mode, green accent for break mode
- Responsive layout for small screens

## Tech Stack

- React 19
- Vite
- Plain CSS
- Web Audio API and Notifications API (browser built-ins)
- ESLint

## Project Structure

```
FocusTimer/
├── index.html
├── vite.config.js
├── eslint.config.js
├── package.json
├── public/            # Favicon and static assets
└── src/
    ├── main.jsx       # App entry point
    ├── App.jsx        # Timer logic and UI
    └── index.css      # Styles, themes, responsive rules
```

## Getting Started

You need Node.js 20.19 or newer (or 22.12 or newer), which is what Vite 8 requires.

1. Clone the repository:
   ```bash
   git clone https://github.com/niraj551/FocusTimer.git
   cd FocusTimer
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173.

### Other scripts

```bash
npm run build     # Production build in dist/
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

## How It Works

`App.jsx` keeps the timer state (mode, seconds left, running or paused) in React state. While the timer is running, an interval reduces the seconds left once per second. When it reaches zero, the app plays a beep, sends a notification if permission was granted, adds one to the session count (for focus sessions only), and switches to the other mode. The browser asks for notification permission the first time you press Start.

The session count, task name, and theme are stored in `localStorage` and restored on the next visit.

## Known Limitations

- Custom focus and break lengths are not restored after a refresh. They reset to 25 and 5 minutes.
- The timer counts one tick per second, so it can run slow if the browser throttles a background tab.
- The shortcuts `S` and `R` are ignored while you are typing in an input field.

## License

MIT. See the [LICENSE](LICENSE) file.
