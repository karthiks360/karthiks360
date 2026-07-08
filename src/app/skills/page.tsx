import type { Metadata } from 'next';
import { TechStack } from '@/components/TechStack';
import { Reveal } from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Skills',
  description:
    'The tech stack and tools Karthik S works with daily — Python, Node.js, Next.js, AWS, Docker, Linux, and more.',
};

export default function SkillsPage() {
  return (
    <Reveal>
      <TechStack />
    </Reveal>
  );
}
