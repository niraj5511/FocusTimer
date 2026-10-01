import { useState, useEffect } from "react";

const DURATIONS = { focus: 25 * 60, break: 5 * 60 };

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function App() {
  const [mode, setMode] = useState("focus");
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("focus-sessions");
    return saved ? Number(saved) : 0;
  });

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

  // When the timer hits 0, count the session and switch modes
  useEffect(() => {
    if (secondsLeft > 0) return;

    const nextMode = mode === "focus" ? "break" : "focus";
    if (mode === "focus") setSessions((n) => n + 1);
    setMode(nextMode);
    setSecondsLeft(DURATIONS[nextMode]);
    setIsRunning(false);
  }, [secondsLeft, mode]);

  function switchMode(newMode) {
    setMode(newMode);
    setSecondsLeft(DURATIONS[newMode]);
    setIsRunning(false);
  }

  function handleReset() {
    setIsRunning(false);
    setSecondsLeft(DURATIONS[mode]);
  }

  return (
    <main>
      <h1>Focus Timer</h1>
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
      <p className="sessions">Completed sessions: {sessions}</p>
    </main>
  );
}
