# HUSSS website

The website of the Harvard Undergraduate South Slavic Society, built with
[Next.js](https://nextjs.org) (App Router, React, TypeScript) and ready to deploy on [Vercel](https://vercel.com).
The whole site is prerendered to static HTML, so it is fast and costs nothing to host on Vercel's free plan.

## Running it locally

You need Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000, reloads as you edit
npm run build      # the same production build Vercel runs
```

## Deploying on Vercel

1. Push this repository to GitHub.
2. On [vercel.com/new](https://vercel.com/new), import the repository. Vercel detects Next.js by itself,
   so leave every setting at its default and click **Deploy**.
3. Every push to `main` then redeploys the site automatically, and every other branch or pull request gets its
   own preview link.

Or, from this folder, run `npx vercel` for a preview and `npx vercel --prod` for production.

### Adding a custom domain later

In the Vercel project, open **Settings → Domains**, add the domain, and create the DNS records Vercel shows you
at your domain registrar. Nothing in the code needs to change: link previews, the sitemap and `robots.txt` pick up
the production domain automatically. To force a specific address, set `NEXT_PUBLIC_SITE_URL`
(e.g. `https://husss.org`) under **Settings → Environment Variables** and redeploy.

## Where things live

| Path | What it is |
| --- | --- |
| `content/board.ts` | board members: names, roles, headshots, bios, emails, LinkedIn |
| `content/events.ts` | upcoming and past events, covers and photo galleries |
| `content/donate.ts` | the Venmo donation block |
| `content/site.ts` | site name, description, countries, navigation links, Instagram handle |
| `app/page.tsx` | the page itself: About, Sponsors and footer text |
| `app/globals.css` | all of the styling |
| `app/layout.tsx` | page title, description and link-preview settings |
| `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png`, `app/manifest.ts` | tab and home-screen icons, made from `public/husss-crest.png` |
| `app/opengraph-image.jpg` | the picture shown when the link is shared |
| `components/` | the interactive parts: nav, cover, board cards and bio panel, schedule, event cards, gallery |
| `lib/schedule.ts` | dates and times, the upcoming/past split, the semester ribbon, calendar links and the `.ics` feed |
| `public/` | images served as-is: `husss-logo.jpg` (original, used for the cover texture), `husss-crest.png` (transparent cut-out used in the nav, footer and icons), Venmo QR code, `stitch.svg` (the embroidery motif), `board/` headshots, `photos/` event pictures |

Most updates only touch the three files in `content/`. Each one opens with a comment explaining every field.

## Common edits

**Board members.** Edit `content/board.ts`. Put headshots in `public/board/` and reference them as
`"/board/name.jpg"`. `pos` controls the crop inside the frame; lower the second number to show more forehead,
raise it to show more chin. An empty `linkedin: ""` hides the LinkedIn button.

**Events.** Edit `content/events.ts`. For a new event, add a block to `upcoming` with a `title`, a `start` in Boston
time (`"2026-10-16T20:00"`), and optionally `end`, `location` and `rsvp`. That one block drives everything:

- the **Next up** spotlight: a wall-calendar page, a live countdown, and Google / Apple / Outlook calendar buttons
- a **Next gathering** pill on the cover
- a ticket stub for each later event
- a gem on the **semester ribbon**, which is embroidered up to today
- the **calendar feed** at `/calendar.ics`, which people subscribe to once from the "Never miss a gathering" panel

Once an event has ended it moves to Past Events by itself (the page refreshes hourly on Vercel). Then add its
`cover` and `photos`. Put photos in `public/photos/` and reference them as `"/photos/file.jpg"`, matching
upper/lower case exactly. For big galleries, add a folder of small copies with the same file names and point
`thumbs` at it (see the Harvard × MIT social). While nothing is scheduled, the section shows a "Something is
cooking" card listing every event marked `recurring` (e.g. Palačinka Night).

**Donations.** Edit `content/donate.ts`. Donations go through Venmo to @husouthslavs. `public/venmo-qr.svg`
encodes `https://venmo.com/u/husouthslavs`, which opens that profile in the Venmo app. If the handle ever changes,
regenerate the QR for the new address (any QR generator works, e.g. `npx qrcode -o public/venmo-qr.svg
"https://venmo.com/u/NEWHANDLE"`), or the button and the code will point to different accounts.
