#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "public", "logo-seal-solid.svg");
const target = path.join(root, "public", "favicon.svg");

try {
  await fs.access(source);
  await fs.copyFile(source, target);
  console.log("favicon.svg synced from logo-seal-solid.svg");
} catch (error) {
  if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
    console.warn("logo-seal-solid.svg not found; skipping favicon sync");
  } else {
    throw error;
  }
}
