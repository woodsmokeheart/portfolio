import { TicketMetaPanel } from "@/components/ticket-meta/ticket-meta-panel";

type Props = {
  children: React.ReactNode;
};

export default function PanelLayout({ children }: Props) {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-6 pt-6 pb-24 lg:grid lg:grid-cols-[260px_1fr] lg:gap-12 lg:px-8">
      <TicketMetaPanel />
      {children}
    </div>
  );
}
