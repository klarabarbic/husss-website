"use client";

import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Live countdown to an event. The first render uses the time the page was
 * built (`serverNow`) so the server and browser agree, then it ticks.
 */
export default function Countdown({ start, end, serverNow }: { start: number; end: number; serverNow: number }) {
  const [now, setNow] = useState(serverNow);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (now >= end) {
    return <p className="cd cd--note">This one just wrapped up. Photos are on their way.</p>;
  }
  if (now >= start) {
    return (
      <p className="cd cd--live">
        <i aria-hidden="true" /> Happening right now
      </p>
    );
  }

  const s = Math.floor((start - now) / 1000);
  const cells = [
    { v: Math.floor(s / 86400), u: "days" },
    { v: Math.floor((s % 86400) / 3600), u: "hours" },
    { v: Math.floor((s % 3600) / 60), u: "min" },
    { v: s % 60, u: "sec" },
  ];

  return (
    <div className="cd" role="timer" aria-label={`Starts in ${cells[0].v} days and ${cells[1].v} hours`}>
      {cells.map(({ v, u }) => (
        <span className="cd__cell" key={u} aria-hidden="true">
          {/* keyed on the value so each change replays the little drop-in */}
          <b key={v}>{u === "days" ? v : pad(v)}</b>
          <small>{u}</small>
        </span>
      ))}
    </div>
  );
}
