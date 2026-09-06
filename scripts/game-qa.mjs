import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import ts from "typescript";

// Run with: node scripts/game-qa.mjs
// Execute the actual TypeScript data, persistence module and component handlers.
// A minimal hook/JSX harness is sufficient here; this is not a browser layout test.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const results = [];
const plain = (value) => JSON.parse(JSON.stringify(value));

function createHarness() {
  const storage = new Map();
  const events = new Map();
  let failReads = false;
  let failWrites = false;
  const hookSlots = [];
  let hookIndex = 0;
  const react = {
    useEffect() {},
    useState(initial) {
      const slot = hookIndex++;
      if (!(slot in hookSlots)) hookSlots[slot] = typeof initial === "function" ? initial() : initial;
      return [hookSlots[slot], (next) => { hookSlots[slot] = typeof next === "function" ? next(hookSlots[slot]) : next; }];
    },
    useRef(initial) {
      const slot = hookIndex++;
      if (!(slot in hookSlots)) hookSlots[slot] = { current: initial };
      return hookSlots[slot];
    },
    useSyncExternalStore(_subscribe, snapshot) { return snapshot(); },
  };
  const jsx = (type, props, key) => ({ type, props: props ?? {}, key });
  const window = {
    localStorage: {
      getItem(key) { if (failReads) throw new Error("storage unavailable"); return storage.get(key) ?? null; },
      setItem(key, value) { if (failWrites) throw new Error("quota or access denied"); storage.set(key, value); },
    },
    addEventListener(name, callback) { if (!events.has(name)) events.set(name, new Set()); events.get(name).add(callback); },
    removeEventListener(name, callback) { events.get(name)?.delete(callback); },
    scrollTo() {},
  };
  const modules = new Map();
  const context = vm.createContext({
    window,
    document: { querySelector: () => ({ focus() {} }), getElementById: () => ({ focus() {}, scrollIntoView() {} }) },
    requestAnimationFrame: (callback) => callback(),
    setTimeout,
    Blob,
    URL,
    console,
  });
  function load(relative) {
    if (modules.has(relative)) return modules.get(relative).exports;
    const loadedModule = { exports: {} };
    modules.set(relative, loadedModule);
    const code = fs.readFileSync(path.join(root, relative), "utf8");
    const exposed = code;
    const output = ts.transpileModule(exposed, {
      fileName: relative,
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    }).outputText;
    const localRequire = (specifier) => {
      if (specifier === "react") return react;
      if (specifier === "react/jsx-runtime") return { jsx, jsxs: jsx, Fragment: "fragment" };
      if (specifier === "next/link") return { __esModule: true, default: "a" };
      if (specifier === "./GameLandscape") return { GameLandscape: "landscape" };
      if (specifier === "./GameAccount") return { GameAccount: "account", AccountSaveIndicator: "save-indicator" };
      if (specifier === "./CharacterGallery") return { CharacterGallery: "gallery", CharacterPortrait: "portrait" };
      if (specifier === "@/lib/game-cast") return load("src/lib/game-cast.ts");
      if (specifier === "./GameIcon") return { GameIcon: "icon" };
      if (specifier.endsWith(".css")) return {};
      if (specifier === "@/data/confucius-game") return load("src/data/confucius-game.ts");
      if (specifier === "@/lib/game-progress") return load("src/lib/game-progress.ts");
      throw new Error(`Unexpected import: ${specifier}`);
    };
    vm.runInContext(`(function (require, module, exports) {${output}\n})`, context, { filename: relative })(localRequire, loadedModule, loadedModule.exports);
    return loadedModule.exports;
  }
  const data = load("src/data/confucius-game.ts");
  const progress = load("src/lib/game-progress.ts");
  const client = load("src/components/game/ConfuciusGame.tsx");
  return {
    data, progress, client, storage, events,
    render() { hookIndex = 0; return client.ConfuciusGame(); },
    denyStorage(reads, writes) { failReads = reads; failWrites = writes; },
    emitStorage() { for (const listener of events.get("storage") ?? []) listener(); },
  };
}

