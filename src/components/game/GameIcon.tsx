import type { CSSProperties } from "react";

export function GameIcon({ name, size = 20, style }: { name: string; size?: number; style?: CSSProperties }) {
  const paths: Record<string, React.ReactNode> = {
    arrow: <><path d="M4 12h15M13 5l7 7-7 7" /></>,
    back: <path d="m13 5-7 7 7 7M6 12h15" />,
    book: <><path d="M12 5c-3-2-7-2-10-1v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Z" /><path d="M12 5v15" /></>,
    mountain: <><path d="m2 19 7-13 4 7 3-5 6 11Z" /><path d="m6 12 3 1 2-3" /></>,
    people: <><circle cx="9" cy="7" r="3" /><path d="M2 21v-3a7 7 0 0 1 14 0v3M16 4a3 3 0 0 1 0 6M19 13a6 6 0 0 1 3 5v3" /></>,
    compass: <><circle cx="12" cy="12" r="9" /><path d="m16 8-3 5-5 3 3-5Z" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V6a4 4 0 0 1 8 0v4" /></>,
    leaf: <><path d="M20 3C9 2 3 7 4 14c1 6 10 7 14 1 3-4 2-12 2-12Z" /><path d="M3 22 15 9" /></>,
    pin: <><path d="M19 9c0 6-7 12-7 12S5 15 5 9a7 7 0 0 1 14 0Z" /><circle cx="12" cy="9" r="2" /></>,
    time: <><circle cx="12" cy="12" r="9" /><path d="M12 6v6l4 3" /></>,
    reset: <><path d="M3 10a9 9 0 1 1 2 9M3 4v6h6" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    spark: <path d="m12 2 2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6Z" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>{paths[name] ?? paths.book}</svg>;
}
