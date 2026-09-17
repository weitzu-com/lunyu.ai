import type { EditorialPost } from "@/lib/editorial-posts";
import { b64 as a } from "./analects-twelve-chapters.b64a";
import { b64 as b } from "./analects-twelve-chapters.b64b";
import { b64 as c } from "./analects-twelve-chapters.b64c";
import { b64 as d } from "./analects-twelve-chapters.b64d";
import { b64 as e } from "./analects-twelve-chapters.b64e";
import { b64 as f } from "./analects-twelve-chapters.b64f";

export const post: EditorialPost = JSON.parse(
  Buffer.from(a + b + c + d + e + f, "base64").toString("utf8")
);
