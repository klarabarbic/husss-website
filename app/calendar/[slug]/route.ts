import { buildIcs, getSchedule, icsResponse } from "@/lib/schedule";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return getSchedule().dated.map((e) => ({ slug: e.slug }));
}

/** One event as an .ics file, for Apple Calendar, Outlook and the rest. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ev = getSchedule().dated.find((e) => e.slug === slug);
  if (!ev) return new Response("Not found", { status: 404 });
  return icsResponse(buildIcs([ev]), `${slug}.ics`);
}
