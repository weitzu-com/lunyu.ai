import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const compile = (file) => ts.transpileModule(fs.readFileSync(path.join(root, file), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const data = { exports: {} };
vm.runInNewContext(compile("src/data/confucius-game.ts"), data);
const { gameChapters } = data.exports;
const scenes = gameChapters.flatMap((chapter) => chapter.scenes);
const source = compile("src/lib/game-reading-position.ts");
const storageKey = "lunyu-game-reading-position-v1";
const plain = (value) => JSON.parse(JSON.stringify(value));
const progress = (count = 0) => ({ version: 1, answers: Object.fromEntries(scenes.slice(0, count).map((scene, index) => [scene.id, scene.choices[index % scene.choices.length].id])), reflections: {}, lastChapter: 0 });
const position = (chapterIndex = 0, sceneIndex = 0, summary = false) => ({ chapterIndex, sceneIndex, summary });

function setup({ items = new Map(), ssr = false } = {}) {
  let failure = null;
  const exports = {};
  const context = { exports, require(name) { assert.equal(name, "@/data/confucius-game"); return data.exports; } };
  if (!ssr) context.window = { sessionStorage: {
    getItem(key) { if (failure === "get") throw new Error("Storage denied"); return items.get(key) ?? null; },
    setItem(key, value) { if (failure === "set") throw new Error("Storage quota exceeded"); items.set(key, value); },
    removeItem(key) { if (failure === "remove") throw new Error("Storage denied"); items.delete(key); },
  } };
  vm.runInNewContext(source, context);
  return { ...exports, items, fail(operation) { failure = operation; } };
}

const checks = [];
function check(name, action) {
  try { action(); checks.push(true); console.log(`PASS ${name}`); }
  catch (error) { checks.push(false); console.error(`FAIL ${name}\n${error.stack}`); }
}

check("an old save without a bookmark preserves the existing continue fallback", () => {
  const a = setup();
  for (const count of [0, 1, 2, 15, 16]) assert.equal(a.readReadingPosition(progress(count)), null);
});

check("refresh preserves selected feedback until the reader advances", () => {
  const a = setup();
  assert.equal(a.writeReadingPosition(position(), progress()), true);
  assert.equal(a.writeReadingPosition(position(), progress(1)), true);
  const refreshed = setup({ items: a.items });
  assert.deepEqual(plain(refreshed.readReadingPosition(progress(1))), position());
  assert.equal(refreshed.writeReadingPosition(position(0, 1), progress(1)), true);
  const afterNext = setup({ items: a.items });
  assert.deepEqual(plain(afterNext.readReadingPosition(progress(1))), position(0, 1));
});

check("second-scene feedback and the chapter's original text and notes are distinct reading points", () => {
  const a = setup();
  a.writeReadingPosition(position(0, 1), progress(2));
  assert.deepEqual(plain(setup({ items: a.items }).readReadingPosition(progress(2))), position(0, 1));
  a.writeReadingPosition(position(0, 1, true), progress(2));
  const withNote = { ...progress(2), reflections: { [gameChapters[0].id]: "这是一段不会写入书签的手记。" }, lastChapter: 1 };
  assert.deepEqual(plain(setup({ items: a.items }).readReadingPosition(withNote)), position(0, 1, true));
  assert.ok(!a.items.get(storageKey).includes("手记"));
  assert.ok(!a.items.get(storageKey).includes("reflections"));
  assert.ok(!a.items.get(storageKey).includes("lastChapter"));
  a.writeReadingPosition(position(1, 0), withNote);
  assert.deepEqual(plain(a.readReadingPosition(withNote)), position(1, 0));
});

check("the fully completed journey preserves final feedback, summary, and earlier chapter review", () => {
  const a = setup();
  const full = progress(scenes.length);
  const last = gameChapters.length - 1;
  for (const target of [position(last, 1), position(last, 1, true), position(0, 0), position(0, 1, true)]) {
    assert.equal(a.writeReadingPosition(target, full), true);
    assert.deepEqual(plain(setup({ items: a.items }).readReadingPosition(full)), target);
  }
});

check("reset, changed accounts, and changes from another tab invalidate an incompatible answer prefix", () => {
  const variants = [progress(), progress(1), progress(3), { ...progress(2), answers: { ...progress(2).answers, [scenes[0].id]: scenes[0].choices[1].id } }];
  for (const changed of variants) {
    const a = setup();
    a.writeReadingPosition(position(0, 1, true), progress(2));
    assert.equal(a.readReadingPosition(changed), null);
    assert.equal(a.items.has(storageKey), false);
    assert.equal(a.readReadingPosition(progress(2)), null, "An invalidated bookmark must not revive on a later account switch");
  }
  const a = setup();
  a.writeReadingPosition(position(0, 1, true), progress(2));
  a.clearReadingPosition();
  assert.equal(a.readReadingPosition(progress(2)), null, "Explicit account replacement clears even identical answers");
});

check("reading positions are isolated by tab storage", () => {
  const firstTab = setup(), otherTab = setup();
  firstTab.writeReadingPosition(position(), progress(1));
  otherTab.writeReadingPosition(position(0, 1), progress(1));
  assert.deepEqual(plain(firstTab.readReadingPosition(progress(1))), position());
  assert.deepEqual(plain(otherTab.readReadingPosition(progress(1))), position(0, 1));
});

check("a forged bookmark cannot skip unanswered scenes or unlock a chapter summary", () => {
  for (const target of [position(0, 1), position(1, 0), position(7, 1), position(0, 1, true)]) {
    const a = setup();
    assert.equal(a.writeReadingPosition(target, progress()), false);
    assert.equal(a.readReadingPosition(progress()), null);
    a.writeReadingPosition(position(), progress());
    const forged = { ...JSON.parse(a.items.get(storageKey)), position: target };
    a.items.set(storageKey, JSON.stringify(forged));
    assert.equal(a.readReadingPosition(progress()), null);
    assert.equal(a.items.has(storageKey), false);
  }
  const a = setup();
  assert.equal(a.writeReadingPosition(position(0, 1, true), progress(1)), false);
  assert.equal(a.writeReadingPosition(position(0, 0, true), progress(2)), false);
  for (const target of [position(0, 0), position(0, 1)]) {
    assert.equal(a.writeReadingPosition(target, progress(1)), true);
    assert.deepEqual(plain(a.readReadingPosition(progress(1))), target);
  }
});

check("malformed or obsolete storage and out-of-range positions fail safely", () => {
  const a = setup();
  a.writeReadingPosition(position(), progress(1));
  const valid = JSON.parse(a.items.get(storageKey));
  const invalid = ["{", "null", "[]", "false", "17", JSON.stringify({ ...valid, version: 0 }), JSON.stringify({ ...valid, answerPrefix: null }), JSON.stringify({ ...valid, position: null }), ...[position(-1), position(8), position(0, -1), position(0, 2), position(0.5), { ...position(), summary: "false" }, { ...position(), chapterIndex: "0" }].map((target) => JSON.stringify({ ...valid, position: target }))];
  for (const raw of invalid) {
    a.items.set(storageKey, raw);
    assert.equal(a.readReadingPosition(progress(1)), null);
    assert.equal(a.items.has(storageKey), false);
  }
});

check("invalid progress cannot create or restore a bookmark", () => {
  const invalid = [null, { ...progress(), version: 2 }, { ...progress(), answers: null }, { ...progress(), answers: [] }, { ...progress(), answers: { unknown: "unknown" } }, { ...progress(1), answers: { [scenes[1].id]: scenes[1].choices[0].id } }, { ...progress(1), answers: { [scenes[0].id]: "unknown" } }];
  for (const changed of invalid) {
    const a = setup();
    a.writeReadingPosition(position(), progress(1));
    assert.equal(a.readReadingPosition(changed), null);
    assert.equal(a.writeReadingPosition(position(), changed), false);
  }
});

check("SSR and disabled or full browser storage never interrupt the journey", () => {
  const ssr = setup({ ssr: true });
  assert.equal(ssr.readReadingPosition(progress()), null);
  assert.equal(ssr.writeReadingPosition(position(), progress()), false);
  assert.doesNotThrow(() => ssr.clearReadingPosition());
  const a = setup();
  a.writeReadingPosition(position(), progress(1));
  a.fail("get");
  assert.equal(a.readReadingPosition(progress(1)), null);
  a.fail("set");
  assert.equal(a.writeReadingPosition(position(), progress(1)), false);
  a.fail("remove");
  assert.doesNotThrow(() => a.clearReadingPosition());
  a.items.set(storageKey, "{");
  assert.equal(a.readReadingPosition(progress(1)), null);
});

console.log(`\nReading-position QA: ${checks.filter(Boolean).length}/${checks.length} checks passed.`);
if (checks.some((passed) => !passed)) process.exitCode = 1;
