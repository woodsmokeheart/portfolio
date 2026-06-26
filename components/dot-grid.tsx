"use client";

/**
 * Dot-grid background: two CSS layers, zero canvas, zero per-frame JS.
 * - Base layer: dim dots everywhere (GPU background-image, static)
 * - Highlight layer: bright dots masked to cursor position via CSS mask-image
 *   using the --glow-x / --glow-y custom properties already written by CursorGlow.
 * - Mobile (no fine pointer): base layer + subtle CSS drift animation only.
 */
export function DotGrid() {
  const base: React.CSSProperties = {
    backgroundImage:
      "radial-gradient(circle, rgba(74,222,128,0.15) 1.2px, transparent 1.2px)",
    backgroundSize: "38px 38px",
  };

  const highlight: React.CSSProperties = {
    backgroundImage:
      "radial-gradient(circle, rgba(74,222,128,0.65) 1.6px, transparent 1.6px)",
    backgroundSize: "38px 38px",
    // Off-screen by default (-9999px) so nothing shows until CursorGlow sets the vars
    maskImage:
      "radial-gradient(circle 200px at var(--glow-x, -9999px) var(--glow-y, -9999px), black 0%, transparent 100%)",
    WebkitMaskImage:
      "radial-gradient(circle 200px at var(--glow-x, -9999px) var(--glow-y, -9999px), black 0%, transparent 100%)",
  };

  return (
    <>
      {/* Base dim grid — always visible, mobile drift animation via CSS */}
      <div
        aria-hidden
        className="dot-grid-base pointer-events-none fixed inset-0 -z-20"
        style={base}
      />
      {/* Bright grid — visible only near cursor via mask */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20"
        style={highlight}
      />
    </>
  );
}