function nodes(tree, predicate) {
  const found = [];
  function visit(node) {
    if (Array.isArray(node)) { node.forEach(visit); return; }
    if (!node || typeof node !== "object") return;
    if (predicate(node)) found.push(node);
    visit(node.props?.children);
  }
  visit(tree);
  return found;
}
function textContent(node) {
  if (Array.isArray(node)) return node.map(textContent).join("");
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node !== "object") return String(node);
  return textContent(node.props?.children);
}
function button(tree, label) {
  const matches = nodes(tree, (node) => node.type === "button" && textContent(node).trim() === label);
  assert.equal(matches.length, 1, `Expected one button: ${label}`);
  return matches[0];
}
function click(tree, label) {
  const target = button(tree, label);
  assert.notEqual(target.props.disabled, true, `Button unexpectedly disabled: ${label}`);
  target.props.onClick();
}
function freshProgress() { return { version: 1, answers: {}, reflections: {}, lastChapter: 0 }; }
function answerPrefix(chapters, count) {
  return Object.fromEntries(chapters.flatMap((chapter) => chapter.scenes).slice(0, count).map((scene, i) => [scene.id, scene.choices[i % 3].id]));
}
function check(name, run) {
  try { run(); results.push({ name, passed: true }); console.log(`PASS ${name}`); }
  catch (error) { results.push({ name, passed: false, message: error.message }); console.error(`FAIL ${name}\n${error.message}`); }
}

check("content has 8 chapters, 16 scenes and 48 unique valid choices", () => {
  const { data: { gameChapters } } = createHarness();
  assert.equal(gameChapters.length, 8);
  const scenes = gameChapters.flatMap((chapter) => chapter.scenes);
  const choices = scenes.flatMap((scene) => scene.choices);
  assert.equal(scenes.length, 16);
  assert.equal(choices.length, 48);
  assert.equal(new Set(scenes.map((scene) => scene.id)).size, 16);
  assert.equal(new Set(choices.map((choice) => choice.id)).size, 48);
  gameChapters.forEach((chapter, index) => {
    assert.equal(chapter.number, index + 1);
    assert.equal(chapter.scenes.length, 2);
    chapter.scenes.forEach((scene) => assert.equal(scene.choices.length, 3));
  });
  choices.forEach((choice) => {
    assert.deepEqual(Object.keys(choice.stats).sort(), ["ren", "yong", "zhi"]);
    assert.equal(Object.values(choice.stats).reduce((sum, value) => sum + value, 0), 3);
    assert.ok(Object.values(choice.stats).every((value) => Number.isInteger(value) && value >= 0));
    assert.ok(choice.source.url.startsWith("https://"));
  });
});

check("corrupted, missing, primitive and unsupported-version saves reset safely", () => {
  const { progress } = createHarness();
  for (const raw of [null, "", "{", "null", "false", "[]", "17", '"saved"', '{"version":2}', '{"version":1,"answers":null,"reflections":false}']) {
    assert.deepEqual(plain(progress.parseGameProgress(raw)), freshProgress());
  }
});

check("invalid choices and answers after the first gap are discarded", () => {
  const { data: { gameChapters }, progress } = createHarness();
  const scenes = gameChapters.flatMap((chapter) => chapter.scenes);
  const later = answerPrefix(gameChapters, 16);
  later[scenes[1].id] = "choice-that-no-longer-exists";
  later["unknown-scene"] = "unknown-choice";
  const restored = progress.parseGameProgress(JSON.stringify({ ...freshProgress(), answers: later, lastChapter: 7 }));
  assert.deepEqual(plain(restored.answers), answerPrefix(gameChapters, 1));
  assert.equal(restored.lastChapter, 0);
  const skipped = { ...answerPrefix(gameChapters, 16) };
  delete skipped[scenes[4].id];
  const fixed = progress.parseGameProgress(JSON.stringify({ ...freshProgress(), answers: skipped, lastChapter: 7 }));
  assert.deepEqual(plain(fixed.answers), answerPrefix(gameChapters, 4));
  assert.equal(fixed.lastChapter, 2);
  const wrongSceneChoice = { [scenes[0].id]: scenes[1].choices[0].id };
  assert.deepEqual(plain(progress.parseGameProgress(JSON.stringify({ ...freshProgress(), answers: wrongSceneChoice })).answers), {});
});

