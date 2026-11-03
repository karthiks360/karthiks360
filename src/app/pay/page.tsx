import type { Metadata } from 'next';
import { PayForm } from '@/components/PayForm';

// Server wrapper so this route can carry its own metadata: the page is meant
// to be reached by direct link only, so it is kept out of search indexes.
export const metadata: Metadata = {
    title: 'Pay',
    description: 'Personal UPI payment page for people Karthik S has invoiced.',
    robots: { index: false, follow: false },
    alternates: { canonical: '/pay/' },
    openGraph: { url: '/pay/' },
};

export default function PayPage() {
    return <PayForm />;
}
