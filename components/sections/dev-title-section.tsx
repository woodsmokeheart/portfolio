import Image from "next/image";
import { useTranslations } from "next-intl";
import { Counter } from "@/components/ui/counter";
import { Reveal } from "@/components/ui/reveal";
import { Tag } from "@/components/ui/tag";
import { ScrambleTag } from "@/components/ui/scramble-tag";

const DEV_LABELS = ["next.js", "typescript", "playwright", "go"] as const;

const DEV_METRICS = [
  { key: "projects", value: 8, suffix: "" },
  { key: "years", value: 6, suffix: "+" },
  { key: "technologies", value: 15, suffix: "+" },
] as const;

export function DevTitleSection() {
  const t = useTranslations("content.dev.title");
  const tField = useTranslations("sections.dev.title");

  return (
    <section
      id="dev-title"
      className="flex scroll-mt-24 flex-col gap-6 rounded-md border border-stroke bg-bg-elevated p-4 lg:scroll-mt-10 lg:p-6"
    >
      <ScrambleTag className="self-start uppercase tracking-wider text-text-quaternary">
        {tField("field")}
      </ScrambleTag>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <div className="relative lg:order-2 lg:shrink-0">
          <div
            className="aurora-glow pointer-events-none absolute -inset-6 rounded-full bg-accent/15 blur-3xl"
            aria-hidden="true"
          />
          <Reveal delay={0.1}>
            <figure className="relative w-full max-w-xs overflow-hidden rounded-md border border-stroke bg-bg lg:w-56">
              <div className="flex items-center justify-between border-b border-stroke px-3 py-1.5">
                <span className="font-mono text-xs text-text-secondary">denis-dev.jpg</span>
                <span className="font-mono text-xs text-text-quaternary">771×1028</span>
              </div>
              <Image
                src="/denis-dev.jpg"
                alt="Denis Kukobin"
                width={771}
                height={1028}
                priority
                sizes="(min-width: 1024px) 224px, (min-width: 640px) 320px, 100vw"
                className="h-auto w-full"
              />
            </figure>
          </Reveal>
        </div>

        <div className="flex flex-col gap-5 lg:order-1">
          <Reveal>
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-2 font-mono text-sm font-medium text-accent">
                <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                {t("badge")}
              </span>
              <h1 className="gradient-text text-3xl font-semibold tracking-tight lg:text-5xl">
                {t("prTitle")}
              </h1>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="max-w-xl text-balance text-base text-text-secondary lg:text-lg">
              {t("headline")}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-2">
              {DEV_LABELS.map((label) => (
                <Tag key={label}>{label}</Tag>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <dl className="flex flex-wrap gap-x-8 gap-y-4 pt-1">
              {DEV_METRICS.map((metric) => (
                <div key={metric.key} className="flex flex-col gap-0.5">
                  <dt className="order-2 font-mono text-xs uppercase tracking-wider text-text-tertiary">
                    {t(`metrics.${metric.key}`)}
                  </dt>
                  <dd className="order-1 text-3xl font-semibold tabular-nums text-accent lg:text-4xl">
                    <Counter value={metric.value} suffix={metric.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