check("chapter bounds and reflection fields are repaired without losing valid notes", () => {
  const { data: { gameChapters }, progress } = createHarness();
  for (const [supplied, expected] of [[-4, 0], [999, 3], [2, 2], [1.5, 0], ["2", 0], [null, 0]]) {
    const restored = progress.parseGameProgress(JSON.stringify({ version: 1, answers: answerPrefix(gameChapters, 6), reflections: { [gameChapters[0].id]: "思".repeat(1001), [gameChapters[1].id]: 17, unknown: "remove me" }, lastChapter: supplied }));
    assert.equal(restored.lastChapter, expected);
    assert.equal(restored.reflections[gameChapters[0].id].length, 1000);
    assert.equal(Object.keys(restored.reflections).length, 1);
  }
  const completed = progress.parseGameProgress(JSON.stringify({ ...freshProgress(), answers: answerPrefix(gameChapters, 16), lastChapter: 999 }));
  assert.equal(completed.lastChapter, 7);
});

check("score totals use existing choices only and survive serialization", () => {
  const { data: { gameChapters }, progress } = createHarness();
  for (let count = 0; count <= 16; count++) {
    const saved = { ...freshProgress(), answers: answerPrefix(gameChapters, count) };
    const expected = { ren: 0, zhi: 0, yong: 0 };
    gameChapters.flatMap((chapter) => chapter.scenes).slice(0, count).forEach((scene, index) => {
      for (const key of Object.keys(expected)) expected[key] += scene.choices[index % 3].stats[key];
    });
    const restored = progress.parseGameProgress(JSON.stringify(saved));
    assert.deepEqual(plain(progress.gameStats(restored)), expected);
    assert.equal(Object.values(progress.gameStats(restored)).reduce((sum, value) => sum + value, 0), count * 3);
  }
  const invalid = { ...freshProgress(), answers: { unknown: "invalid", [gameChapters[0].scenes[0].id]: "invalid" } };
  assert.deepEqual(plain(progress.gameStats(invalid)), { ren: 0, zhi: 0, yong: 0 });
});

check("local persistence, stable snapshots, listeners and memory fallback work", () => {
  const harness = createHarness();
  const { data: { gameChapters }, progress, storage } = harness;
  assert.deepEqual(plain(progress.getServerProgressSnapshot()), freshProgress());
  const first = progress.getProgressSnapshot();
  assert.equal(progress.getProgressSnapshot(), first);
  let notifications = 0;
  const unsubscribe = progress.subscribeProgress(() => { notifications++; });
  const next = { ...freshProgress(), answers: answerPrefix(gameChapters, 1) };
  assert.equal(progress.saveProgress(next), true);
  assert.equal(notifications, 1);
  assert.deepEqual(JSON.parse(storage.get(progress.GAME_STORAGE_KEY)), next);
  assert.equal(progress.getProgressSnapshot(), next);
  const fromAnotherTab = { ...freshProgress(), answers: answerPrefix(gameChapters, 2), lastChapter: 1 };
  storage.set(progress.GAME_STORAGE_KEY, JSON.stringify(fromAnotherTab));
  harness.emitStorage();
  assert.equal(notifications, 2);
  assert.deepEqual(plain(progress.getProgressSnapshot()), fromAnotherTab);
  harness.denyStorage(false, true);
  const unsaved = { ...fromAnotherTab, answers: answerPrefix(gameChapters, 3) };
  assert.equal(progress.saveProgress(unsaved), false);
  assert.equal(progress.getProgressSnapshot(), unsaved);
  harness.denyStorage(true, true);
  const privateSession = { ...unsaved, answers: answerPrefix(gameChapters, 4) };
  assert.equal(progress.saveProgress(privateSession), false);
  assert.equal(progress.getProgressSnapshot(), privateSession);
  unsubscribe();
  const before = notifications;
  progress.saveProgress(privateSession);
  harness.emitStorage();
  assert.equal(notifications, before);
});

