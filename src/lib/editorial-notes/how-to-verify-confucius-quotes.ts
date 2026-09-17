import type { EditorialPost } from "@/lib/editorial-posts";
import { b64 as a } from "./how-to-verify-confucius-quotes.b64a";
import { b64 as b } from "./how-to-verify-confucius-quotes.b64b";

export const post: EditorialPost = JSON.parse(
  Buffer.from(a + b, "base64").toString("utf8")
);
