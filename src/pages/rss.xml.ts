import { notes } from "../lib/notes";
const esc = (s: string) =>
  s.replace(
    /[<>&"']/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[c]!,
  );
export async function GET() {
  const entries = (await notes()).filter((n) => !n.data.draft);
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>k10n — Kevin Sherman</title><link>https://k10n.com/</link><description>Writing and occasional notes from Kevin Sherman.</description><language>en</language>${entries.map((n) => `<item><title>${esc(n.data.title)}</title><link>https://k10n.com/notes/${n.id}/</link><guid>https://k10n.com/notes/${n.id}/</guid><description>${esc(n.data.description)}</description><pubDate>${n.data.date.toUTCString()}</pubDate></item>`).join("")}</channel></rss>`,
    { headers: { "Content-Type": "application/rss+xml" } },
  );
}
