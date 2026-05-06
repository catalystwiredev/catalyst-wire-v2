"use client";
import { useEffect, useRef } from "react";

/**
 * Renders a fixed full-screen canvas that paints a living ombre gradient.
 * The gradient slowly drifts, and its hue subtly shifts as the user scrolls —
 * creating a persistent, interactive ambient background across the whole site.
 */
export function ScrollBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const scrollRef = useRef(0);
  const timeRef   = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    function onScroll() {
      scrollRef.current = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    function draw(ts: number) {
      if (!canvas || !ctx) return;
      const t    = ts * 0.0003;
      const s    = scrollRef.current;
      timeRef.current = t;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // -- Orb 1: blue/cyan top-left, drifts slowly
      const x1 = w * (0.05 + 0.08 * Math.sin(t * 0.7));
      const y1 = h * (0.02 + 0.06 * Math.cos(t * 0.5));
      const r1 = w * (0.55 + 0.05 * Math.sin(t * 0.3));
      const g1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, r1);
      g1.addColorStop(0,   `rgba(0,144,240,${0.07 + s * 0.03})`);
      g1.addColorStop(0.5, `rgba(0,80,200,${0.03 + s * 0.01})`);
      g1.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      // -- Orb 2: green bottom-right, counter-drifts
      const x2 = w * (0.85 + 0.07 * Math.cos(t * 0.6));
      const y2 = h * (0.80 + 0.07 * Math.sin(t * 0.4));
      const r2 = w * (0.45 + 0.04 * Math.cos(t * 0.5));
      const g2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, r2);
      g2.addColorStop(0,   `rgba(0,200,110,${0.05 + s * 0.03})`);
      g2.addColorStop(0.5, `rgba(0,150,80,${0.02})`);
      g2.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // -- Orb 3: purple center, pulses
      const x3 = w * (0.45 + 0.06 * Math.sin(t * 0.4 + 1));
      const y3 = h * (0.45 + 0.06 * Math.cos(t * 0.35));
      const r3 = w * (0.35 + 0.06 * Math.sin(t * 0.25));
      const g3 = ctx.createRadialGradient(x3, y3, 0, x3, y3, r3);
      g3.addColorStop(0,   `rgba(100,60,220,${0.04 + s * 0.02})`);
      g3.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, w, h);

      // -- Scroll-reactive orb: intensifies as user scrolls down
      if (s > 0.05) {
        const x4 = w * (0.5 + 0.1 * Math.sin(t * 0.8 + 2));
        const y4 = h * (0.7 + s * 0.2);
        const r4 = w * (0.3 * s);
        const g4 = ctx.createRadialGradient(x4, y4, 0, x4, y4, r4);
        g4.addColorStop(0,   `rgba(236,72,153,${0.04 * s})`);
        g4.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.fillStyle = g4;
        ctx.fillRect(0, 0, w, h);
      }

      frameRef.current = requestAnimationFrame(draw);
    }

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 1,
      }}
      aria-hidden="true"
    />
  );
}
