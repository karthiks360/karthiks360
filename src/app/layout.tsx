import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navigation } from '@/components/Navigation';
import { PageMain } from '@/components/PageMain';
import { Footer } from '@/components/Footer';
import { ParticleBackground } from '@/components/ParticleBackground';

const siteUrl = 'https://karthiks360.com';
const description =
  'Karthik S — Software Developer with 4+ years in backend development, REST APIs, cloud (AWS), and DevOps automation. Currently building AI-driven enterprise security platforms at SISA.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Karthik S — Software Developer',
    template: '%s | Karthik S',
  },
  description,
  keywords: [
    'Karthik S',
    'Software Developer',
    'Backend Developer',
    'SISA',
    'REST API',
    'Python',
    'Node.js',
    'Next.js',
    'AWS',
    'Docker',
    'DevOps',
    'Cloud',
    'Portfolio',
  ],
  authors: [{ name: 'Karthik S', url: siteUrl }],
  creator: 'Karthik S',
  // No `alternates.canonical` / `openGraph.url` here on purpose: anything set
  // on the root layout is inherited by every route, which made each subpage
  // declare itself a duplicate of the homepage. Each page sets its own.
  openGraph: {
    type: 'website',
    siteName: 'Karthik S',
    title: 'Karthik S — Software Developer',
    description,
    locale: 'en_US',
    // A static PNG with an extension so GitHub Pages serves it as image/png.
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Karthik S — Software Developer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Karthik S — Software Developer',
    description,
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30 relative overflow-hidden">
            <ParticleBackground />
            <div className="relative z-10 flex min-h-screen flex-col">
              <Navigation />
              <PageMain>{children}</PageMain>
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
