# karthiks360 — Personal Portfolio

The personal portfolio website of **Karthik S**, Software Developer at SISA Information Security. Built with Next.js and statically exported for GitHub Pages, live at [karthiks360.com](https://karthiks360.com).

The original design is available on [Figma](https://www.figma.com/design/2vOUMz9HJJPBLwr3r6l65r/Portfolio-Website-Home-Page).

## Tech Stack

- **Next.js 16** (App Router, static export via `output: 'export'`)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 3**
- **Radix UI** primitives + shadcn-style components (`src/components/ui`)
- **next-themes** for light/dark mode

## Features

- Single-page portfolio: Hero, Tech Stack, About, Projects, Footer
- Animated `ParticleBackground` and `MouseGlowEffect`
- System-aware dark mode with a manual toggle
- SEO metadata + Open Graph / Twitter cards (`src/app/layout.tsx`)
- A separate `/pay` page for generating UPI payment deep links

## Project Structure

```
src/
  app/
    layout.tsx        # Root layout, metadata, ThemeProvider
    page.tsx          # Home page — composes the section components
    pay/page.tsx      # UPI payment deep-link page
    globals.css       # Tailwind + global styles
  components/
    Hero, About, TechStack, Projects, Navigation, Footer,
    ParticleBackground, MouseGlowEffect, ThemeProvider, ThemeToggle
    ui/               # Reusable Radix/shadcn-style primitives
```

## Running Locally

```bash
npm install     # install dependencies
npm run dev     # start the dev server at http://localhost:3000
```

## Building for Production

```bash
npm run build   # static export to the ./out folder
```

The site is a fully static export (`output: 'export'`), so `npm start` is not
used in deployment. To preview the export locally:

```bash
npx serve@latest out
```

## Deployment

The site deploys to GitHub Pages via GitHub Actions on every push to the default
branch, and is served from the custom domain in `public/CNAME`. See
[DEPLOYMENT.md](DEPLOYMENT.md) for the full setup, including `basePath`
configuration when hosting under `username.github.io/repo-name`.
