import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { HomeHighlights } from '@/components/HomeHighlights';
import { Reveal } from '@/components/Reveal';

export const metadata: Metadata = {
    alternates: { canonical: '/' },
    openGraph: { url: '/' },
};

export default function HomePage() {
    return (
        <>
            <Hero />
            <Reveal><HomeHighlights /></Reveal>
        </>
    );
}
