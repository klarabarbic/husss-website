"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ScheduledEvent } from "@/lib/schedule";
import { IconClose } from "./icons";
import { useLayer, useScrollLock } from "./useLayer";

const GalleryContext = createContext<(ev: ScheduledEvent) => void>(() => {});
export const useOpenGallery = () => useContext(GalleryContext);

/** Grid thumbnail for a photo: the same file name inside the event's `thumbs` folder. */
const thumbFor = (ev: ScheduledEvent, src: string) =>
  ev.thumbs ? ev.thumbs.replace(/\/?$/, "/") + src.split("/").pop() : src;

/** How many collage photos load straight away; the rest wait until scrolled near. */
const EAGER = 12;

export default function GalleryProvider({ children }: { children: React.ReactNode }) {
  const [ev, setEv] = useState<ScheduledEvent | null>(null);
  const [open, setOpen] = useState(false);
  const lb = useLayer(open, 400);
  useScrollLock(open);

  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const zl = useLayer(zoomOpen, 350);

  const body = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const openGallery = useCallback((next: ScheduledEvent) => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setEv(next);
    setOpen(true);
  }, []);

  const closeGallery = useCallback(() => {
    setOpen(false);
    returnFocus.current?.focus();
  }, []);

  const openZoom = (src: string, alt: string) => {
    setZoom({ src, alt });
    setZoomOpen(true);
  };
  const closeZoom = useCallback(() => setZoomOpen(false), []);

  useEffect(() => {
    if (lb.live && open) closeBtn.current?.focus();
  }, [lb.live, open]);

  // topmost layer wins: single photo first, then the gallery
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (zoomOpen) closeZoom();
      else closeGallery();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, zoomOpen, closeZoom, closeGallery]);

  return (
    <GalleryContext.Provider value={openGallery}>
      {children}

      <div
        className={`lb${lb.live ? " is-live" : ""}${lb.shown ? " is-shown" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lbTitle"
        hidden={!lb.live}
        onClick={(e) => { if (e.target === e.currentTarget) closeGallery(); }}
      >
        <div className="lb__panel">
          <div className="lb__head">
            <div>
              <h3 id="lbTitle">{ev?.title ?? "Gallery"}</h3>
              <p>{ev?.dateLabel}</p>
            </div>
            <button className="lb__close" ref={closeBtn} aria-label="Close gallery" onClick={closeGallery}>
              <IconClose size={19} stroke={1.6} />
            </button>
          </div>
          <div className="lb__body" ref={body}>
            {lb.live && ev && (
              ev.photos.length ? (
                <div className="collage">
                  {ev.photos.map((src, i) => (
                    <CollagePhoto
                      key={src}
                      thumb={thumbFor(ev, src)}
                      full={src}
                      alt={ev.title}
                      eager={i < EAGER}
                      root={body}
                      onOpen={openZoom}
                    />
                  ))}
                </div>
              ) : (
                <div className="lb__empty">
                  <strong>Photos coming soon</strong>
                  We are still gathering pictures from this event. They will appear here once they are added.
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div
        className={`zoom${zl.live ? " is-live" : ""}${zl.shown ? " is-shown" : ""}`}
        aria-hidden={!zoomOpen}
        onClick={closeZoom}
      >
        {zl.live && zoom && <img src={zoom.src} alt={zoom.alt} />}
      </div>
    </GalleryContext.Provider>
  );
}

/**
 * One tile in the masonry collage.
 *
 * A plain <img> on purpose. Native loading="lazy" (which next/image relies on)
 * watches the page viewport, so inside this scrollable modal the later photos
 * never load. Instead each tile watches the modal's own scroll area. The
 * reserved aspect-ratio on .collage figure gives it real geometry before any
 * photo has arrived.
 */
function CollagePhoto({
  thumb, full, alt, eager, root, onOpen,
}: {
  thumb: string;
  full: string;
  alt: string;
  eager: boolean;
  root: React.RefObject<HTMLDivElement | null>;
  onOpen: (src: string, alt: string) => void;
}) {
  const fig = useRef<HTMLElement>(null);
  const [near, setNear] = useState(eager);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (near) return;
    if (!("IntersectionObserver" in window) || !fig.current) {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((en) => en.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { root: root.current, rootMargin: "800px 0px" },
    );
    io.observe(fig.current);
    return () => io.disconnect();
  }, [near, root]);

  if (failed) return null;

  return (
    <figure ref={fig} className={loaded ? "is-loaded" : undefined}>
      {near && (
        <img
          src={encodeURI(thumb)}
          alt={alt}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          onClick={() => onOpen(encodeURI(full), alt)}
        />
      )}
    </figure>
  );
}
