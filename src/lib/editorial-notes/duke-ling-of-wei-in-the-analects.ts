import type { EditorialPost } from "@/lib/editorial-posts";
import { s as a } from "./duke-ling-of-wei-in-the-analects.sa";
import { s as b } from "./duke-ling-of-wei-in-the-analects.sb";
import { s as c } from "./duke-ling-of-wei-in-the-analects.sc";
import { s as d } from "./duke-ling-of-wei-in-the-analects.sd";
import { s as e } from "./duke-ling-of-wei-in-the-analects.se";
import { s as f } from "./duke-ling-of-wei-in-the-analects.sf";
import { s as g } from "./duke-ling-of-wei-in-the-analects.sg";
import { s as h } from "./duke-ling-of-wei-in-the-analects.sh";

export const post: EditorialPost = JSON.parse(a + b + c + d + e + f + g + h) as EditorialPost;
