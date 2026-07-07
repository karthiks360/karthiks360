"use client";

import { useEffect, useRef } from 'react';

export function MouseGlowEffect() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect users who prefer reduced motion — skip the effect entirely.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let frame = 0;
    let nextX = 0;
    let nextY = 0;

    const render = () => {
      frame = 0;
      const el = glowRef.current;
      if (el) {
        el.style.background = `radial-gradient(600px circle at ${nextX}px ${nextY}px, rgba(59, 130, 246, 0.4), transparent 60%)`;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      nextX = e.clientX;
      nextY = e.clientY;
      // Coalesce rapid mousemove events into one paint per frame.
      if (!frame) {
        frame = requestAnimationFrame(render);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-200"
    />
  );
}
