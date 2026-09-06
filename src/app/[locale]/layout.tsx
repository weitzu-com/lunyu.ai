import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Locale, locales } from "@/lib/analects";
import { siteName, siteUrl } from "@/lib/site";
import "../globals.css";

export function generateStaticParams() {
  return (Object.keys(locales) as Locale[]).map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s · ${siteName}`,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: "/favicon.ico",
  },
};

export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const meta = locales[locale as Locale];
  if (!meta) notFound();

  return (
    <html lang={meta.htmlLang}>
      <body className="min-h-screen bg-paper text-ink antialiased">{children}</body>
      {process.env.VERCEL_ENV === "production" && (
        <GoogleAnalytics gaId="G-7KQTRXVXF4" />
      )}
    </html>
  );
}
