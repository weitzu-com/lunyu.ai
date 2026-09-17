import type { EditorialPost } from "@/lib/editorial-posts";
import { b64 as a } from "./analects-twelve-chapters.b64a";
import { b64 as b } from "./analects-twelve-chapters.b64b";
import { b64 as c } from "./analects-twelve-chapters.b64c";
import { b64 as d } from "./analects-twelve-chapters.b64d";
import { b64 as e } from "./analects-twelve-chapters.b64e";
import { b64 as f } from "./analects-twelve-chapters.b64f";
import { b64 as g } from "./analects-twelve-chapters.b64g";
import { b64 as h } from "./analects-twelve-chapters.b64h";
import { b64 as i } from "./analects-twelve-chapters.b64i";
import { b64 as j } from "./analects-twelve-chapters.b64j";
import { b64 as k } from "./analects-twelve-chapters.b64k";
import { b64 as l } from "./analects-twelve-chapters.b64l";

export const post: EditorialPost = JSON.parse(
  Buffer.from(a + b + c + d + e + f + g + h + i + j + k + l, "base64").toString("utf8")
);