check("actual client gates chapters, advances all 16 scenes and reaches the ending", () => {
  const harness = createHarness();
  const { data: { gameChapters }, progress } = harness;
  let tree = harness.render();
  const locked = nodes(tree, (node) => node.type === "button" && node.props["aria-disabled"] === true);
  assert.equal(locked.length, 7);
  locked[6].props.onClick();
  tree = harness.render();
  assert.ok(textContent(tree).includes("先完成第一章"));
  assert.equal(Object.keys(progress.getProgressSnapshot().answers).length, 0);
  click(tree, "开启我的旅程");
  for (let chapterIndex = 0; chapterIndex < 8; chapterIndex++) {
    for (let sceneIndex = 0; sceneIndex < 2; sceneIndex++) {
      tree = harness.render();
      const scene = gameChapters[chapterIndex].scenes[sceneIndex];
      assert.ok(nodes(tree, (node) => node.type === "h1" && textContent(node) === scene.title).length === 1);
      assert.equal(nodes(tree, (node) => node.props.id === "choice-feedback").length, 0);
      const options = nodes(tree, (node) => node.type === "button" && String(node.props.className).split(" ").includes("game-choice"));
      assert.equal(options.length, 3);
      assert.ok(options.every((option) => !option.props.disabled));
      const count = chapterIndex * 2 + sceneIndex;
      options[count % 3].props.onClick();
      tree = harness.render();
      assert.equal(Object.keys(progress.getProgressSnapshot().answers).length, count + 1);
      assert.equal(progress.getProgressSnapshot().answers[scene.id], scene.choices[count % 3].id);
      assert.equal(nodes(tree, (node) => node.props.id === "choice-feedback").length, 1);
      assert.ok(nodes(tree, (node) => node.type === "button" && String(node.props.className).split(" ").includes("game-choice")).every((option) => option.props.disabled));
      assert.equal(Object.values(progress.gameStats(progress.getProgressSnapshot())).reduce((sum, value) => sum + value, 0), (count + 1) * 3);
      click(tree, sceneIndex === 0 ? "走入下一幕" : "收下此章感悟");
    }
    tree = harness.render();
    const editor = nodes(tree, (node) => node.type === "textarea" && node.props.id === "chapter-note")[0];
    assert.ok(editor, "Chapter summary must include a reflection editor");
    editor.props.onChange({ target: { value: `第${chapterIndex + 1}章的感悟` } });
    tree = harness.render();
    assert.equal(progress.getProgressSnapshot().reflections[gameChapters[chapterIndex].id], `第${chapterIndex + 1}章的感悟`);
    if (chapterIndex < 7) {
      const next = nodes(tree, (node) => node.type === "button" && textContent(node).startsWith("前往第"));
      assert.equal(next.length, 1);
      next[0].props.onClick();
    } else click(tree, "回望这一生");
  }
  tree = harness.render();
  assert.ok(textContent(tree).includes("一生的路，通向今天的你。"));
  assert.equal(Object.keys(progress.getProgressSnapshot().answers).length, 16);
  assert.equal(Object.keys(progress.getProgressSnapshot().reflections).length, 8);
  assert.equal(Object.values(progress.gameStats(progress.getProgressSnapshot())).reduce((sum, value) => sum + value, 0), 48);
  const restored = progress.parseGameProgress(harness.storage.get(progress.GAME_STORAGE_KEY));
  assert.deepEqual(plain(restored), plain(progress.getProgressSnapshot()));
  click(tree, "翻开我的手记");
  tree = harness.render();
  assert.equal(nodes(tree, (node) => node.type === "textarea").length, 8);
  click(tree, "重新启程");
  tree = harness.render();
  click(tree, "保留旅程");
  tree = harness.render();
  assert.equal(Object.keys(progress.getProgressSnapshot().answers).length, 16);
  click(tree, "重新启程");
  tree = harness.render();
  click(tree, "确认清除并重新启程");
  tree = harness.render();
  assert.deepEqual(plain(progress.getProgressSnapshot()), freshProgress());
  assert.ok(textContent(tree).includes("开启我的旅程"));
});

