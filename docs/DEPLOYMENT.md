# Deployment review — not authorization to deploy

## Verified November 9, 2026

Existing Tower nginx serves this site as static files from its verified k10n mount. Read-only inspection confirmed the current vhost and container mount. The existing homepage and photograph match deployed baseline `c3a4fe533611900fa966d7cda9625cb9e88fbf8a`; both Tower Kopia Backup pages must stay at their existing URLs with unchanged content.

Astro output needs no new server, runtime, DNS, certificate, or proxy target. Upload **only `dist/`** to the existing verified destination after approval, backup verification, manifest comparison and a reviewed checksum dry run. Deployment paths and SSH instructions are kept in private workspace operations docs, not public artifacts.

## Email

No MX, SPF, DKIM, DMARC, forwarding, mail routing, registrar, authoritative DNS, or mail-server changes are required or proposed. The static-site build cannot modify email configuration. This review did not send email or audit mail deliverability, and makes no claim that web hosting and email hosting are the same service.

## True 404 status: separate web-only configuration approval

Current nginx location contains:

```nginx
try_files $uri $uri/ /index.html =404;
```

This returns homepage HTTP 200 for unknown URLs. Astro generates `404.html`, but uploading that file alone cannot fix the fallback. Proposed narrowly scoped adjustment **for this vhost only**, after explicit infrastructure approval:

```nginx
location / {
    try_files $uri $uri/ =404;
}
error_page 404 /404.html;
location = /404.html {
    internal;
}
```

Retain all unrelated server settings. Test config syntax before a supported reload; verify existing directory URLs and unknown routes afterward. This proposal has not been applied or validated against a running modified nginx. The local preview can serve the custom 404, but current production will not return it correctly until this change is approved and tested.

## Release and rollback checklist

1. Obtain final design/content approval, including replacement of the photo-only homepage. Obtain explicit approval for the web-only 404 adjustment separately or as an explicit part of release authorization.
2. Inspect current default branch, production inventory and hosting path again. Read-only GitHub API inspection confirmed legacy Pages builds from `master:/` with the k10n.com CNAME (its `https_enforced` flag is false, distinct from the verified live Tower HTTPS). Recheck before merging; never assume a merge is inert. This branch is not merged.
3. Capture a new complete private production backup including the existing OAuth subtree. The earlier pre-OAuth backup is **not** sufficient for rollback of this redesign. Verify archive hashes, permissions and file inventory. Back up the vhost separately if its change is authorized.
4. Build from clean approved merged source with `REVIEW_DRAFTS` unset; run validation. Confirm no draft route/banner, no server details/secrets, and byte-identical preserved assets/OAuth pages. Decide whether to approve and publish the sample note; otherwise launch Home + About without promoting an empty Notes section.
5. Stage only `dist/`. Compare manifests and checksum dry run. Preserve existing assets/metadata; no broad deletion or unrelated directory changes. Review each proposed replacement/addition.
6. Deploy and verify HTTPS content/hashes, Home/About/Notes as applicable, RSS, sitemap, robots, historical asset URLs, both OAuth pages and privacy navigation. If approved, validate/reload only the scoped nginx change and require real HTTP 404 for a random missing path.
7. Roll back only with authority: restore the verified complete pre-release site and, if changed, vhost backup; validate syntax before reload. Verify the old homepage, photograph and both OAuth pages. Do not restore the earlier five-file pre-OAuth archive over the current site.

No production writes, merge, infrastructure edits, or email changes were made while preparing this branch.
