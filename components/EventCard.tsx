"use client";

import Image from "next/image";
import { useId, useState } from "react";
import type { ScheduledEvent } from "@/lib/schedule";
import { useOpenGallery } from "./Gallery";
import { IconGallery } from "./icons";

export default function EventCard({ ev }: { ev: ScheduledEvent }) {
  const [open, setOpen] = useState(false);
  const openGallery = useOpenGallery();
  const bodyId = useId();
  const n = ev.photos.length;

  return (
    <article className={`ev${open ? " is-open" : ""}`} id={`ev-${ev.slug}`} data-rise="">
      <div className="ev__cover">
        {ev.cover ? (
          <Image
            src={ev.cover}
            alt={ev.title}
            fill
            sizes="(max-width: 420px) 100vw, 380px"
            style={{ objectPosition: ev.coverPos ?? "50% 50%" }}
          />
        ) : (
          <div className="ev__ph">
            <span>Photos coming soon</span>
          </div>
        )}
        <div className="ev__when">{ev.dateLabel}</div>
        {ev.badge && <div className="ev__badge">{ev.badge}</div>}
      </div>

      <div className="ev__body">
        <h3 className="ev__title">{ev.title}</h3>
        <p className="ev__meta">{ev.metaLabel}</p>
        <p className="ev__teaser">{ev.teaser}</p>
        <div className="ev__full" id={bodyId}>
          <div>
            {ev.full.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>

        <div className="ev__actions">
          <button
            className="iconbtn ev__more"
            aria-expanded={open}
            aria-controls={bodyId}
            aria-label={`Read the full description of ${ev.title}`}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="dots" aria-hidden="true"><i /><i /><i /></span>
            <span className="iconbtn__tip">{open ? "Close" : "Read more"}</span>
          </button>
          {n > 0 && (
            <>
              <button
                className="iconbtn ev__gal"
                aria-label={`Open the photo gallery for ${ev.title}`}
                onClick={() => openGallery(ev)}
              >
                <IconGallery />
                <span className="iconbtn__tip">Photos</span>
              </button>
              <span className="ev__count">{n} photo{n === 1 ? "" : "s"}</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
