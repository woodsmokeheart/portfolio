import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { SkillBar } from "@/components/ui/skill-bar";
import { Tag } from "@/components/ui/tag";
import { SectionShell } from "./section-shell";

type SkillGroup = {
  title: string;
  skills: { label: string; level: number }[];
};

/**
 * Environment section — the "stack" a QA Lead operates in. Two skill groups
 * (Testing / Platform) render animated <SkillBar> rows that fill on view, and a
 * wrapped row of <Tag> pills lists the day-to-day tools.
 *
 * Groups, skills, levels, and tools all live in `content.environment` so they
 * stay editable. Group titles and headings are localized; skill/tool proper
 * nouns are kept as-is. The in-view stagger is handled by the client <Reveal>
 * and <SkillBar> primitives (both reduced-motion safe), so this stays a server
 * component. Groups stack on mobile and sit side-by-side at `lg`.
 */
export function EnvironmentSection() {
  const t = useTranslations("content.environment");
  const tField = useTranslations("sections.environment");
  const groups = t.raw("groups") as SkillGroup[];
  const tools = t.raw("tools") as string[];

  return (
    <SectionShell
      id="environment"
      field={tField("field")}
      title={tField("label")}
    >
      <div className="flex flex-col gap-8">
        <div className="grid gap-x-10 gap-y-8 lg:grid-cols-2">
          {groups.map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                {group.skills.map((skill, i) => (
                  <Reveal key={skill.label} delay={i * 0.06}>
                    <SkillBar label={skill.label} level={skill.level} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-mono text-xs uppercase tracking-wider text-text-quaternary">
            {t("toolsHeading")}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {tools.map((tool, i) => (
              <Reveal as="li" key={tool} delay={i * 0.04}>
                <Tag>{tool}</Tag>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}
