# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

`karthiks360` is Karthik S's personal portfolio website. It is a **Next.js 16
App Router** project that is **statically exported** (`output: 'export'`) and
deployed to **GitHub Pages** under the custom domain `karthiks360.com`
(see `public/CNAME`).

## Commands

```bash
npm install     # install dependencies
npm run dev     # dev server at http://localhost:3000
npm run build   # static export to ./out (uses the webpack builder)
npm run lint    # eslint
npm test        # vitest unit tests for the tool converters (src/**/__tests__)
```

CI runs lint → test → build → an exported-metadata check → deploy → a live
smoke test, so all four local commands must pass before a push.

There is no `npm start` in the deployment flow — the output is static HTML in
`out/`. Preview a build with `npx serve@latest out`.

## Architecture

- **App Router** lives in `src/app`.
  - `layout.tsx` — root layout: SEO/OpenGraph metadata, viewport, and the
    `ThemeProvider` (next-themes, `attribute="class"`, `defaultTheme="system"`).
  - `page.tsx` — the home page; it composes section components in order
    (Navigation → Hero → TechStack → About → Projects → Footer) over a
    `ParticleBackground` + `MouseGlowEffect`.
  - `pay/page.tsx` — a client component that maps typed keys to `upi://pay`
    deep links for collecting payments.
- **Section components** are in `src/components/*.tsx`.
- **Reusable UI primitives** are in `src/components/ui/` — shadcn-style wrappers
  around Radix UI. Prefer reusing these over adding new dependencies.
- **Styling** is Tailwind CSS (`tailwind.config.ts`, `src/app/globals.css`).
  Dark mode is class-based; use `dark:` variants and keep both themes styled.

## Conventions

- **TypeScript** everywhere; import via the `@/` alias (maps to `src/`).
- Components use **named exports** (e.g. `export function Hero()`), and consumers
  import them by name: `import { Hero } from '@/components/Hero'`.
- Client components must start with `'use client'` (needed for hooks, theme, and
  interactivity).
- Match the existing code style: 4-space indentation in most `src/app` files,
  Tailwind utility classes inline.

## Git / commits

- **Never add a `Co-Authored-By` trailer** (or any co-author) to commits. Commits
  must be authored solely by the repository owner. Do not add "Generated with"
  or any tool/assistant attribution to commit messages or PR descriptions.
- Keep commit messages plain and factual (Conventional Commits style is fine).

## Static-export constraints

Because the site is a static export for GitHub Pages, avoid features that require
a Node server at runtime:

- No server actions, route handlers, or SSR/ISR that depend on a running server.
- Images use `unoptimized: true` (`next.config.ts`) — no Next.js image
  optimization at runtime.
- If the site ever moves to `username.github.io/repo-name`, uncomment `basePath`
  and `assetPrefix` in `next.config.ts` (see `DEPLOYMENT.md`).

## Deployment

Pushing to the default branch triggers a GitHub Actions workflow that builds the
static export and publishes it to GitHub Pages. `public/.nojekyll` prevents
Jekyll from processing the output. Full details in `DEPLOYMENT.md`.
