'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Reveals its children with a subtle fade-and-rise once they scroll into view.
 * Honors `prefers-reduced-motion`: reduced-motion users see content immediately
 * with no transform, matching the site-wide motion policy in globals.css.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Nothing to animate (reduced motion, no element, or no IO support):
    // show immediately. This synchronous set mirrors the mount pattern in
    // ThemeToggle and is intentional.
    if (!el || reducedMotion || typeof IntersectionObserver === 'undefined') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className ?? ''}`}
    >
      {children}
    </div>
  );
}
