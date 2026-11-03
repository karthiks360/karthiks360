import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const siteUrl = 'https://karthiks360.com';

// `/pay` is intentionally absent: it is noindex and reached by direct link.
export default function sitemap(): MetadataRoute.Sitemap {
    return ['/', '/about/', '/skills/', '/experience/', '/blogs/', '/tools/'].map((path) => ({
        url: `${siteUrl}${path}`,
        changeFrequency: 'monthly',
        priority: path === '/' ? 1 : 0.7,
    }));
}
