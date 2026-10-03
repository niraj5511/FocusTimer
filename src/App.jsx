import { useState, useEffect } from "react";

const DEFAULT_MINUTES = { focus: 25, break: 5 };

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function playBeep() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioCtx();
  const osc = ctx.createOscillator();
  osc.frequency.value = 880;
  osc.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.4);
}

export default function App() {
  const [mode, setMode] = useState("focus");
  const [minutes, setMinutes] = useState(DEFAULT_MINUTES);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_MINUTES.focus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("focus-sessions");
    return saved ? Number(saved) : 0;
  });
  const [theme, setTheme] = useState(
    () => localStorage.getItem("focus-theme") || "light",
  );

  // Ticks down once per second while running
  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning]);

  // Save the session count whenever it changes
  useEffect(() => {
    localStorage.setItem("focus-sessions", sessions);
  }, [sessions]);

  // Show the time in the browser tab title
  useEffect(() => {
    document.title = `${formatTime(secondsLeft)} - Focus Timer`;
  }, [secondsLeft]);

  // Apply and save the theme
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("focus-theme", theme);
  }, [theme]);

  // When the timer hits 0, count the session and switch modes
  useEffect(() => {
    if (secondsLeft > 0) return;
    playBeep();
    const nextMode = mode === "focus" ? "break" : "focus";
    if (mode === "focus") setSessions((n) => n + 1);
    setMode(nextMode);
    setSecondsLeft(minutes[nextMode] * 60);
    setIsRunning(false);
  }, [secondsLeft, mode, minutes]);

  function switchMode(newMode) {
    setMode(newMode);
    setSecondsLeft(minutes[newMode] * 60);
    setIsRunning(false);
  }

  function handleReset() {
    setIsRunning(false);
    setSecondsLeft(minutes[mode] * 60);
  }

  function handleClearSessions() {
    setSessions(0);
  }

  function handleMinutesChange(which, value) {
    const num = Math.max(1, Math.min(120, Number(value) || 1));
    setMinutes({ ...minutes, [which]: num });
    if (which === mode) {
      setIsRunning(false);
      setSecondsLeft(num * 60);
    }
  }

  return (
    <main>
      <h1>Focus Timer</h1>
      <button
        className="link-button"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? "Dark mode" : "Light mode"}
      </button>
      <div className="modes">
        <button
          className={mode === "focus" ? "active" : ""}
          onClick={() => switchMode("focus")}
        >
          Focus
        </button>
        <button
          className={mode === "break" ? "active" : ""}
          onClick={() => switchMode("break")}
        >
          Break
        </button>
      </div>
      <p className="time">{formatTime(secondsLeft)}</p>
      <div className="buttons">
        <button onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={handleReset}>Reset</button>
      </div>
      <div className="settings">
        <label>
          Focus (min)
          <input
            type="number"
            min="1"
            max="120"
            value={minutes.focus}
            onChange={(e) => handleMinutesChange("focus", e.target.value)}
          />
        </label>
        <label>
          Break (min)
          <input
            type="number"
            min="1"
            max="120"
            value={minutes.break}
            onChange={(e) => handleMinutesChange("break", e.target.value)}
          />
        </label>
      </div>
      <p className="sessions">Completed sessions: {sessions}</p>
      <button className="link-button" onClick={handleClearSessions}>
        Clear sessions
      </button>
    </main>
  );
}
