import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Karthik S',
    description: 'Karthik S',
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
