import type { EditorialPost } from "@/lib/editorial-posts";
import { b64 as a } from "./analects-twelve-chapters.b64a";
import { b64 as b } from "./analects-twelve-chapters.b64b";
import { b64 as c } from "./analects-twelve-chapters.b64c";

export const post: EditorialPost = JSON.parse(
  Buffer.from(a + b + c, "base64").toString("utf8")
);
