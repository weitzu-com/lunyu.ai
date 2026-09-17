import type { EditorialPost } from "@/lib/editorial-posts";
import { b64 as a } from "./how-to-verify-confucius-quotes.b64a";
import { b64 as b } from "./how-to-verify-confucius-quotes.b64b";
import { b64 as c } from "./how-to-verify-confucius-quotes.b64c";
import { b64 as d } from "./how-to-verify-confucius-quotes.b64d";
import { b64 as e } from "./how-to-verify-confucius-quotes.b64e";

export const post: EditorialPost = JSON.parse(
  Buffer.from(a + b + c + d + e, "base64").toString("utf8")
);
