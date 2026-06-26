"use client";

/**
 * Background: Aurora Blobs + Scanlines.
 * - 3 large blurred blobs animate via CSS transform only (GPU compositor thread)
 * - Scanlines overlay: repeating-linear-gradient, zero JS
 * - CursorGlow sits on top and reinforces the cursor highlight
 */
export function DotGrid() {
  return (
    <>
      {/* ── Aurora blobs ── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
        {/* Blob 1 — top-left, large, primary green */}
        <div className="aurora-blob aurora-blob-1" />
        {/* Blob 2 — bottom-right, secondary teal-green */}
        <div className="aurora-blob aurora-blob-2" />
        {/* Blob 3 — centre-top, dim accent */}
        <div className="aurora-blob aurora-blob-3" />
      </div>

      {/* ── Scanlines overlay ── */}
      <div aria-hidden className="scanlines pointer-events-none fixed inset-0 -z-10" />
    </>
  );
}
