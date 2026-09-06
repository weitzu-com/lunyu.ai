"use client";

import { useEffect, useRef, useState } from "react";

export type BiographySection = { id: string; label: string };

export function BiographyNavigation({ name, sections }: { name: string; sections: BiographySection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const navigation = useRef<HTMLElement>(null);

  useEffect(() => {
    const elements = sections.map((section) => document.getElementById(section.id)).filter((element): element is HTMLElement => Boolean(element));
    let frame = 0;
    const update = () => {
      frame = 0;
      const navigationHeight = navigation.current?.getBoundingClientRect().height ?? 64;
      let current = elements[0]?.id ?? "";
      for (const element of elements) {
        const anchorMargin = Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
        if (element.getBoundingClientRect().top <= Math.max(navigationHeight, anchorMargin) + 2) current = element.id;
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
    };
  }, [sections]);

  return (
    <nav ref={navigation} className="people-section-nav" aria-label={`${name} · 本页目录`}>
      <span className="people-section-nav-name" aria-hidden="true">{name}</span>
      <div className="people-section-nav-links">
        {sections.map((section) => <a key={section.id} href={`#${section.id}`} aria-current={active === section.id ? "location" : undefined}>{section.label}</a>)}
      </div>
      <a className="people-section-nav-top" href="#main" aria-label="返回页面顶部">↑</a>
    </nav>
  );
}
