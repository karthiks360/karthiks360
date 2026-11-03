import type { Metadata } from 'next';
import { Experience } from '@/components/Experience';
import { Reveal } from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Experience',
  description:
    '4+ years of experience across enterprise security, automotive ADAS, and production software teams.',
  alternates: { canonical: '/experience/' },
  openGraph: { url: '/experience/' },
};

export default function ExperiencePage() {
  return (
    <Reveal>
      <Experience />
    </Reveal>
  );
}
