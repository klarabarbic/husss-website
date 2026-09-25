import { SITE } from "@/content/site";
import {
  format,
  googleCalendarUrl,
  googleSubscribeUrl,
  icsPath,
  feedUrl,
  webcalUrl,
  type Schedule as ScheduleData,
  type ScheduledEvent,
} from "@/lib/schedule";
import Countdown from "./Countdown";
import CopyLink from "./CopyLink";
import { IconCalendar, IconClock, IconInstagram, IconPin } from "./icons";

/* ============================================================================
   UPCOMING EVENTS
   A wall-calendar spotlight for the next gathering (or a "being planned"
   state), a stub for each later one, the semester embroidered as a ribbon,
   and a one-tap calendar subscription.
   ========================================================================= */

export default function Schedule({ data }: { data: ScheduleData }) {
  const { next, later, semester } = data;

  return (
    <section className="section sched" id="upcoming">
      <div className="wrap">
        <div className="sched__head" data-rise="">
          <div className="shead">
            <p className="shead__kicker">Upcoming Events</p>
            <h2>What is next</h2>
          </div>
          <p className="sched__term">{semester.label}</p>
        </div>

        {next ? <Spotlight ev={next} now={data.now} /> : <Planning data={data} />}

        {later.length > 0 && (
          <ol className="stubs">
            {later.map((ev) => (
              <Stub key={ev.slug} ev={ev} />
            ))}
          </ol>
        )}

        <Ribbon semester={semester} />
        <Subscribe />
      </div>
    </section>
  );
}

/* ------------------------------------------------------ the calendar page */

function CalPage({ at, month }: { at?: number; month?: number }) {
  if (at === undefined) {
    const m = new Date(month ?? Date.now());
    return (
      <div className="cal cal--tba" aria-hidden="true">
        <span className="cal__month">{format.month(m)}</span>
        <span className="cal__day">?</span>
        <span className="cal__dow">Date soon</span>
      </div>
    );
  }
  const d = new Date(at);
  return (
    <time className="cal" dateTime={d.toISOString()}>
      <span className="cal__month">{format.month(d)}</span>
      <span className="cal__day">{format.day(d)}</span>
      <span className="cal__dow">{format.weekday(d)}</span>
    </time>
  );
}

/* ----------------------------------------------------- next up, scheduled */

