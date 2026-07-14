'use client';

import { usePathname } from 'next/navigation';

/**
 * The <main> wrapper. Adds top padding to clear the fixed site nav on every
 * page except the Tools page, where the nav is hidden and Tools renders its
 * own top bar instead.
 */
export function PageMain({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hideNav = pathname?.startsWith('/tools');
    return <main className={`flex-1 ${hideNav ? '' : 'pt-16'}`}>{children}</main>;
}
