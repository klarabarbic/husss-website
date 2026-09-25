import Image from "next/image";
import Board from "@/components/Board";
import Donate from "@/components/Donate";
import EventCard from "@/components/EventCard";
import GalleryProvider from "@/components/Gallery";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import Schedule from "@/components/Schedule";
import { BOARD } from "@/content/board";
import { IconInstagram } from "@/components/icons";
import { SITE } from "@/content/site";
import { format, getSchedule } from "@/lib/schedule";

const presidents = BOARD.filter((m) => m.role === "Co-President");

// Rebuilt at most hourly on Vercel, so events move from upcoming to past,
// and the semester ribbon's "today" advances, without a redeploy.
export const revalidate = 3600;

export default function Home() {
  const schedule = getSchedule();
  const { next } = schedule;

  return (
    <GalleryProvider>
      <a className="skip" href="#about">Skip to content</a>

      <Nav />
      <Hero
        next={
          next?.startAt !== undefined
            ? { title: next.title, when: `${format.weekdayShort(new Date(next.startAt))} ${format.monthDay(new Date(next.startAt))}` }
            : undefined
        }
      />

      {/* ============================== ABOUT ============================== */}
      <section className="section" id="about">
        <div className="wrap">
          <div className="shead" data-rise="">
            <p className="shead__kicker">About</p>
            <h2>Who we are</h2>
            <p className="shead__hello">
              Dobrodošli <i aria-hidden="true">·</i> <span lang="sr-Cyrl">Добродошли</span> <i aria-hidden="true">·</i>{" "}
              <span lang="mk">Добредојдовте</span>
            </p>
          </div>

          <div className="about">
            <div className="prose prose--wide" data-rise="">
              <p className="lead">
                The Harvard Undergraduate South Slavic Society, or HUSSS, is a regional community at Harvard College
                for students from the South Slavic countries of Europe:{" "}
                <strong>Bosnia and Herzegovina, Croatia, North Macedonia, Montenegro, Serbia, and Slovenia.</strong>
              </p>
              <p>
                We exist so that students who share this corner of the world, its languages, its food and its humor,
                have somewhere familiar to land. Through socials, shared meals, regional traditions and introductions
                across campus, HUSSS keeps the region present at Harvard and connects undergraduates with one another,
                with graduate students, and with alumni and professionals from the region.
              </p>
              <p>
                Everyone is welcome. You do not need to be from the region to belong here, and you do not need a reason
                beyond curiosity. If our events sound like your kind of evening, come.
              </p>
            </div>

            <div className="note" data-rise="">
              <h3>A note on this website</h3>
              <p>
                This website is new, so it does not yet include everything HUSSS has done historically. Many events,
                efforts and initiatives from earlier years are not recorded here. From now on we will do our best to
                keep everything relevant in one place, so that this can be a resource for both the members and the
                friends of HUSSS, who we warmly welcome to be part of the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== BOARD ============================== */}
      <section className="section section--warm" id="board">
        <div className="wrap">
          <div className="shead" data-rise="">
            <p className="shead__kicker">Board Members</p>
            <h2>The people behind HUSSS</h2>
            <p>The board plans every event, keeps the community running, and is always reachable.</p>
          </div>

          <Board />
          <p className="board__hint" data-rise="">Click any board member to read their bio and get in touch.</p>
        </div>
      </section>

      {/* ============================== UPCOMING ============================== */}
      <Schedule data={schedule} />

      {/* ============================== PAST ============================== */}
      <section className="section section--ink" id="past">
        <div className="wrap">
          <div className="shead" data-rise="">
            <p className="shead__kicker">Past Events</p>
            <h2>Where we have been</h2>
            <p>Open the three dots for the full story, and the gallery icon for photos.</p>
          </div>
          <div className="events">
            {schedule.past.map((ev) => <EventCard key={ev.slug} ev={ev} />)}
          </div>
        </div>
      </section>

      {/* ============================== SPONSORS ============================== */}
      <section className="section" id="sponsors">
        <div className="wrap">
          <div className="shead" data-rise="">
            <p className="shead__kicker">Sponsors &amp; Sponsorships</p>
            <h2>How HUSSS is funded</h2>
          </div>

          <div className="spons">
            <div className="panel" data-rise="">
              <h3>
                Our funding <span className="tag">No sponsors</span>
              </h3>
              <p>
                HUSSS currently has <strong>no sponsors and no sponsorships.</strong> We are funded by the{" "}
                <strong>Harvard Undergraduate Association (HUA)</strong>, and every event we organize is paid for from
                that source.
              </p>
              <p>
                That said, we would be delighted to work with sponsors. If you or your organization would like to
                support a regional student community at Harvard, whether for a single event or across a year, we would
                love to hear from you.
              </p>
            </div>

            <div className="panel" data-rise="">
              <h3>Reach out to the co-presidents</h3>
              <p>Sponsorship inquiries, collaborations and anything else go straight to either co-president.</p>
              <ul className="contacts">
                {presidents.map((m) => (
                  <li key={m.email}>
                    <span className="contacts__top">
                      <b>{m.name}</b>
                      <span className="who">{m.role}</span>
                    </span>
                    <a href={`mailto:${m.email}`}>{m.email}</a>
                  </li>
                ))}
              </ul>
            </div>

            <Donate />
          </div>
        </div>
      </section>

      {/* ============================== FOOTER ============================== */}
      <footer className="foot">
        <div className="wrap">
          <div className="foot__top">
            <div className="foot__brand">
              <Image src="/husss-crest.png" alt="HUSSS crest" width={447} height={512} sizes="56px" />
              <div>
                <strong>
                  Harvard Undergraduate
                  <br />
                  South Slavic Society
                </strong>
                <span>HUSSS · Harvard College</span>
              </div>
            </div>
            <nav className="foot__links" aria-label="Footer">
              {SITE.nav.map(({ href, label }) => (
                <a key={href} href={href}>{label}</a>
              ))}
              <a className="foot__ig" href={SITE.instagram.url} target="_blank" rel="noopener noreferrer">
                <IconInstagram />
                <span>@{SITE.instagram.handle}</span>
              </a>
            </nav>
          </div>
          <div className="foot__bot">
            <p>{SITE.countries.join(" · ")}</p>
            <p>This website is new and still growing. Earlier HUSSS events and initiatives are not all recorded here yet.</p>
          </div>
        </div>
      </footer>

      <Reveal />
    </GalleryProvider>
  );
}
