"use client";

import { useEffect, useRef } from "react";
import { SITE } from "@/content/site";

export default function Hero({ next }: { next?: { title: string; when: string } }) {
  const inner = useRef<HTMLDivElement>(null);

  // gentle parallax on the cover, disabled for reduced motion
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const el = inner.current;
        if (el && y < window.innerHeight * 1.2) {
          el.style.transform = `translateY(${y * 0.1}px)`;
          el.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.8)));
        }
        ticking = false;
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="hero" id="top">
      <div className="hero__tex" aria-hidden="true" />
      <div className="hero__logo" aria-hidden="true" />
      <div className="hero__wash" aria-hidden="true" />
      <div className="hero__wash2" aria-hidden="true" />
      <div className="hero__grain" aria-hidden="true" />

      <div className="hero__inner" ref={inner}>
        <p className="hero__eyebrow">
          <span>
            <span className="hero__eyebrow-part">Harvard College</span>
            <span className="hero__eyebrow-dot"> · </span>
            <span className="hero__eyebrow-part">A regional community</span>
          </span>
        </p>
        <h1>
          Harvard Undergraduate <em>South Slavic Society</em>
        </h1>
        <div className="hero__rule" aria-hidden="true" />
        <p className="hero__sub">A regional home at Harvard for students from the South Slavic countries of Europe.</p>
        <ul className="hero__flags">
          {SITE.countries.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        {next && (
          <a className="hero__next" href="#upcoming">
            <span className="hero__next-k">Next gathering</span>
            <span>
              {next.title} · {next.when}
            </span>
            <span aria-hidden="true">→</span>
          </a>
        )}
      </div>

      <a className="scrollcue" href="#about" aria-label="Scroll to About">
        <span>Scroll</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}
