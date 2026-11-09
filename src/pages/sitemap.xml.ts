import { notes } from "../lib/notes";
export async function GET() {
  const entries = (await notes()).filter((n) => !n.data.draft);
  const paths = [
    "/",
    "/about/",
    ...(entries.length ? ["/notes/"] : []),
    "/tower-backup/",
    "/tower-backup/privacy/",
    ...entries.map((n) => `/notes/${n.id}/`),
  ];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>https://k10n.com${p}</loc></url>`).join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
}
