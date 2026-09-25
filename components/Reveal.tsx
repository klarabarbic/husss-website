"use client";

import { useEffect } from "react";

/**
 * Fades every [data-rise] element up into place as it scrolls into view.
 * It marks them with a data-in attribute rather than a class, because React
 * rewrites className whenever a component re-renders (e.g. an event card
 * opening), which would wipe a class added here and hide the element again.
 */
export default function Reveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-rise]");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => {
        el.dataset.in = "";
      });
      return;
    }
    const rise = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((en, i) => {
          if (!en.isIntersecting) return;
          const el = en.target as HTMLElement;
          el.style.transitionDelay = Math.min(i * 70, 280) + "ms";
          el.dataset.in = "";
          obs.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => rise.observe(el));
    return () => rise.disconnect();
  }, []);

  return null;
}
