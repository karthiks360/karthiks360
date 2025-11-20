import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Portfolio Website Home Page',
    description: 'A modern portfolio website showcasing projects and skills',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body suppressHydrationWarning>{children}</body>
        </html>
    );
}
