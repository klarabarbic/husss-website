"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SITE } from "@/content/site";
import { IconInstagram } from "./icons";

export default function Nav() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // solid bar once the cover is mostly scrolled past
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > window.innerHeight * 0.72);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);

  // active section highlighting
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setActive("#" + en.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SITE.nav.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) spy.observe(el);
    });
    return () => spy.disconnect();
  }, []);

  return (
    <header className={`nav${stuck || open ? " is-stuck" : ""}`}>
      <div className="nav__inner">
        <a className="brand" href="#top">
          <Image className="brand__mark" src="/husss-crest.png" alt="HUSSS crest" width={447} height={512} sizes="40px" priority />
          <span className="brand__txt">
            <span className="brand__abbr">{SITE.short}</span>
            <span className="brand__full">{SITE.name}</span>
          </span>
        </a>

        <button
          className="burger"
          aria-expanded={open}
          aria-controls="menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`menu${open ? " is-open" : ""}`} id="menu" aria-label="Main">
          {SITE.nav.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              aria-current={active === href ? "true" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>

        <a
          className="nav__ig"
          href={SITE.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`HUSSS on Instagram, @${SITE.instagram.handle}`}
        >
          <IconInstagram />
        </a>
      </div>
    </header>
  );
}
