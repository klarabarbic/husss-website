"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BOARD } from "@/content/board";
import { IconChevron, IconClose, IconLinkedIn, IconMail } from "./icons";
import { useLayer, useScrollLock } from "./useLayer";

export default function Board() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const { live, shown } = useLayer(open, 400);
  useScrollLock(open);

  const closeBtn = useRef<HTMLButtonElement>(null);
  const side = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const step = (d: number) => setIndex((i) => (i + d + BOARD.length) % BOARD.length);

  const openBio = (i: number) => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setIndex(i);
    setOpen(true);
  };
  const closeBio = () => {
    setOpen(false);
    returnFocus.current?.focus();
  };

  useEffect(() => {
    if (live && open) closeBtn.current?.focus();
  }, [live, open]);

  useEffect(() => {
    if (side.current) side.current.scrollTop = 0;
  }, [index]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBio();
      else if (e.key === "ArrowLeft") { step(-1); e.preventDefault(); }
      else if (e.key === "ArrowRight") { step(1); e.preventDefault(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const p = BOARD[index];

  return (
    <>
      <div className="board">
        {BOARD.map((m, i) => (
          <button
            key={m.name}
            type="button"
            className="person"
            data-rise=""
            aria-label={`Read ${m.name}'s bio`}
            onClick={() => openBio(i)}
          >
            <span className="person__frame">
              <Image
                src={m.photo}
                alt={m.name}
                fill
                sizes="(max-width: 359px) 100vw, (max-width: 700px) 50vw, (max-width: 1080px) 33vw, 220px"
                style={{ objectPosition: m.pos }}
              />
              <span className="person__cue">Read bio</span>
            </span>
            <span className="person__body">
              <span className="person__name">{m.name}</span>
              <span className="person__role">{m.role}</span>
              <span className="person__rule" aria-hidden="true" />
            </span>
          </button>
        ))}
      </div>

      <div
        className={`bio${live ? " is-live" : ""}${shown ? " is-shown" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bioName"
        hidden={!live}
        onClick={(e) => { if (e.target === e.currentTarget) closeBio(); }}
      >
        <div className="bio__card">
          <div className="bio__photo">
            {/* keyed so the subtle zoom-in restarts for each person */}
            <Image
              key={p.photo}
              src={p.photo}
              alt={p.name}
              width={600}
              height={750}
              sizes="(max-width: 760px) 100vw, 300px"
              style={{ objectPosition: p.pos }}
            />
            <button className="bio__close" ref={closeBtn} aria-label="Close" onClick={closeBio}>
              <IconClose />
            </button>
            <div className="bio__nav">
              <button aria-label="Previous board member" onClick={() => step(-1)}>
                <IconChevron dir="left" />
              </button>
              <button aria-label="Next board member" onClick={() => step(1)}>
                <IconChevron dir="right" />
              </button>
            </div>
          </div>
          <div className="bio__side" ref={side}>
            <p className="bio__kicker">{p.role}</p>
            <h3 className="bio__name" id="bioName">{p.name}</h3>
            <div className="bio__rule" aria-hidden="true" />
            <div className="bio__text">
              {p.bio.map((t, i) => <p key={i}>{t}</p>)}
            </div>
            <div className="bio__contact">
              <a className="chip" href={`mailto:${p.email}`}>
                <IconMail />
                <span>{p.email}</span>
              </a>
              {p.linkedin && (
                <a className="chip" href={p.linkedin} target="_blank" rel="noopener noreferrer">
                  <IconLinkedIn />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
