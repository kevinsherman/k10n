# k10n

Kevin Sherman's personal website. Astro + TypeScript, static HTML, local CSS, system fonts, Markdown writing. No client JavaScript, backend, analytics, web fonts, or external services.

## Development

Use Node 24 LTS and npm (validated with Node 24.22.1 / npm 12.2.1).

```sh
npm ci --include=dev
npm run dev -- --host 127.0.0.1
npm run validate
```

`npm run validate` type-checks, builds, and verifies preservation, draft exclusion and output safety. `dist/` is the **only** deployment artifact. Never publish the repository root, Markdown sources, node_modules, or a review build.

## Review drafts locally

```sh
REVIEW_DRAFTS=true npm run build
REVIEW_DRAFTS=true node scripts/validate.mjs
npm run preview -- --host 127.0.0.1
```

Review builds show a conspicuous review banner and `noindex` on new pages. They include draft routes, but drafts are always excluded from RSS and the sitemap. Existing OAuth HTML is preserved unchanged, including its metadata. Review builds must remain private: noindex is not access control. Always rebuild with `REVIEW_DRAFTS` unset before a release.

## Add a note

Create `src/content/notes/a-descriptive-slug.md`:

```md
---
title: A useful title
description: A short, honest summary.
date: 2026-11-09
draft: true
tags: [Making things]
---

Write in Markdown here.
```

The filename determines `/notes/a-descriptive-slug/`; use lowercase hyphenated filenames. Dates are UTC. `draft` defaults to true. Preview and review the actual wording; set `draft: false` only after Kevin approves publication. Run `npm run validate`, inspect mobile/desktop output, commit on a branch and open a PR. Merging and deployment require approval. Do not fabricate biographical details or turn unconfirmed content into published fact.

Notes sort newest first. Home shows the latest three. Navigation only shows Notes when at least one entry is visible; no empty section is promoted on the normal homepage. Tags are metadata, not an elaborate taxonomy. Add tag pages only when genuinely useful. RSS and sitemap update automatically. No stale “currently” or relative timestamps need babysitting.

## Content and preservation

- Home: `src/pages/index.astro`; About: `src/pages/about.astro`.
- Layout/navigation/metadata: `src/layouts/Base.astro`; design: `src/styles/site.css`.
- Now, Projects and Contact are intentionally absent pending real content and consent. The brief's email-service address is **not** permission to publish a new personal contact link.
- The sample opening note is proposed wording, not a real published experience. Home and About copy also await Kevin's final review.
- `public/img/sar-nat-kev.jpg` is the unchanged historical photograph at the same URL. It is not automatically reused in the new design. No additional family information or images have been added.
- `public/tower-backup/` preserves both live OAuth pages and their stylesheet byte-for-byte. The already-approved OAuth support contact stays there.
- Original root HTML/CSS/assets remain tracked and untouched as historical source. Astro builds from `src/` and `public/`, not root `index.html`.
- Retained public CSS, favicon and CNAME keep existing asset URLs available. The validation script compares seven preserved files against the deployed baseline commit.

See [release considerations](docs/DEPLOYMENT.md). Nothing in the build or development scripts deploys, changes DNS, or affects email.
