import { getTranslations } from "next-intl/server";
import { Send, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionShell } from "./section-shell";
import { CONTACTS, type ContactKey } from "@/lib/contacts";

const CONTACT_ICONS: Record<ContactKey, LucideIcon> = {
  telegram: Send,
  email: Mail,
};

export async function AttachmentsSection() {
  const t = await getTranslations("content.attachments");
  const tField = await getTranslations("sections.attachments");

  return (
    <SectionShell id="attachments" field={tField("field")} title={tField("label")}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <ul className="flex flex-col gap-2">
            {CONTACTS.map((contact) => {
              const Icon = CONTACT_ICONS[contact.key];
              const external = contact.href.startsWith("http");
              return (
                <li key={contact.key}>
                  <a
                    href={contact.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="group flex min-h-11 items-center gap-3 rounded-md border border-stroke bg-bg px-3 py-2 transition-colors hover:border-accent focus-visible:border-accent focus-visible:outline-none"
                  >
                    <Icon
                      className="size-4 shrink-0 text-text-tertiary transition-colors group-hover:text-accent"
                      aria-hidden
                    />
                    <span className="text-sm text-text-secondary">
                      {t(`contacts.${contact.key}`)}
                    </span>
                    <span className="ml-auto truncate font-mono text-xs text-text-quaternary transition-colors group-hover:text-text-tertiary">
                      {contact.handle}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}
