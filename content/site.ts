export const SITE = {
  name: "Harvard Undergraduate South Slavic Society",
  short: "HUSSS",
  description:
    "HUSSS is the regional community at Harvard for students from Bosnia and Herzegovina, Croatia, North Macedonia, Montenegro, Serbia, and Slovenia.",
  instagram: { handle: "husouthslavs", url: "https://www.instagram.com/husouthslavs/" },
  countries: ["Bosnia and Herzegovina", "Croatia", "North Macedonia", "Montenegro", "Serbia", "Slovenia"],
  nav: [
    { href: "#about", label: "About" },
    { href: "#board", label: "Board Members" },
    { href: "#upcoming", label: "Upcoming Events" },
    { href: "#past", label: "Past Events" },
    { href: "#sponsors", label: "Sponsors & Sponsorships" },
  ],
};

/**
 * The public address of the site, used for link previews and the sitemap.
 * On Vercel this is filled in automatically with the production domain, and it
 * switches to your custom domain as soon as you add one. Set NEXT_PUBLIC_SITE_URL
 * in the Vercel project settings only if you want to override it.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
