import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    output: 'export',
    // Emit `route/index.html` instead of `route.html` so GitHub Pages serves
    // both `/tools` (301 → `/tools/`) and `/tools/` instead of 404ing the
    // trailing-slash form.
    trailingSlash: true,
    // Uncomment the lines below if deploying to username.github.io/repo-name
    // basePath: '/karnext',
    // assetPrefix: '/karnext',
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
