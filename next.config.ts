import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Headshots and event covers are served through Vercel's image optimizer,
    // which resizes them per device and converts to AVIF/WebP.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
