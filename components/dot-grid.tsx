"use client";

import { useEffect, useRef } from "react";

const SPACING = 36;        // px between dot centres
const DOT_R = 1.3;         // base dot radius
const CURSOR_R = 170;      // px — influence zone
const MAX_SHIFT = 13;      // max displacement px
const BASE_ALPHA = 0.18;   // dim dot opacity
const BRIGHT_ALPHA = 0.65; // bright dot opacity near cursor

export function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasCursor = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let W = 0, H = 0, dpr = 1, cols = 0, rows = 0;
    let cx = -9999, cy = -9999;
    let rafId = 0;
    let dirty = true; // draw at least once

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(W / SPACING) + 1;
      rows = Math.ceil(H / SPACING) + 1;
      dirty = true;
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // ── Two groups: static dots (batch) + displaced near-cursor dots ──
      const nearDots: { x: number; y: number; alpha: number; r: number }[] = [];

      // Batch path for all static dots (ONE fill call)
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = c * SPACING;
          const by = r * SPACING;
          const dx = bx - cx;
          const dy = by - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CURSOR_R && dist > 0 && hasCursor) {
            // Collect for separate draw — skip in batch
            const force = (1 - dist / CURSOR_R) ** 2;
            nearDots.push({
              x: bx + (dx / dist) * force * MAX_SHIFT,
              y: by + (dy / dist) * force * MAX_SHIFT,
              alpha: BASE_ALPHA + force * (BRIGHT_ALPHA - BASE_ALPHA),
              r: DOT_R + force * 1,
            });
          } else {
            // Static dot → tiny rect added to batch path
            ctx.rect(bx - DOT_R, by - DOT_R, DOT_R * 2, DOT_R * 2);
          }
        }
      }
      // ONE fill call for all static dots
      ctx.fillStyle = `rgba(74,222,128,${BASE_ALPHA})`;
      ctx.fill();

      // ── Near-cursor dots: individual arc (only ~15-25 per frame) ──
      for (const d of nearDots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74,222,128,${d.alpha.toFixed(2)})`;
        ctx.fill();
      }
    };

    const tick = () => {
      if (dirty) {
        draw();
        // Keep drawing while cursor is in influence zone (for smooth movement)
        dirty = hasCursor && cx > -9000;
      }
      rafId = requestAnimationFrame(tick);
    };

    const onPointerMove = (e: PointerEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      dirty = true;
    };
    const onPointerLeave = () => {
      cx = -9999;
      cy = -9999;
      dirty = true;
    };

    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        resize();
      }, 150);
    };

    resize();

    if (reduced) {
      draw(); // static, no RAF
    } else {
      rafId = requestAnimationFrame(tick);
      if (hasCursor) {
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        window.addEventListener("pointerleave", onPointerLeave, { passive: true });
      }
      window.addEventListener("resize", onResize, { passive: true });
    }

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
