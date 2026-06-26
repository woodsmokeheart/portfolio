import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { SkillBar } from "@/components/ui/skill-bar";
import { Tag } from "@/components/ui/tag";
import { SectionShell } from "./section-shell";

type SkillGroup = {
  title: string;
  skills: { label: string; level: number }[];
};

export function DevDiffSection() {
  const t = useTranslations("content.dev.diff");
  const tField = useTranslations("sections.dev.diff");
  const groups = t.raw("groups") as SkillGroup[];
  const tools = t.raw("tools") as string[];

  return (
    <SectionShell
      id="dev-diff"
      field={tField("field")}
      title={tField("label")}
    >
      <div className="flex flex-col gap-8">
        <div className="grid gap-x-10 gap-y-8 lg:grid-cols-2">
          {groups.map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-text-tertiary">
                {group.title}
              </h3>
              <div className="flex flex-col gap-4">
                {group.skills.map((skill, i) => (
                  <Reveal key={skill.label} delay={i * 0.06}>
                    <div className="flex items-center gap-2">
                      <span
                        className="select-none font-mono text-xs font-medium text-accent"
                        aria-hidden="true"
                      >
                        +
                      </span>
                      <SkillBar
                        label={skill.label}
                        level={skill.level}
                        className="flex-1"
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>

        <ul className="flex flex-wrap gap-2">
          {tools.map((tool, i) => (
            <Reveal as="li" key={tool} delay={i * 0.04}>
              <Tag>{tool}</Tag>
            </Reveal>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}
