import type { Metadata } from 'next';
import { Tools } from '@/components/Tools';

export const metadata: Metadata = {
  title: 'Tools',
  description:
    'A suite of small developer utilities by Karthik S — JSON/YAML/CSV converters, JWT decoder, hash & Base64 tools, regex tester, CIDR calculator, cron helper, QR & UUID generators, and more. Everything runs in your browser.',
};

// Note: this page is intentionally NOT wrapped in <Reveal>. Reveal keeps its
// children at opacity-0 until an IntersectionObserver reports ~12% visibility;
// this page is far taller than the viewport, so that ratio is never reached and
// the content would stay invisible.
export default function ToolsPage() {
  return <Tools />;
}
