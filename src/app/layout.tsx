import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ParticleBackground } from '@/components/ParticleBackground';
import { CustomCursor } from '@/components/CustomCursor';

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
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Karthik S',
    title: 'Karthik S — Software Developer',
    description,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Karthik S — Software Developer',
    description,
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
            <CustomCursor />
            <div className="relative z-10 flex min-h-screen flex-col">
              <Navigation />
              <main className="flex-1 pt-16">{children}</main>
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
