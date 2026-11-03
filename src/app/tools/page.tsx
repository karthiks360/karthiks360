import type { Metadata } from 'next';
import { Tools } from '@/components/Tools';

export const metadata: Metadata = {
  title: 'Tools',
  description:
    'A suite of small developer utilities by Karthik S — JSON/YAML/CSV converters, JWT decoder, hash & Base64 tools, regex tester, CIDR calculator, cron helper, QR & UUID generators, and more. Everything runs in your browser.',
  alternates: { canonical: '/tools/' },
  openGraph: { url: '/tools/' },
};

// Not wrapped in <Reveal>: the launcher is the whole page, so there is nothing
// to fade in, and the open-tool view swaps content on hash change.
export default function ToolsPage() {
  return <Tools />;
}
