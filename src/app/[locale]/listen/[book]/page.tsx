import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { books, getBook, locales, type Locale } from "@/lib/analects";
import { BookListenPage, listenMetadata } from "../BookListenPage";

export function generateStaticParams() {
  return (Object.keys(locales) as Locale[]).flatMap((locale) =>
    books.slice(1).map((book) => ({ locale, book: book.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; book: string }>;
}): Promise<Metadata> {
  const { locale, book: bookSlug } = await params;
  const book = getBook(bookSlug);
  if (!book) return {};
  if (book.slug === books[0].slug) return listenMetadata(locale, books[0]);
  return listenMetadata(locale, book);
}

export default async function ListenBookPage({
  params,
}: {
  params: Promise<{ locale: Locale; book: string }>;
}) {
  const { locale, book: bookSlug } = await params;
  const book = getBook(bookSlug);
  if (!book) notFound();
  if (book.slug === books[0].slug) redirect(`/${locale}/listen`);

  return <BookListenPage locale={locale} book={book} />;
}
