import type { Metadata } from 'next';
import { About } from '@/components/About';
import { Reveal } from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Karthik S — a software developer focused on backend development, cloud deployment, and infrastructure automation.',
};

export default function AboutPage() {
  return (
    <Reveal>
      <About />
    </Reveal>
  );
}
