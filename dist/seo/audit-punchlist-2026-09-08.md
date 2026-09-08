# SEO Audit Punch List — 2026-09-08

Site: https://emeraldnotary.com
Audit ID: `bbe20edd-1da9-42aa-aa5d-2ca1bff5562d` (OpenSEO 0.1.7, self-hosted)
Pages crawled: 11 (0 blocked, 0 errored)

Items below could not be fixed inside the repository. Each names the owner who
has to make the change.

---

## Class 3 — Uncrawlable / canonical

Nothing outstanding. The `orphan-page` and `canonicalized-page` issues (10 total)
are handled by the new `_redirects` file at the repo root, which 301s
extensionless URLs (`/services`, `/contact`, `/fees`, `/mobile`, `/ron`) to
their `.html` canonical form. Netlify will pick it up on the next deploy.

If the site ever moves off Netlify, this file no longer applies — the same
redirects would need to be reproduced in whatever the new host uses
(Cloudflare Pages `_redirects`, Vercel `vercel.json`, nginx `.conf`, etc.).

## Class 4 — Headings

Nothing outstanding. All 11 `heading-order-skip` issues are resolved by
downgrading in-body `<h4>` and footer `<h5>` to `<h3>` (with matching CSS
selector updates). Visual styling was preserved because every affected
selector was class-scoped.

## Class 5 — Performance

### `slow-response` — `/mobile.html` at 2921ms
- **Owner:** hosting (Netlify).
- **What breaks:** first-byte time on `/mobile.html` was 2.9s on the crawl. The
  extensionless `/mobile` variant answered in 59ms on the same run, so this is
  almost certainly a cold-cache miss at the Netlify edge (the response header
  showed `Cache-Status: "Netlify Edge"; fwd=miss; fwd-status=200; stored`).
- **Fix:** in the Netlify dashboard, confirm `Cache-Control: public, max-age=…`
  is set on HTML responses (currently `max-age=0, must-revalidate`), or set a
  short-lived edge cache TTL for the site. A single warm request pre-populates
  the edge, so this may also self-resolve once traffic is regular.

### **Performance not assessed** — 0 of 20 Lighthouse runs completed
- **Owner:** OpenSEO operator (you, running the local container).
- **What broke:** Lighthouse ran 20 times (2 runs per page × 10 pages) and every
  single one failed. The crawl still returned page-level facts, but there is
  **no performance data behind priority class 5 for this audit**. Do not treat
  the absence of performance issues as evidence the site is fast.
- **Investigate:** OpenSEO runs Lighthouse in a headless Chromium inside the
  container. Likely causes are (a) the container's Chromium sandbox is
  disabled or blocked by the Docker security profile, or (b) the container
  cannot reach `https://emeraldnotary.com/` outbound (DNS or egress firewall).
  Reproduce with:
  ```
  docker compose -p seo-god -f .seo-god/docker-compose.yml logs --tail 200 | grep -i -E 'lighthouse|chrom'
  ```
  A common fix is adding `--cap-add=SYS_ADMIN` or `security_opt: ["seccomp=unconfined"]`
  to the compose service; check OpenSEO's issue tracker before adding either,
  because they widen the container's privileges.

---

## Not on this list, but worth knowing

- **`canonicalized-page` (5, info):** OpenSEO's own guidance is "no action
  needed" if the extensionless URL should defer to its `.html` twin — which is
  the case here. The `_redirects` file now removes them entirely from Google's
  view, so this becomes a non-issue.
- **`thank-you.html`** is `Disallow`ed in `robots.txt` and not in the sitemap;
  it was not crawled and is intentionally not on the list.
