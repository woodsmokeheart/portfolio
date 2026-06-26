"use client";

import { useEffect, useRef } from "react";

const GRID_SPACING = 38; // px between dots
const DOT_RADIUS = 1.2; // base dot size
const MAX_SHIFT = 14; // max px a dot moves toward cursor
const CURSOR_RADIUS = 160; // px — influence zone
const WAVE_SPEED = 0.0006; // mobile wave frequency
const WAVE_AMP = 5; // mobile wave amplitude (px)

// Accent colour matching CSS var --accent (#4ade80)
const DOT_COLOR_BASE = "rgba(74,222,128,0.18)";
const DOT_COLOR_ACTIVE = "rgba(74,222,128,0.55)";

export function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasFineCursor = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    let rafId = 0;
    let resizeTimer = 0;

    // Cursor state (viewport coords)
    let cx = -9999;
    let cy = -9999;

    // Time for mobile wave
    let t = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.scale(dpr, dpr);
      cols = Math.ceil(width / GRID_SPACING) + 1;
      rows = Math.ceil(height / GRID_SPACING) + 1;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const baseX = c * GRID_SPACING;
          const baseY = r * GRID_SPACING;

          let dx = 0;
          let dy = 0;
          let brightness = 0; // 0..1 extra brightness near cursor

          if (reduced) {
            // Static dots only
          } else if (hasFineCursor) {
            // Magnetic repulsion from cursor
            const distX = baseX - cx;
            const distY = baseY - cy;
            const dist = Math.sqrt(distX * distX + distY * distY);
            if (dist < CURSOR_RADIUS && dist > 0) {
              const force = (1 - dist / CURSOR_RADIUS) ** 2;
              dx = (distX / dist) * force * MAX_SHIFT;
              dy = (distY / dist) * force * MAX_SHIFT;
              brightness = force;
            }
          } else {
            // Mobile: slow ripple wave
            const wave = Math.sin(t + c * 0.35 + r * 0.55);
            dx = wave * WAVE_AMP * 0.6;
            dy = wave * WAVE_AMP;
          }

          const x = baseX + dx;
          const y = baseY + dy;

          // Dot size scales slightly with brightness
          const radius = DOT_RADIUS + brightness * 0.8;

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);

          if (brightness > 0) {
            // Interpolate from base to active color
            const alpha = 0.18 + brightness * 0.37;
            ctx.fillStyle = `rgba(74,222,128,${alpha.toFixed(2)})`;
          } else {
            ctx.fillStyle = DOT_COLOR_BASE;
          }

          ctx.fill();
        }
      }
    };

    const tick = () => {
      if (!reduced && !hasFineCursor) t += WAVE_SPEED * 16;
      draw();
      rafId = requestAnimationFrame(tick);
    };

    const onPointerMove = (e: PointerEvent) => {
      cx = e.clientX;
      cy = e.clientY;
    };

    const onPointerLeave = () => {
      cx = -9999;
      cy = -9999;
    };

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        resize();
      }, 150);
    };

    resize();

    if (reduced) {
      // Draw once and stop
      draw();
    } else {
      rafId = requestAnimationFrame(tick);
    }

    if (hasFineCursor) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    }
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-20"
      style={{ display: "block" }}
    />
  );
}
