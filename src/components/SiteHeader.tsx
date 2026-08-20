import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Locale, t } from "@/lib/analects";
import { siteName } from "@/lib/site";

type NavItem = {
  href: string;
  labelZh: string;
  labelEn: string;
  exact?: boolean;
};

function isActive(path: string | undefined, href: string, exact = false) {
  if (!path) return false;
  if (exact) return path === href;
  return path === href || path.startsWith(`${href}/`);
}

export function SiteHeader({ locale, path = "" }: { locale: Locale; path?: string }) {
  const navItems: NavItem[] = [
    { href: `/${locale}`, labelZh: "首页", labelEn: "Home", exact: true },
    { href: `/${locale}/analects`, labelZh: "二十篇", labelEn: "Analects" },
    { href: `/${locale}/listen`, labelZh: "听读", labelEn: "Listen" },
    { href: `/${locale}/index`, labelZh: "索引", labelEn: "Index" },
    { href: `/${locale}/blogs`, labelZh: "札记", labelEn: "Notes" },
    { href: `/${locale}/about`, labelZh: "关于", labelEn: "About" },
  ];

  return (
    <header className="border-b border-rule bg-paper/95 backdrop-blur">
      <div className="page-shell flex flex-col gap-4 py-4 sm:py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href={`/${locale}`} className="group inline-flex items-center gap-3">
            <Image
              src="/logo-seal-solid.svg"
              alt=""
              width={32}
              height={32}
              priority
              className="shrink-0"
            />
            <div className="min-w-0">
              <div className="font-cjk text-lg leading-none text-ink">{siteName}</div>
              <div className="mt-1 font-ui text-xs text-ink-soft">
                {t(locale, "《论语》句子级阅读与听读", "Passage-by-passage reading and listening")}
              </div>
            </div>
          </Link>

          <LanguageSwitcher locale={locale} path={path} />
        </div>

        <nav aria-label={t(locale, "主导航", "Primary navigation")}>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 font-ui text-sm text-ink-soft">
            {navItems.map((item) => {
              const active = isActive(path, item.href, item.exact);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-9 items-center border-b px-0.5 transition-colors duration-300 ${
                      active
                        ? "border-ink text-ink"
                        : "border-transparent hover:border-ink hover:text-ink"
                    }`}
                  >
                    {t(locale, item.labelZh, item.labelEn)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

