import type { EditorialPost } from "@/lib/editorial-posts";
import { p as a } from "./duke-ling-of-wei-in-the-analects.pa";
import { p as b } from "./duke-ling-of-wei-in-the-analects.pb";
import { p as c } from "./duke-ling-of-wei-in-the-analects.pc";
import { p as d } from "./duke-ling-of-wei-in-the-analects.pd";
import { p as e } from "./duke-ling-of-wei-in-the-analects.pe";
import { p as f } from "./duke-ling-of-wei-in-the-analects.pf";
import { p as g } from "./duke-ling-of-wei-in-the-analects.pg";

export const post: EditorialPost = JSON.parse(
  Buffer.from(a + b + c + d + e + f + g, "base64").toString("utf8")
) as EditorialPost;
