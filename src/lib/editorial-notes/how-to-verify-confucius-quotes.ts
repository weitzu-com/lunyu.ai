import type { EditorialPost } from "@/lib/editorial-posts";
import { b64 as a } from "./how-to-verify-confucius-quotes.b64a";
import { b64 as b } from "./how-to-verify-confucius-quotes.b64b";
import { b64 as c } from "./how-to-verify-confucius-quotes.b64c";

export const post: EditorialPost = JSON.parse(
  Buffer.from(a + b + c, "base64").toString("utf8")
);
