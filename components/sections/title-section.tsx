import Image from "next/image";
import { useTranslations } from "next-intl";
import { Counter } from "@/components/ui/counter";
import { Reveal } from "@/components/ui/reveal";
import { Tag } from "@/components/ui/tag";

const LABELS = ["qa-lead", "fullstack", "playwright", "grafana"];

const METRICS = [
  { key: "microservices", value: 21, suffix: "" },
  { key: "years", value: 6, suffix: "+" },
  { key: "teams", value: 14, suffix: "" },
] as const;

/**
 * Title section — the hero. Renders the ticket `Title` field with the name as
 * its value, a role headline, label tags, an animated metrics row, and a
 * framed photo styled as a ticket attachment preview. Server component that
 * renders the client primitives (Reveal, Counter) as children.
 */
export function TitleSection() {
  const t = useTranslations("content.title");
  const tField = useTranslations("sections.title");

  return (
    <section
      id="title"
      className="flex scroll-mt-24 flex-col gap-6 rounded-md border border-stroke bg-bg-elevated p-4 lg:scroll-mt-10 lg:p-6"
    >
      <Tag className="self-start uppercase tracking-wider text-text-quaternary">
        {tField("field")}
      </Tag>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <Reveal className="lg:order-2 lg:shrink-0" delay={0.1}>
          <figure className="w-full max-w-xs overflow-hidden rounded-md border border-stroke bg-bg lg:w-56">
            <div className="flex items-center justify-between border-b border-stroke px-3 py-1.5">
              <span className="font-mono text-xs text-text-secondary">
                denis.jpg
              </span>
              <span className="font-mono text-xs text-text-quaternary">
                1024×1365
              </span>
            </div>
            <Image
              src="/denis-photo.jpg"
              alt={t("name")}
              width={1024}
              height={1365}
              priority
              sizes="(min-width: 1024px) 224px, (min-width: 640px) 320px, 100vw"
              className="h-auto w-full"
            />
          </figure>
        </Reveal>

        <div className="flex flex-col gap-5 lg:order-1">
          <Reveal>
            <h1 className="text-3xl font-semibold tracking-tight text-text-primary lg:text-5xl">
              {t("name")}
            </h1>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="max-w-xl text-balance text-base text-text-secondary lg:text-lg">
              {t("headline")}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-2">
              {LABELS.map((label) => (
                <Tag key={label}>{label}</Tag>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <dl className="flex flex-wrap gap-x-8 gap-y-4 pt-1">
              {METRICS.map((metric) => (
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
