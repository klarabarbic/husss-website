# HUSSS website

The whole site is one file: `index.html`. Open it in any browser to view it.
All images live in this same folder, so keep the folder together when you move or upload it.

## Donations

The Sponsors section carries a Zelle donation block: a "Donate with Zelle" button, the QR code, and the email address as a fallback. Near the bottom of `index.html`, find:

```js
const DONATE = {
```

| Field | What it does |
| --- | --- |
| `qr` | the QR image file. Empty or missing hides the QR frame, leaving the button |
| `url` | where the button goes. Taken from inside the QR, so both point to the same account |
| `email` | shown as the type-it-by-hand fallback. Empty hides that line |
| `recipient` | the full name Zelle displays. Empty hides the "payments go to" line |

`zelle_qr.png` is the QR cropped out of `donation_qr_code.png` with a white quiet zone around it. It was cropped without resampling, and both files decode to the identical payload, so the code is unchanged. If you ever replace the QR, drop in the new file and update `url` to match what the new code contains, or the button and the code will point to different accounts.

## Adding LinkedIn links to board members

Near the bottom of `index.html`, find the block that starts with:

```js
const BOARD = [
```

Each person has a `linkedin` field that starts empty. While it is empty, no LinkedIn button appears for them. Paste in the full profile URL to switch it on:

```js
linkedin: "https://www.linkedin.com/in/your-handle/"
```

The same block holds each person's `email` and `bio`, so edit those here too. `pos` controls how the headshot is cropped inside its frame; the second number is the vertical position, so lower it to show more forehead and raise it to show more chin.

## Adding event photos later

Open `index.html` in a text editor and scroll to the bottom, to the block that starts with:

```js
const EVENTS = {
```

Every event has two photo slots:

| Slot | What it does |
| --- | --- |
| `cover` | the single big picture at the top of the event card |
| `photos` | the collage that opens behind the gallery icon |

Steps:

1. Put the image files into this folder.
2. Type their file names into `cover` and `photos`, exactly as saved, including the extension and matching upper/lower case.
3. Save the file and refresh the page.

Example, for the Harvard × MIT social:

```js
cover:  "mit_social_cover.jpg",
photos: ["mit_social_1.jpg", "mit_social_2.jpg", "mit_social_3.jpg"]
```

Leave `cover` as `""` and `photos` as `[]` for events with no pictures yet. The card then shows a crimson placeholder and the gallery icon stays hidden until photos exist.

## Adding a new event

Copy one existing block inside `EVENTS.upcoming` or `EVENTS.past` and edit the fields:

- `title` — the event name
- `date` — the short label shown on the cover
- `meta` — the small line under the title
- `badge` — the small crimson pill, or delete the line to hide it
- `teaser` — one sentence, always visible
- `full` — the paragraphs that appear when the three dots are clicked

## Putting it online

Any static host works, because there is no build step and no server code. Upload the entire folder and point the host at `index.html`. Harvard student groups commonly use GitHub Pages, Netlify, or a Harvard-provided web space.

## Files

| File | Use |
| --- | --- |
| `index.html` | the entire website |
| `husss_logo.JPG` | crest, used in the cover, the nav, the About panel and the footer |
| `klara_headshot.jpg` | Klara Barbić |
| `djordje_headshot.png` | Đorđe Ivanović |
| `sabrina_headshot.jpeg` | Sabrina Bukvarević |
| `benjamin_headshot.jpg` | Benjamin Mujkić |
| `tian_headshot.jpeg` | Tian Vlašić |