check("partial reload resumes at the next scene and completed chapters remain read-only", () => {
  const harness = createHarness();
  const { data: { gameChapters }, progress } = harness;
  const saved = { ...freshProgress(), answers: answerPrefix(gameChapters, 3), lastChapter: 1 };
  harness.storage.set(progress.GAME_STORAGE_KEY, JSON.stringify(saved));
  let tree = harness.render();
  click(tree, "继续我的旅程");
  tree = harness.render();
  assert.ok(nodes(tree, (node) => node.type === "h1" && textContent(node) === gameChapters[1].scenes[1].title).length === 1);
  click(tree, "返回人生长卷");
  tree = harness.render();
  const firstChapter = nodes(tree, (node) => node.type === "button" && String(node.props.className).split(" ").includes("game-chapter"))[0];
  firstChapter.props.onClick();
  tree = harness.render();
  assert.ok(nodes(tree, (node) => node.type === "h1" && textContent(node) === gameChapters[0].scenes[0].title).length === 1);
  assert.ok(nodes(tree, (node) => node.type === "button" && String(node.props.className).split(" ").includes("game-choice")).every((option) => option.props.disabled));
  click(tree, "走入下一幕");
  tree = harness.render();
  assert.equal(Object.keys(progress.getProgressSnapshot().answers).length, 3);
  assert.equal(Object.values(progress.gameStats(progress.getProgressSnapshot())).reduce((sum, value) => sum + value, 0), 9);
  assert.ok(nodes(tree, (node) => node.props.id === "choice-feedback").length === 1);
});

check("a cross-tab reset cannot write an answer through a stale chapter cursor", () => {
  const harness = createHarness();
  const { data: { gameChapters }, progress } = harness;
  harness.storage.set(progress.GAME_STORAGE_KEY, JSON.stringify({ ...freshProgress(), answers: answerPrefix(gameChapters, 8), lastChapter: 4 }));
  let tree = harness.render();
  click(tree, "继续我的旅程");
  tree = harness.render();
  const staleScene = gameChapters[4].scenes[0];
  assert.ok(nodes(tree, (node) => node.type === "h1" && textContent(node) === staleScene.title).length === 1);
  let notifications = 0;
  const unsubscribe = progress.subscribeProgress(() => { notifications++; });
  // Another tab resets storage while this component retains its chapter/scene
  // hook state; render the external-store update before invoking the real handler.
  harness.storage.set(progress.GAME_STORAGE_KEY, JSON.stringify(freshProgress()));
  harness.emitStorage();
  assert.equal(notifications, 1);
  tree = harness.render();
  assert.ok(nodes(tree, (node) => node.type === "h1" && textContent(node) === staleScene.title).length === 1);
  const options = nodes(tree, (node) => node.type === "button" && String(node.props.className).split(" ").includes("game-choice"));
  assert.equal(options.length, 3);
  options[0].props.onClick();
  tree = harness.render();
  assert.deepEqual(plain(progress.getProgressSnapshot()), freshProgress());
  assert.deepEqual(JSON.parse(harness.storage.get(progress.GAME_STORAGE_KEY)), freshProgress());
  assert.equal(notifications, 1, "Rejected stale-cursor choice must not write or notify the store");
  assert.ok(textContent(tree).includes("旅程已在另一个标签页更新，请从长卷继续。"));
  assert.ok(textContent(tree).includes("开启我的旅程"));
  assert.equal(nodes(tree, (node) => node.props.id === "choice-feedback").length, 0);
  click(tree, "开启我的旅程");
  tree = harness.render();
  assert.ok(nodes(tree, (node) => node.type === "h1" && textContent(node) === gameChapters[0].scenes[0].title).length === 1);
  unsubscribe();
});

check("all 78 character records have unique original references and usable biography links", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "src/data/game-character-manifest.json"), "utf8"));
  assert.equal(manifest.length, 78);
  assert.equal(new Set(manifest.map((person) => person.slug)).size, 78);
  assert.equal(new Set(manifest.map((person) => person.originalAsset)).size, 78);
  assert.equal(manifest[0].slug, "confucius");
  const biographies = fs.readFileSync(path.join(root, "src/data/disciples-biographies.ts"), "utf8");
  for (const person of manifest) {
    assert.ok(fs.existsSync(path.join(root, "public", person.originalAsset)), `${person.name}: reference image missing`);
    assert.ok(person.originalSource.startsWith("https://"));
    if (person.slug !== "confucius") assert.ok(biographies.includes(`slug: "${person.slug}"`));
  }
});

const failed = results.filter((result) => !result.passed);
console.log(`\nGame QA: ${results.length - failed.length}/${results.length} checks passed.`);
if (failed.length) process.exitCode = 1;
