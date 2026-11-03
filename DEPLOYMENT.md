# Deployment

The site is a static Next.js export deployed to **GitHub Pages** under the
custom domain **karthiks360.com**. There is no server at runtime.

## How a deploy happens

1. Push to the **`master`** branch (or run the workflow manually from the
   Actions tab via *workflow_dispatch*).
2. `.github/workflows/deploy.yml` runs on Ubuntu with Node 22:
   - `npm ci`
   - `npm run lint`
   - `npm test` (vitest)
   - `npm run build` → static export in `out/`
   - a metadata check: every route has `out/<route>/index.html` with a
     canonical URL pointing at itself, `/pay` is `noindex`, and `CNAME`,
     `.nojekyll`, `404.html`, `og.png`, `robots.txt`, `sitemap.xml` exist
   - upload `out/` and deploy with `actions/deploy-pages`
   - a smoke test against the live domain: `/`, `/tools/`, `/pay/` return
     200, `/tools` redirects (301) to `/tools/`, and `/og.png` is served as
     `image/png`. It retries for ~3 minutes while Pages propagates.

A failed lint, test, build or check stops the deploy; the previous version
stays live.

## Repository settings (one-time)

- **Settings → Pages → Build and deployment → Source:** *GitHub Actions*.
- **Settings → Pages → Custom domain:** `karthiks360.com` (the value is also
  committed in `public/CNAME` so it survives every deploy). Keep *Enforce
  HTTPS* on.
- DNS: `A`/`AAAA` records for the apex pointing at GitHub Pages, plus a
  `CNAME` for `www` if used.

## Routing notes

- `next.config.ts` sets `output: 'export'` and `trailingSlash: true`, so each
  route is exported as `route/index.html`. GitHub Pages serves `/tools/`
  directly and redirects `/tools` → `/tools/`.
- `public/.nojekyll` stops Pages from running Jekyll over `_next/`.
- `src/app/not-found.tsx` becomes `out/404.html`, which Pages serves for
  unknown paths.
- `basePath` / `assetPrefix` stay commented out because the site lives at the
  domain root. Only uncomment them if the site ever moves to
  `username.github.io/<repo>`.

## Caching

GitHub Pages serves HTML with a short cache (~10 minutes). Right after a deploy
a returning visitor can hold a cached page that references chunk hashes from
the previous build; a reload fixes it. Deploying infrequently keeps this
window rare.

## Build and preview locally

```bash
npm ci
npm run lint
npm test
npm run build      # writes ./out
npx serve@latest out
```
