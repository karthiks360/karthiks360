# Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm test           # vitest unit tests for the tool converters
npm run build      # static export to ./out
npx serve@latest out
```

## Deploying

Push to **`master`**. The GitHub Actions workflow lints, tests, builds the
static export, checks the exported metadata, publishes to GitHub Pages at
**karthiks360.com**, and smoke-tests the live site.

Full details, repository settings and routing notes are in
[DEPLOYMENT.md](./DEPLOYMENT.md).
