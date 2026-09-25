/* ============================================================================
   EVENTS  —  this is the only file you need to edit to add or update events.

   title     the event name
   start     when it begins, in Boston time on a 24-hour clock: "2026-10-16T20:00"
   end       when it ends (optional, defaults to two hours after start)
   location  where it happens, e.g. "Dunster House JCR" (optional)
   rsvp      a sign-up link, e.g. a Google Form (optional, adds an RSVP button)
   badge     the small crimson pill (delete the line to hide it)
   teaser    one sentence, always visible
   full      the paragraphs that appear when the three dots are clicked
   recurring a label like "Every semester" for traditions that come back. They
             are shown under "Upcoming Events" while nothing is scheduled.
   cover     one big picture for the top of the card ("" = crimson placeholder)
   coverPos  how the cover is cropped ("left% top%"), optional
   photos    the collage behind the gallery icon ([] = icon hidden)
   thumbs    optional folder of small copies with the same file names. The grid
             shows those, and only the photo you click loads at full size.

   Dates, times, the countdown, the semester ribbon and the calendar feed are
   all worked out from `start` and `end`. Once an upcoming event has ended it
   moves to Past Events by itself, no edit needed.

   For an event without an exact date (like the Harvard × MIT social), leave
   out `start` and write the labels by hand instead:
   date      the short label on the cover, e.g. "Last academic year"
   meta      the small line under the title

   Photos live in public/photos/. Write their paths starting with "/photos/",
   exactly as saved, including the extension and matching upper/lower case.
   ========================================================================= */

export type HusssEvent = {
  title: string;
  start?: string;
  end?: string;
  location?: string;
  rsvp?: string;
  date?: string;
  meta?: string;
  badge?: string;
  teaser: string;
  full: string[];
  recurring?: string;
  cover: string;
  coverPos?: string;
  thumbs?: string;
  photos: string[];
};

/** "/photos/mit/mit-01.jpg" … "/photos/mit/mit-63.jpg" */
const numbered = (dir: string, prefix: string, count: number) =>
  Array.from({ length: count }, (_, i) => `${dir}/${prefix}-${String(i + 1).padStart(2, "0")}.jpg`);

export const EVENTS: { upcoming: HusssEvent[]; past: HusssEvent[] } = {
  /* Nothing scheduled right now. Add the next event here and it takes over
     the "Next up" spotlight, with a countdown and add-to-calendar buttons.
     Copy the example below out of this comment, paste it inside the
     brackets of `upcoming: [ ]`, and fill it in:

    {
      title: "Palačinka Night",
      start: "2026-10-16T20:00",
      end: "2026-10-16T22:00",
      location: "Dunster House JCR",
      teaser: "Homemade palačinke, made by students, once every semester.",
      full: ["Everything else people should know about the evening."],
      cover: "",
      photos: [],
    },
  */
  upcoming: [],

  past: [
    {
      title: "Mini Welcome Event",
      start: "2026-09-17T20:00",
      end: "2026-09-17T22:00",
      badge: "First of the year",
      teaser: "An evening of food, music and introductions to open the academic year.",
      full: [
        "The first gathering of the academic year, and a proper one: a lot of food, a lot of music, and a lot of fun. We welcomed our incoming freshmen, announced this year's board, and started the year the way we intend to carry on.",
        "The spread ran to homemade burek, a deli and cheese platter, and a table of sweets from home. Most of the room was current HUSSS undergraduates, but not all of it. An alum came by, and a couple of guests joined at different points through the evening, which is exactly the mix we hope for.",
      ],
      cover: "/photos/welcome-03.jpg",
      coverPos: "50% 45%",
      photos: [
        "/photos/welcome-07.jpg",
        "/photos/welcome-05.jpg",
        "/photos/welcome-06.jpg",
        "/photos/welcome-03.jpg",
        "/photos/welcome-04.jpg",
        "/photos/welcome-01.jpg",
        "/photos/welcome-02.jpg",
      ],
    },
    {
      title: "Harvard × MIT South Slavic Social",
      date: "Last academic year",
      meta: "Harvard & MIT · Social and networking",
      badge: "70+ attended",
      teaser: "A social and networking night with MIT that drew over seventy people.",
      full: [
        "A social and networking event for Harvard students, MIT students, and all of the affiliates and professionals connected to the two schools. More than 60 people signed up and more than 70 showed up, making it the largest South Slavic gathering across the two campuses.",
        "The night ran on regional specialties: burek and kiflice, bake rolls, homemade bread, deli cuts and cheeses from the region, palačinke, and much more. All of it homemade, prepared through the effort of last academic year's board.",
      ],
      cover: "/photos/mit/mit-01.jpg",
      coverPos: "50% 42%",
      thumbs: "/photos/mit/thumb/",
      photos: numbered("/photos/mit", "mit", 63),
    },
    {
      title: "Palačinka Night",
      date: "Every semester",
      meta: "Semesterly · Harvard College",
      badge: "Semesterly",
      recurring: "Every semester",
      teaser: "Homemade palačinke, made by students, once every semester.",
      full: [
        "Homemade palačinke made by the students themselves, usually hosted in one of the undergraduate common kitchens or in another space Harvard students have access to that is available and appropriate for an evening like this.",
        "It is our simplest and most repeated tradition: batter, pans, fillings, and whoever turns up.",
      ],
      cover: "" /* <-- add a cover photo path here */,
      photos: [] /* <-- add photo paths here */,
    },
  ],
};
