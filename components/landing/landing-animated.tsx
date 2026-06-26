"use client";

import { motion, useReducedMotion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { useState, useEffect } from "react";

type CardStatus = "open" | "review" | "active";

const STATUS_STYLES: Record<CardStatus, string> = {
  open: "text-accent border-accent/40",
  active: "text-accent border-accent/40",
  review: "text-amber-400 border-amber-400/40",
};

export type TicketCardData = {
  id: string;
  status: CardStatus;
  statusLabel: string;
  title: string;
  desc: string;
  tags: string[];
  cta: string;
  href?: string;
};

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-·";
const FRAMES = 28;
const FRAME_MS = 30;

function scrambleFrame(target: string, progress: number): string {
  const revealedCount = Math.floor(progress * target.length);
  return target
    .split("")
    .map((char, i) => {
      if (char === " ") return " ";
      if (i < revealedCount) return char;
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    })
    .join("");
}

function ScrambleName({ text, className }: { text: string; className?: string }) {
  const reduced = useReducedMotion();
  const [displayed, setDisplayed] = useState(reduced ? text : "");

  useEffect(() => {
    if (reduced) {
      setDisplayed(text);
      return;
    }

    setDisplayed("");

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const timeoutId = setTimeout(() => {
      let frame = 0;
      intervalId = setInterval(() => {
        frame++;
        setDisplayed(scrambleFrame(text, frame / FRAMES));
        if (frame >= FRAMES) {
          clearInterval(intervalId!);
          intervalId = null;
          setDisplayed(text);
        }
      }, FRAME_MS);
    }, 120);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId !== null) clearInterval(intervalId);
      // Always restore visible text if animation is interrupted
      setDisplayed(text);
    };
  }, [text, reduced]);

  return <span className={className}>{displayed || "\u00A0"}</span>;
}

function TicketCard({ id, status, statusLabel, title, desc, tags, cta, href }: TicketCardData) {
  const isDisabled = !href;

  const inner = (
    <div
      className={[
        "group flex h-full flex-col gap-5 rounded-md border p-6 transition-all duration-300",
        isDisabled
          ? "cursor-not-allowed border-stroke bg-bg-elevated/40 opacity-50"
          : "cursor-pointer border-stroke bg-bg-elevated hover:border-accent hover:shadow-[0_0_32px_rgba(74,222,128,0.15)]",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-semibold text-text-primary">{id}</span>
        <span className={["rounded-full border px-2.5 py-0.5 font-mono text-xs", STATUS_STYLES[status]].join(" ")}>
          {statusLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <h2 className={["text-xl font-semibold tracking-tight transition-colors",
          isDisabled ? "text-text-secondary" : "text-text-primary group-hover:text-accent"].join(" ")}>
          {title}
        </h2>
        <p className="text-sm leading-relaxed text-text-secondary">{desc}</p>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <li key={tag} className="rounded-md border border-stroke bg-bg px-2 py-0.5 font-mono text-xs text-text-quaternary">
            {tag}
          </li>
        ))}
      </ul>
      <span className={["mt-auto font-mono text-sm", isDisabled ? "text-text-quaternary" : "text-accent"].join(" ")}>
        {isDisabled ? cta : `→ ${cta}`}
      </span>
    </div>
  );

  if (href) {
    return <Link href={href} className="flex h-full flex-col">{inner}</Link>;
  }
  return <div className="flex h-full flex-col">{inner}</div>;
}

function Avatar() {
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative mx-auto mb-8 h-36 w-36">
      {/* aurora glow behind everything */}
      <div
        className="pointer-events-none absolute -inset-6 rounded-full blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(74,222,128,0.3) 0%, transparent 70%)" }}
        aria-hidden
      />

      {/* spinning conic ring — sits outside the photo bounds */}
      <motion.div
        className="absolute -inset-1 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0%, rgba(74,222,128,1) 20%, transparent 45%, rgba(74,222,128,0.5) 70%, transparent 100%)",
        }}
        animate={reduced ? undefined : { rotate: 360 }}
        initial={{ rotate: 0 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        aria-hidden
      />

      {/* dark gap between ring and photo */}
      <div className="absolute -inset-1 rounded-full" style={{ padding: "3px" }}>
        <div className="h-full w-full rounded-full bg-bg" />
      </div>

      {/* photo */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        {failed ? (
          <div className="flex h-full w-full items-center justify-center bg-bg-elevated font-mono text-xl font-semibold text-text-secondary">
            DK
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/denis-photo.jpg"
            alt="Denis Kukobin"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </div>
  );
}

type Props = {
  subtitle: string;
  cards: TicketCardData[];
};

export function LandingAnimated({ subtitle, cards }: Props) {
  const reduced = useReducedMotion();

  const fade = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay },
        };

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 pb-24 lg:px-10">
      <div className="w-full max-w-4xl">
        {/* heading */}
        <motion.div className="mb-10 flex flex-col gap-2 text-center" {...fade(0)}>
          <Avatar />
          <h1 className="gradient-text text-4xl font-semibold tracking-tight lg:text-5xl">
            <ScrambleName text="Denis Kukobin" />
          </h1>
          <p className="font-mono text-sm text-text-quaternary">{subtitle}</p>
        </motion.div>

        {/* cards — staggered */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div key={card.id} className="flex h-full flex-col" {...fade(0.15 + i * 0.1)}>
              <TicketCard {...card} />
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
