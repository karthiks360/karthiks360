import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Page not found',
    robots: { index: false, follow: false },
};

export default function NotFound() {
    return (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center space-y-6">
            <p className="font-mono text-sm text-slate-500 dark:text-slate-400">404</p>
            <h1 className="text-slate-900 dark:text-white text-4xl sm:text-5xl font-bold">
                That page doesn&apos;t exist
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
                The link may be old or mistyped. Try one of these instead.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all"
                >
                    Home
                </Link>
                <Link
                    href="/tools/"
                    className="inline-flex items-center justify-center border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-3 px-6 rounded-xl hover:border-blue-500 transition-all"
                >
                    Tools
                </Link>
            </div>
        </section>
    );
}