function Spotlight({ ev, now }: { ev: ScheduledEvent; now: number }) {
  const google = googleCalendarUrl(ev);
  return (
    <article className="spot" id={`ev-${ev.slug}`} data-rise="">
      <CalPage at={ev.startAt} month={now} />
      <div className="spot__body">
        <p className="spot__flag">
          <i aria-hidden="true" /> Next up
        </p>
        <h3 className="spot__title">{ev.title}</h3>
        <ul className="spot__facts">
          <li>
            <IconClock />
            <span>{ev.whenLabel ?? "Date to be announced"}</span>
          </li>
          {ev.location && (
            <li>
              <IconPin />
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.location + ", Cambridge, MA")}`} target="_blank" rel="noopener noreferrer">
                {ev.location}
              </a>
            </li>
          )}
        </ul>
        <p className="spot__teaser">{ev.teaser}</p>
        {ev.full.length > 0 && (
          <details className="spot__more">
            <summary>More about the evening</summary>
            {ev.full.map((p, i) => <p key={i}>{p}</p>)}
          </details>
        )}

        {ev.startAt !== undefined && ev.endAt !== undefined && (
          <Countdown start={ev.startAt} end={ev.endAt} serverNow={now} />
        )}

        <div className="spot__actions">
          {ev.rsvp && (
            <a className="btn" href={ev.rsvp} target="_blank" rel="noopener noreferrer">
              <span>RSVP</span>
            </a>
          )}
          {google && (
            <>
              <a className={ev.rsvp ? "btn btn--ghost" : "btn"} href={google} target="_blank" rel="noopener noreferrer">
                <IconCalendar />
                <span>Google Calendar</span>
              </a>
              <a className="btn btn--ghost" href={icsPath(ev)}>
                <IconCalendar />
                <span>Apple · Outlook</span>
              </a>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

/* ----------------------------------------- next up, nothing scheduled yet */

function Planning({ data }: { data: ScheduleData }) {
  return (
    <article className="spot spot--tba" data-rise="">
      <CalPage month={data.now} />
      <div className="spot__body">
        <p className="spot__flag spot__flag--quiet">
          <i aria-hidden="true" /> In the works
        </p>
        <h3 className="spot__title">Something is cooking.</h3>
        <p className="spot__teaser">
          The board is planning the next gathering right now. Follow along on Instagram to hear about it first, or add
          the HUSSS calendar to your phone and it will be there the moment it is announced.
        </p>

        {data.traditions.length > 0 && (
          <div className="spot__soon">
            <p>Back every semester</p>
            <ul>
              {data.traditions.map((t) => (
                <li key={t.slug}>
                  <b>{t.title}</b>
                  <span>{t.recurring}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="spot__actions">
          <a className="btn" href={SITE.instagram.url} target="_blank" rel="noopener noreferrer">
            <IconInstagram />
            <span>Follow @{SITE.instagram.handle}</span>
          </a>
          <a className="btn btn--ghost" href="#subscribe">
            <IconCalendar />
            <span>Add the calendar</span>
          </a>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------- later this term */

function Stub({ ev }: { ev: ScheduledEvent }) {
  const d = ev.startAt !== undefined ? new Date(ev.startAt) : undefined;
  const google = googleCalendarUrl(ev);
  return (
    <li className="stub" id={`ev-${ev.slug}`} data-rise="">
      <time className="stub__date" dateTime={d?.toISOString()}>
        <span>{d ? format.monthShort(d) : "Date"}</span>
        <b>{d ? format.day(d) : "TBA"}</b>
      </time>
      <div className="stub__body">
        <h3>{ev.title}</h3>
        <p>{ev.metaLabel}</p>
      </div>
      {google && (
        <a className="iconbtn stub__add" href={google} target="_blank" rel="noopener noreferrer" aria-label={`Add ${ev.title} to Google Calendar`}>
          <IconCalendar />
          <span className="iconbtn__tip">Add to calendar</span>
        </a>
      )}
    </li>
  );
}

/* ------------------------------------------------- the semester, stitched */

function Ribbon({ semester }: { semester: ScheduleData["semester"] }) {
  const done = semester.todayPct ?? 0;
  return (
    <figure className="ribbon" data-rise="">
      <figcaption className="ribbon__cap">
        <span className="ribbon__title">{semester.label}, stitched as we go</span>
        <span className="ribbon__legend">
          <span><i className="gem gem--past" /> Happened</span>
          <span><i className="gem gem--upcoming" /> Coming up</span>
        </span>
      </figcaption>

      <div className="ribbon__track" style={{ "--done": `${done}%` } as React.CSSProperties}>
        <ol className="ribbon__marks">
          {semester.markers.map((m) => (
            <li
              key={m.slug}
              className={`mark mark--${m.state}${m.edge ? ` mark--${m.edge}` : ""}`}
              style={{ left: `${m.pct}%` }}
            >
              <a href={`#ev-${m.slug}`}>
                <i className={`gem gem--${m.state === "past" ? "past" : "upcoming"}`} aria-hidden="true" />
                <span className="mark__label">
                  <b>{m.title}</b>
                  <span>{m.label}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
        {semester.todayPct !== undefined && (
          <span className="ribbon__today" style={{ left: `${semester.todayPct}%` }}>
            <span>Today · {semester.todayLabel}</span>
          </span>
        )}
      </div>

      <ol className="ribbon__months" aria-hidden="true">
        {semester.months.map((m) => (
          <li key={m.label} style={{ left: `${m.pct}%` }}>{m.label}</li>
        ))}
      </ol>

      {/* on phones the floating labels would collide, so they are listed here instead */}
      {semester.markers.length > 0 && (
        <ol className="ribbon__list">
          {semester.markers.map((m) => (
            <li key={m.slug}>
              <a href={`#ev-${m.slug}`}>
                <i className={`gem gem--${m.state === "past" ? "past" : "upcoming"}`} aria-hidden="true" />
                <b>{m.title}</b>
                <span>{m.label}</span>
              </a>
            </li>
          ))}
        </ol>
      )}
    </figure>
  );
}

/* ---------------------------------------------------------- subscribe */

function Subscribe() {
  return (
    <aside className="sub" id="subscribe" data-rise="">
      <div className="sub__txt">
        <h3>Never miss a gathering</h3>
        <p>
          Add the HUSSS calendar once. Every new event then lands in your phone&apos;s calendar by itself, with the
          time and place.
        </p>
      </div>
      <div className="sub__actions">
        <a className="sub__btn" href={webcalUrl()}>
          <IconCalendar />
          <span>Apple Calendar</span>
        </a>
        <a className="sub__btn" href={googleSubscribeUrl()} target="_blank" rel="noopener noreferrer">
          <IconCalendar />
          <span>Google Calendar</span>
        </a>
        <CopyLink className="sub__btn" url={feedUrl()} />
      </div>
    </aside>
  );
}
