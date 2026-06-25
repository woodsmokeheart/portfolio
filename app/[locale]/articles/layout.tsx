import { setRequestLocale } from "next-intl/server";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Articles section layout — standalone, no ticket meta panel.
 * GlobalNav (floating pill) is already injected by the root locale layout.
 */
export default async function ArticlesLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 pt-8 pb-24">
      {children}
    </div>
  );
}
