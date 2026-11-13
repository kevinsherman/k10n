import fs from "node:fs";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
const baseline = "c3a4fe533611900fa966d7cda9625cb9e88fbf8a";
const preserved = [
  "img/sar-nat-kev.jpg",
  "img/favicon.ico",
  "css/styles.css",
  "CNAME",
  "tower-backup/index.html",
  "tower-backup/privacy/index.html",
  "tower-backup/styles.css",
];
for (const p of preserved) {
  const original = execFileSync("git", ["show", `${baseline}:${p}`]);
  assert.deepEqual(fs.readFileSync(`public/${p}`), original, p);
  assert.deepEqual(fs.readFileSync(`dist/${p}`), original, p);
}
for (const p of [
  "index.html",
  "about/index.html",
  "notes/index.html",
  "404.html",
  "rss.xml",
  "sitemap.xml",
  "robots.txt",
])
  assert(fs.existsSync(`dist/${p}`), p);
const review = process.env.REVIEW_DRAFTS === "true";
assert.equal(
  fs.existsSync("dist/notes/a-place-to-keep-things/index.html"),
  review,
  "Draft route boundary",
);
for (const p of ["rss.xml", "sitemap.xml"])
  assert(
    !fs.readFileSync(`dist/${p}`, "utf8").includes("a-place-to-keep-things"),
    "draft leaked to syndication",
  );
function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`],
    );
}
for (const p of walk("dist").filter((p) => /\.(html|css|xml|txt)$/.test(p))) {
  const s = fs.readFileSync(p, "utf8");
  assert(
    !/<script\b|@import|fonts\.googleapis/i.test(s),
    `Client script or remote dependency: ${p}`,
  );
  assert(
    !/PRIVATE KEY|client_secret|refresh_token|192\.168\.|\/mnt\/user\/|SUPPORT_EMAIL_PENDING/.test(
      s,
    ),
    `Sensitive content: ${p}`,
  );
}
const home = fs.readFileSync("dist/index.html", "utf8");
assert.equal(home.includes("noindex, nofollow"), review);
assert.equal(home.includes("Draft for review"), review);
assert(!home.includes("mailto:"), "Unapproved personal contact");
console.log(
  `PASS: 7 original assets/routes byte-identical; expected routes; draft boundaries (${review ? "review" : "production"}); no client JS, third-party imports, sensitive configuration, or unapproved contact.`,
);
