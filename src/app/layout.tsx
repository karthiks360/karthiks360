import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const siteUrl = 'https://karthiks360.com';
const description =
  'Karthik S — Software Developer at SISA Information Security. Building innovative software, electronics, and automation projects.';

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
    'SISA Information Security',
    'Web Developer',
    'React',
    'Next.js',
    'Automation',
    'Electronics',
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
