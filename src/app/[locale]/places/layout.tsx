import type { ReactNode } from "react";
import { GeographyMotion } from "@/components/geography/GeographyMotion";

export default function GeographyLayout({ children }: { children: ReactNode }) {
  return <GeographyMotion>{children}</GeographyMotion>;
}
