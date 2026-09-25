import { EVENTS, type HusssEvent } from "@/content/events";
import { SITE, SITE_URL } from "@/content/site";

/* ============================================================================
   Everything date-related for the events: reading Boston wall-clock times,
   formatting them, splitting upcoming from past, the semester ribbon, and the
   calendar links and feeds. All times are shown in Boston time, wherever the
   visitor happens to be.
   ========================================================================= */

export const TZ = "America/New_York";
const TWO_HOURS = 2 * 60 * 60 * 1000;

/** Minutes Boston is ahead of UTC at a given instant (negative: -240 or -300). */
function bostonOffset(at: Date): number {
  const name =
    new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "longOffset" })
      .formatToParts(at)
      .find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  const m = name.match(/GMT([+-])(\d{2}):?(\d{2})?/);
  if (!m) return 0;
  const mins = Number(m[2]) * 60 + Number(m[3] ?? 0);
  return m[1] === "-" ? -mins : mins;
}

/** "2026-09-17T20:00", read as Boston wall-clock time, to the real instant. */
export function bostonTime(local: string): Date {
  const [d, t = "00:00"] = local.split("T");
  const naive = new Date(`${d}T${t.length === 5 ? `${t}:00` : t}Z`);
  const first = bostonOffset(naive);
  const guess = new Date(naive.getTime() - first * 60_000);
  const second = bostonOffset(guess); // settles the hour either side of a DST switch
  return second === first ? guess : new Date(naive.getTime() - second * 60_000);
}

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-US", { timeZone: TZ, ...opts });
const clean = (s: string) => s.replace(/[\u202f\u00a0]/g, " ");

