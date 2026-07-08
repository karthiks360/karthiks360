'use client';

import { useEffect, useRef } from 'react';

/**
 * Custom cursor: a precise dot that tracks the pointer exactly, plus a larger
 * ring that trails with easing and expands (turning purple) when hovering
 * interactive elements. Active only on fine-pointer, non-reduced-motion devices;
 * otherwise the native cursor is left untouched.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add('custom-cursor-active');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    // Ring eases toward the pointer each frame for a trailing feel.
    const loop = () => {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    const interactive = 'a, button, [role="button"], input, textarea, select, label, summary';
    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(interactive)) {
        ring.classList.add('cursor-ring--hover');
        dot.classList.add('cursor-dot--hover');
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(interactive)) {
        ring.classList.remove('cursor-ring--hover');
        dot.classList.remove('cursor-dot--hover');
      }
    };
    // Hide the custom cursor when the pointer leaves the window.
    const onLeave = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };
    const onEnter = () => {
      dot.style.opacity = '';
      ring.style.opacity = '';
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    raf = requestAnimationFrame(loop);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} aria-hidden="true" className="cursor-ring">
        <span className="cursor-ring__shape" />
      </div>
      <div ref={dotRef} aria-hidden="true" className="cursor-dot">
        <span className="cursor-dot__shape" />
      </div>
    </>
  );
}
