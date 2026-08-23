import Link from "next/link";
import { Locale, locales } from "@/lib/analects";

const shortLabels: Record<Locale, string> = {
  "zh-Hans": "中文",
  en: "EN",
};

export function LanguageSwitcher({
  locale,
  path = "",
}: {
  locale: Locale;
  path?: string;
}) {
  return (
    <div className="inline-flex shrink-0 border border-rule bg-surface p-1 text-sm font-ui">
      {(Object.keys(locales) as Locale[]).map((key) => (
        <Link
          key={key}
          href={`/${key}${path}`}
          className={`tap-target inline-flex items-center px-3 transition-colors duration-300 ${
            key === locale
              ? "bg-surface-sunken text-ink"
              : "text-ink-soft hover:bg-surface-sunken hover:text-ink"
          }`}
        >
          <span className="sm:hidden">{shortLabels[key]}</span>
          <span className="hidden sm:inline">{locales[key].label}</span>
        </Link>
      ))}
    </div>
  );
}
