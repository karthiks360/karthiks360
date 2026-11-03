"use client";

import { useEffect, useRef } from 'react';

interface BackgroundParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

// Cap the loop well below the display rate: the drift is slow, so 30fps looks
// identical and halves the CPU/battery cost on long sessions.
const FRAME_INTERVAL_MS = 1000 / 30;

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<BackgroundParticle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Respect users who prefer reduced motion — render nothing and skip the loop.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Logical (CSS pixel) size; the backing store is scaled by DPR so
    // particles stay crisp on HiDPI screens.
    let width = 0;
    let height = 0;

    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.floor((width * height) / 15000);

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
        });
      }
    };

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const prevWidth = width;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Mobile browsers fire resize when the address bar collapses (height
      // only); don't re-randomise the field for that, just let it wrap.
      if (width !== prevWidth || particlesRef.current.length === 0) initParticles();
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    let lastFrame = 0;

    // Animation loop
    const animate = (now: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);
      if (now - lastFrame < FRAME_INTERVAL_MS) return;
      lastFrame = now;

      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.fill();
      });
    };

    const start = () => {
      if (animationFrameRef.current === undefined) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    const stop = () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    };

    // Pause while the tab is hidden — nothing to show, no reason to burn CPU.
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);
    onVisibility();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      document.removeEventListener('visibilitychange', onVisibility);
      stop();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
