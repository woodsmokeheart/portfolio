import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { Tag } from "@/components/ui/tag";
import { SectionShell } from "./section-shell";

type Project = {
  path: string;
  additions: number;
  name: string;
  desc: string;
  tags: string[];
  url: string | null;
};

export function DevFilesSection() {
  const t = useTranslations("content.dev.files");
  const tField = useTranslations("sections.dev.files");
  const projects = t.raw("projects") as Project[];

  return (
    <SectionShell
      id="dev-files"
      field={tField("field")}
      title={tField("label")}
    >
      <ul className="flex flex-col gap-3">
        {projects.map((project, i) => {
          const Wrapper = project.url ? "a" : "div";
          const wrapperProps = project.url
            ? { href: project.url, target: "_blank", rel: "noopener noreferrer" }
            : {};

          return (
            <Reveal as="li" key={project.path} delay={i * 0.07}>
              <Wrapper
                {...wrapperProps}
                className={[
                  "group flex flex-col gap-3 rounded-md border border-stroke bg-bg p-4 transition-colors",
                  project.url ? "cursor-pointer hover:border-accent" : "",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate font-mono text-xs text-text-quaternary">
                    {project.path}
                  </span>
                  <span className="shrink-0 font-mono text-xs font-medium text-accent">
                    +{project.additions.toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-semibold text-text-primary">
                    {project.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {project.desc}
                  </p>
                </div>

                <ul className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li key={tag}>
                      <Tag>{tag}</Tag>
                    </li>
                  ))}
                </ul>
              </Wrapper>
            </Reveal>
          );
        })}
      </ul>
    </SectionShell>
  );
}
