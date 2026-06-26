"use client";

import { useEffect, useRef } from "react";

// ── Vertex shader: full-screen quad ──────────────────────────────────────
const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// ── Fragment shader: domain-warped fBm noise ─────────────────────────────
// 2-octave fBm × 3 evaluations = 6 noise samples total — fast on mobile GPU.
// Produces flowing green light wisps. Cursor brightens nearby area.
const FRAG = `
precision mediump float;

uniform vec2  u_res;   /* canvas size in px */
uniform float u_time;  /* seconds since start */
uniform vec2  u_mouse; /* canvas px; (-1,-1) = no cursor */

/* Gradient noise hash */
vec2 h2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453) * 2.0 - 1.0;
}

/* Smooth gradient noise */
float gn(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(h2(i),             f            ),
        dot(h2(i + vec2(1,0)), f - vec2(1,0)), u.x),
    mix(dot(h2(i + vec2(0,1)), f - vec2(0,1)),
        dot(h2(i + vec2(1,1)), f - vec2(1,1)), u.x),
    u.y
  );
}

/* 2-octave fBm — enough detail, faster than 3-4 */
float fbm(vec2 p) {
  return gn(p) * 0.5
       + gn(p * 2.1 + vec2(5.2, 1.3)) * 0.25;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  /* aspect-correct space */
  vec2 st = vec2(uv.x * u_res.x / u_res.y, uv.y) * 2.6;

  float t = u_time * 0.05;

  /* Domain warp: shift st by two fbm calls for organic shape */
  vec2 q = vec2(
    fbm(st + t),
    fbm(st + vec2(3.7, 5.1) + t * 0.75)
  );

  /* Final noise sample at warped position */
  float n = fbm(st + q * 1.4 + t * 0.3);

  /* Map to a soft intensity — keep it subtle so content is readable */
  float v = smoothstep(0.02, 0.62, n + 0.25) * 0.12;

  /* Cursor glow: brighten noise near pointer */
  if (u_mouse.x > 0.0) {
    vec2 m = u_mouse / u_res;
    m.y = 1.0 - m.y;                        /* flip Y: WebGL is bottom-up */
    float d = distance(uv, m);
    v += smoothstep(0.26, 0.0, d) * 0.065;  /* soft radial add */
  }

  /* Slight teal shift on brighter areas for depth */
  vec3 col = mix(
    vec3(0.29, 0.87, 0.50),   /* #4ade80 — accent green */
    vec3(0.18, 0.78, 0.65),   /* teal shift */
    clamp(n * 0.5 + 0.5, 0.0, 1.0)
  );

  gl_FragColor = vec4(col * v, v);
}
`;

// ── WebGL helpers ─────────────────────────────────────────────────────────
function makeShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src.trim());
  gl.compileShader(s);
  return s;
}

export function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasCursor = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      powerPreference: "low-power", // battery-friendly on mobile/laptop
    });
    if (!gl) return;

    // Compile & link
    const prog = gl.createProgram()!;
    gl.attachShader(prog, makeShader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, makeShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Full-screen quad via TRIANGLE_STRIP
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const posLoc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes   = gl.getUniformLocation(prog, "u_res");
    const uTime  = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    // Lower DPR on mobile → fewer fragments → faster shader
    const dpr = hasCursor
      ? Math.min(window.devicePixelRatio, 2)
      : Math.min(window.devicePixelRatio, 1);

    let W = 0, H = 0, rafId = 0, start = 0;
    let cx = -1, cy = -1;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width  = W + "px";
      canvas.style.height = H + "px";
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    const frame = (ts: number) => {
      if (!start) start = ts;
      gl.uniform1f(uTime, (ts - start) / 1000);
      gl.uniform2f(uMouse, cx * dpr, cy * dpr);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(frame);
    };

    const onPointerMove = (e: PointerEvent) => { cx = e.clientX; cy = e.clientY; };
    const onPointerLeave = () => { cx = -1; cy = -1; };

    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    };

    resize();

    if (reduced) {
      // One static frame, no animation
      gl.uniform1f(uTime, 0);
      gl.uniform2f(uMouse, -1, -1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    } else {
      rafId = requestAnimationFrame(frame);
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
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
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
