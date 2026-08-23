import type { Metadata } from "next";
import { books, locales, type Locale } from "@/lib/analects";
import { BookListenPage, listenMetadata } from "./BookListenPage";

export function generateStaticParams() {
  return (Object.keys(locales) as Locale[]).map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return listenMetadata(locale, books[0]);
}

export default async function ListenHome({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <BookListenPage locale={locale} book={books[0]} />;
}
