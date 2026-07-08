import type { Metadata } from 'next';
import { Blogs } from '@/components/Blogs';
import { Reveal } from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Blogs',
  description:
    'Writing on backend development, cloud, DevOps, and building AI-driven security platforms — coming soon.',
};

export default function BlogsPage() {
  return (
    <Reveal>
      <Blogs />
    </Reveal>
  );
}
