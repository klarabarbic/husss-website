"use client";

import { useEffect, useState } from "react";

/**
 * Drives the two-step open/close used by every overlay on the site:
 * `live` puts the layer in the layout (display:grid), and `shown` fades it in
 * a frame later so the CSS transition actually runs. On close, `shown` drops
 * first and `live` follows once the fade-out has finished.
 */
export function useLayer(open: boolean, fadeMs = 400) {
  const [live, setLive] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (open) {
      setLive(true);
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setShown(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }
    setShown(false);
    const t = setTimeout(() => setLive(false), fadeMs);
    return () => clearTimeout(t);
  }, [open, fadeMs]);

  return { live, shown };
}

/** Locks page scroll while an overlay is open. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [locked]);
}
