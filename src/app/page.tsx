import { Hero } from '@/components/Hero';
import { HomeHighlights } from '@/components/HomeHighlights';
import { Reveal } from '@/components/Reveal';

export default function HomePage() {
    return (
        <>
            <Hero />
            <Reveal><HomeHighlights /></Reveal>
        </>
    );
}
