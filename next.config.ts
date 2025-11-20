import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    output: 'export',
    // Uncomment the lines below if deploying to username.github.io/repo-name
    // basePath: '/karnext',
    // assetPrefix: '/karnext',
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