export const format = {
  weekday: (d: Date) => fmt({ weekday: "long" }).format(d),
  weekdayShort: (d: Date) => fmt({ weekday: "short" }).format(d),
  day: (d: Date) => fmt({ day: "numeric" }).format(d),
  month: (d: Date) => fmt({ month: "long" }).format(d),
  monthShort: (d: Date) => fmt({ month: "short" }).format(d),
  year: (d: Date) => fmt({ year: "numeric" }).format(d),
  time: (d: Date) => clean(fmt({ hour: "numeric", minute: "2-digit" }).format(d)),
  /** Thu 17 Sep 2026 */
  short: (d: Date) => `${format.weekdayShort(d)} ${format.day(d)} ${format.monthShort(d)} ${format.year(d)}`,
  /** Thursday, September 17, 2026 */
  long: (d: Date) => fmt({ weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(d),
  /** Sep 17 */
  monthDay: (d: Date) => `${format.monthShort(d)} ${format.day(d)}`,
  /** 8:00 – 10:00 PM */
  timeRange: (a: Date, b: Date) => {
    const s = format.time(a);
    const e = format.time(b);
    const sameHalf = s.slice(-2) === e.slice(-2);
    return `${sameHalf ? s.slice(0, -3) : s} – ${e}`;
  },
};

/** Year, month (1–12) and day of an instant, as the calendar reads in Boston. */
function bostonDate(d: Date) {
  const p = Object.fromEntries(
    fmt({ year: "numeric", month: "numeric", day: "numeric" }).formatToParts(d).map((x) => [x.type, x.value]),
  );
  return { y: Number(p.year), m: Number(p.month), d: Number(p.day) };
}

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/* ------------------------------------------------------------------ events */

export type ScheduledEvent = HusssEvent & {
  slug: string;
  startAt?: number;
  endAt?: number;
  /** short label for the card cover, e.g. "Thu 17 Sep 2026" */
  dateLabel: string;
  /** the line under the title, e.g. "Thursday, September 17, 2026 · 8:00 – 10:00 PM" */
  metaLabel: string;
  /** date and time only, e.g. "Thursday, September 17, 2026 · 8:00 – 10:00 PM" */
  whenLabel?: string;
};

function schedule(ev: HusssEvent): ScheduledEvent {
  const startAt = ev.start ? bostonTime(ev.start).getTime() : undefined;
  const endAt = ev.end ? bostonTime(ev.end).getTime() : startAt !== undefined ? startAt + TWO_HOURS : undefined;
  const whenLabel =
    startAt !== undefined && endAt !== undefined
      ? `${format.long(new Date(startAt))} · ${format.timeRange(new Date(startAt), new Date(endAt))}`
      : undefined;
  const year = startAt !== undefined ? `-${format.year(new Date(startAt))}` : "";
  return {
    ...ev,
    slug: slugify(ev.title) + year,
    startAt,
    endAt,
    whenLabel,
    dateLabel: ev.date ?? (startAt !== undefined ? format.short(new Date(startAt)) : "Date to be announced"),
    metaLabel: ev.meta ?? ([whenLabel, ev.location].filter(Boolean).join(" · ") || "Date to be announced"),
  };
}

export type Marker = {
  slug: string;
  title: string;
  label: string;
  pct: number;
  state: "past" | "next" | "upcoming";
  edge?: "start" | "end";
};

export type Schedule = {
  now: number;
  next?: ScheduledEvent;
  later: ScheduledEvent[];
  past: ScheduledEvent[];
  /** recurring traditions not already on the calendar */
  traditions: ScheduledEvent[];
  /** every event with a real date, for the calendar feed */
  dated: ScheduledEvent[];
  semester: {
    label: string;
    todayPct?: number;
    todayLabel: string;
    markers: Marker[];
    months: { label: string; pct: number }[];
  };
};

/** The term a date falls in (summer looks ahead to the fall). */
function termAround(now: Date) {
  const { y, m } = bostonDate(now);
  if (m <= 5) {
    return { label: `Spring ${y}`, from: bostonTime(`${y}-01-20`), to: bostonTime(`${y}-05-25`) };
  }
  return { label: `Fall ${y}`, from: bostonTime(`${y}-08-25`), to: bostonTime(`${y}-12-20`) };
}

export function getSchedule(now = Date.now()): Schedule {
  const upcoming = EVENTS.upcoming.map(schedule);
  const past = EVENTS.past.map(schedule);

  // an upcoming event whose end has passed moves to Past Events by itself
  const stillAhead = upcoming.filter((e) => e.endAt === undefined || e.endAt > now);
  const wrapped = upcoming.filter((e) => e.endAt !== undefined && e.endAt <= now);
  stillAhead.sort((a, b) => (a.startAt ?? Infinity) - (b.startAt ?? Infinity));
  wrapped.sort((a, b) => (b.startAt ?? 0) - (a.startAt ?? 0));

  const [next, ...later] = stillAhead;
  const all = [...upcoming, ...past];
  const scheduledTitles = new Set(stillAhead.map((e) => e.title));
  const traditions = all.filter(
    (e, i) => e.recurring && !scheduledTitles.has(e.title) && all.findIndex((x) => x.title === e.title) === i,
  );

  // the semester ribbon
  const term = termAround(new Date(now));
  const from = term.from.getTime();
  const span = term.to.getTime() - from;
  const pct = (t: number) => Math.min(100, Math.max(0, ((t - from) / span) * 100));

  const markers: Marker[] = all
    .filter((e) => e.startAt !== undefined && e.startAt >= from && e.startAt <= from + span)
    .sort((a, b) => a.startAt! - b.startAt!)
    .map((e) => {
      const p = pct(e.startAt!);
      const isPast = (e.endAt ?? e.startAt!) <= now;
      return {
        slug: e.slug,
        title: e.title,
        label: format.monthDay(new Date(e.startAt!)),
        pct: p,
        state: isPast ? "past" : e === next ? "next" : "upcoming",
        edge: p < 14 ? "start" : p > 86 ? "end" : undefined,
      };
    });

  const months: { label: string; pct: number }[] = [];
  const { y, m } = bostonDate(term.from);
  for (let i = 1; i <= 6; i++) {
    const mm = ((m - 1 + i) % 12) + 1;
    const yy = y + Math.floor((m - 1 + i) / 12);
    const t = bostonTime(`${yy}-${String(mm).padStart(2, "0")}-01`).getTime();
    if (t >= from + span) break;
    months.push({ label: format.monthShort(new Date(t)), pct: pct(t) });
  }

  return {
    now,
    next,
    later,
    past: [...wrapped, ...past],
    traditions,
    dated: all.filter((e) => e.startAt !== undefined),
    semester: {
      label: term.label,
      todayPct: now >= from && now <= from + span ? pct(now) : undefined,
      todayLabel: format.monthDay(new Date(now)),
      markers,
      months,
    },
  };
}

/* ---------------------------------------------------------------- calendar */

/** 20260917T000000Z */
const utcStamp = (t: number) => new Date(t).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const eventUrl = (e: ScheduledEvent) => `${SITE_URL}/#ev-${e.slug}`;

/** A prefilled "add this event" page in Google Calendar. */
export function googleCalendarUrl(e: ScheduledEvent): string | undefined {
  if (e.startAt === undefined || e.endAt === undefined) return undefined;
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${utcStamp(e.startAt)}/${utcStamp(e.endAt)}`,
    details: `${e.teaser}\n\n${eventUrl(e)}`,
    ctz: TZ,
  });
  if (e.location) q.set("location", e.location);
  return `https://calendar.google.com/calendar/render?${q}`;
}

/** The .ics file for one event (Apple Calendar, Outlook, anything else). */
export const icsPath = (e: ScheduledEvent) => `/calendar/${e.slug}`;

/** The feed people subscribe to once; new events then appear on their own. */
export const FEED_PATH = "/calendar.ics";
export const feedUrl = () => `${SITE_URL}${FEED_PATH}`;
export const webcalUrl = () => feedUrl().replace(/^https?:/, "webcal:");
export const googleSubscribeUrl = () =>
  `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcalUrl())}`;

const icsText = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** Lines longer than 75 bytes must be folded (RFC 5545 §3.1). */
function fold(line: string): string {
  const enc = new TextEncoder();
  const out: string[] = [];
  let cur = "";
  let bytes = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    if (bytes + n > (out.length ? 74 : 75)) {
      out.push(cur);
      cur = "";
      bytes = 0;
    }
    cur += ch;
    bytes += n;
  }
  out.push(cur);
  return out.join("\r\n ");
}

export function buildIcs(events: ScheduledEvent[], now = Date.now()): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//HUSSS//Website//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${icsText(SITE.short)}`,
    `X-WR-CALDESC:${icsText(`Events of the ${SITE.name}`)}`,
    `X-WR-TIMEZONE:${TZ}`,
    "REFRESH-INTERVAL;VALUE=DURATION:PT6H",
    "X-PUBLISHED-TTL:PT6H",
  ];
  for (const e of events) {
    if (e.startAt === undefined || e.endAt === undefined) continue;
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.slug}@husss`,
      `DTSTAMP:${utcStamp(now)}`,
      `DTSTART:${utcStamp(e.startAt)}`,
      `DTEND:${utcStamp(e.endAt)}`,
      `SUMMARY:${icsText(e.title)}`,
      `DESCRIPTION:${icsText([e.teaser, ...e.full, eventUrl(e)].join("\n\n"))}`,
      ...(e.location ? [`LOCATION:${icsText(e.location)}`] : []),
      `URL:${eventUrl(e)}`,
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}

export const icsResponse = (body: string, filename: string) =>
  new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="${filename}"`,
    },
  });

