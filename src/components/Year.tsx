'use client';

/**
 * The current year, computed in the visitor's browser. The static export bakes
 * in the build year; `suppressHydrationWarning` lets the client replace it
 * without a mismatch error once a new year rolls over.
 */
export function Year() {
    return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
