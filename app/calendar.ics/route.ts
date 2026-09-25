import { buildIcs, getSchedule, icsResponse } from "@/lib/schedule";

// Rebuilt hourly on Vercel, so subscribers see new events without a redeploy.
export const revalidate = 3600;

/** The HUSSS calendar feed. Subscribe once and every event shows up on its own. */
export function GET() {
  const { dated } = getSchedule();
  return icsResponse(buildIcs(dated), "husss.ics");
}
