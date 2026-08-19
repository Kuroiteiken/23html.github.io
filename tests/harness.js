#!/usr/bin/env node
"use strict";

// Loads the real game bundle into a Node context so a check can ask the game what
// it does instead of asking the source text what it looks like.
//
// WHY THIS EXISTS
//
// Every check in this repository used to read the sources as text. check-refs.js
// matched `item.sp4` with a regular expression, check-combat.js rewrote the damage
// formula in its own words, and check-game-regressions.js pinned function bodies
// down to their whitespace. That has three costs. A rewrite that keeps the
// behaviour identical breaks the tests; a change that breaks the behaviour passes
// them as long as the text still matches; and the damage formula existed twice, so
// the check the agent instructions call critical was validating a copy that could
// drift away from the game in silence.
//
// The bundle is one global scope with no module system, which is what made the
// text approach look like the only option. It is actually what makes this one
// work: concatenate the sources exactly as scripts/build.js does, run them in a
// vm context, and every registry the game defines -- item, creature, area, chss,
// skl, and the functions beside them -- is a property of that context.
//
// WHAT IS STUBBED
//
// The bundle builds its whole interface at definition time: js/ui/interface.js
// line 7 is already an addElement(document.body, ...). So the DOM is not optional
// and cannot be a bare {} -- it has to be a small tree that supports what the
// bundle actually calls. It does not have to render anything, so nothing here
// measures, paints, or lays out.
//
// The game itself does NOT start. js/core/bootstrap.js ends with
//
//   if (document.readyState === "complete") queueMicrotask(startGame);
//   else window.addEventListener("load", startGame, { once: true });
//
// and this harness reports "loading", so the listener is registered and never
// fires. Definitions run; load(), the tick and the save restore do not. A check
// that wants a started game has to say so, which keeps the default cheap.

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.dirname(__dirname);
const sources = require("../scripts/sources");

// --- The smallest DOM the bundle will accept -------------------------------

// innerHTML is assigned, appended to and read back in about 600 places. None of
// them parse it again, so it is kept as a string; the one thing that must be true
// is that writing it drops the children a real browser would have discarded.
function createElement(ownerDocument, tagName) {
  const element = {
    tagName: String(tagName).toUpperCase(),
    nodeName: String(tagName).toUpperCase(),
    id: "",
    className: "",
    value: "",
    checked: false,
    disabled: false,
    title: "",
    href: "",
    src: "",
    scrollTop: 0,
    scrollHeight: 0,
    offsetWidth: 0,
    offsetHeight: 0,
    style: {},
    dataset: {},
    attributes: {},
    children: [],
    parentNode: null,
    ownerDocument,
    listeners: {},
  };

  let html = "";
  Object.defineProperty(element, "innerHTML", {
    get: () => html,
    set(next) {
      html = String(next);
      for (const child of element.children) child.parentNode = null;
      element.children.length = 0;
    },
    enumerable: true,
  });
  Object.defineProperty(element, "textContent", {
    get: () => html,
    set(next) {
      html = String(next);
      for (const child of element.children) child.parentNode = null;
      element.children.length = 0;
    },
    enumerable: true,
  });

  Object.defineProperty(element, "firstChild", {
    get: () => element.children[0] ?? null,
  });
  Object.defineProperty(element, "lastChild", {
    get: () => element.children[element.children.length - 1] ?? null,
  });
  Object.defineProperty(element, "firstElementChild", {
    get: () => element.children[0] ?? null,
  });
  Object.defineProperty(element, "lastElementChild", {
    get: () => element.children[element.children.length - 1] ?? null,
  });
  Object.defineProperty(element, "childNodes", { get: () => element.children });

  element.appendChild = (child) => {
    if (child.parentNode) child.parentNode.removeChild(child);
    child.parentNode = element;
    element.children.push(child);
    return child;
  };
  element.removeChild = (child) => {
    const at = element.children.indexOf(child);
    if (at >= 0) element.children.splice(at, 1);
    child.parentNode = null;
    return child;
  };
  element.insertBefore = (child, before) => {
    const at = element.children.indexOf(before);
    if (child.parentNode) child.parentNode.removeChild(child);
    child.parentNode = element;
    element.children.splice(at < 0 ? element.children.length : at, 0, child);
    return child;
  };
  element.remove = () => element.parentNode?.removeChild(element);
  element.contains = (other) => {
    for (let node = other; node; node = node.parentNode)
      if (node === element) return true;
    return false;
  };

  element.setAttribute = (name, value) => {
    element.attributes[name] = String(value);
    if (name === "id") element.id = String(value);
    if (name === "class") element.className = String(value);
  };
  element.getAttribute = (name) => element.attributes[name] ?? null;
  element.removeAttribute = (name) => delete element.attributes[name];
  element.hasAttribute = (name) => name in element.attributes;

  element.classList = {
    add(...names) {
      const have = new Set(element.className.split(/\s+/).filter(Boolean));
      for (const name of names) have.add(name);
      element.className = [...have].join(" ");
    },
    remove(...names) {
      const have = new Set(element.className.split(/\s+/).filter(Boolean));
      for (const name of names) have.delete(name);
      element.className = [...have].join(" ");
    },
    toggle(name) {
      const have = new Set(element.className.split(/\s+/).filter(Boolean));
      have.has(name) ? have.delete(name) : have.add(name);
      element.className = [...have].join(" ");
    },
    contains: (name) => element.className.split(/\s+/).includes(name),
  };

  // Listeners are recorded rather than discarded, so a check can drive a click
  // the way a player would instead of reaching for the handler by name.
  element.addEventListener = (type, handler) => {
    (element.listeners[type] ??= []).push(handler);
  };
  element.removeEventListener = (type, handler) => {
    const list = element.listeners[type];
    if (!list) return;
    const at = list.indexOf(handler);
    if (at >= 0) list.splice(at, 1);
  };
  element.dispatchEvent = (event) => {
    for (const handler of element.listeners[event?.type] ?? [])
      handler.call(element, event);
    return true;
  };
  element.click = () =>
    element.dispatchEvent({ type: "click", target: element });
  element.focus = () => {
    ownerDocument.activeElement = element;
  };
  element.blur = () => {
    ownerDocument.activeElement = ownerDocument.body;
  };

  // Nothing is laid out, so every box is empty. Layout-dependent behaviour is the
  // browser suite's job; this harness answers questions about game state.
  element.getBoundingClientRect = () => ({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  // The icon sheet is sliced on a canvas at definition time (js/ui/interface.js
  // around line 8651). Nothing is drawn here, so the context records its calls and
  // hands back blank pixel data of the size that was asked for.
  element.width = 0;
  element.height = 0;
  element.getContext = () => ({
    imageSmoothingEnabled: false,
    drawImage() {},
    clearRect() {},
    fillRect() {},
    strokeRect() {},
    fillText() {},
    beginPath() {},
    closePath() {},
    moveTo() {},
    lineTo() {},
    arc() {},
    fill() {},
    stroke() {},
    save() {},
    restore() {},
    translate() {},
    scale() {},
    rotate() {},
    setTransform() {},
    measureText: () => ({ width: 0 }),
    createImageData: (w, h) => ({
      width: w,
      height: h,
      data: new Uint8ClampedArray(w * h * 4),
    }),
    getImageData: (x, y, w, h) => ({
      width: w,
      height: h,
      data: new Uint8ClampedArray(Math.max(0, w) * Math.max(0, h) * 4),
    }),
    putImageData() {},
  });

  element.getElementsByClassName = (name) =>
    descendants(element).filter((node) => node.classList.contains(name));
  element.querySelector = (selector) =>
    element.querySelectorAll(selector)[0] ?? null;
  element.querySelectorAll = (selector) => matchAll(element, selector);

  return element;
}

function descendants(node, out = []) {
  for (const child of node.children) {
    out.push(child);
    descendants(child, out);
  }
  return out;
}

// Enough of a selector engine for `.cls`, `#id`, `tag`, and comma-separated lists
// of those. Anything more elaborate belongs in the browser suite.
function matchAll(node, selector) {
  const parts = String(selector)
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return descendants(node).filter((element) =>
    parts.some((part) => {
      if (part.startsWith("."))
        return element.classList.contains(part.slice(1));
      if (part.startsWith("#")) return element.id === part.slice(1);
      return element.tagName === part.toUpperCase();
    }),
  );
}

function createDocument() {
  const document = {
    // "loading", so bootstrap.js registers its load listener instead of starting
    // the game. See the note at the top of this file.
    readyState: "loading",
    hidden: false,
    baseURI: "http://localhost/",
    // The one place that reads it walks `rules` and does nothing when it is empty.
    styleSheets: [{ rules: [], cssRules: [] }],
    listeners: {},
  };
  document.createElement = (tagName) => createElement(document, tagName);
  document.createTextNode = (text) => {
    const node = createElement(document, "#text");
    node.textContent = text;
    return node;
  };
  document.documentElement = createElement(document, "html");
  document.body = createElement(document, "body");
  document.head = createElement(document, "head");
  document.documentElement.appendChild(document.head);
  document.documentElement.appendChild(document.body);
  document.activeElement = document.body;
  document.getElementById = (id) =>
    descendants(document.documentElement).find((node) => node.id === id) ??
    null;
  document.getElementsByClassName = (name) =>
    descendants(document.documentElement).filter((node) =>
      node.classList.contains(name),
    );
  document.getElementsByTagName = (tagName) =>
    descendants(document.documentElement).filter(
      (node) => node.tagName === String(tagName).toUpperCase(),
    );
  document.querySelector = (selector) =>
    matchAll(document.documentElement, selector)[0] ?? null;
  document.querySelectorAll = (selector) =>
    matchAll(document.documentElement, selector);
  document.addEventListener = (type, handler) => {
    (document.listeners[type] ??= []).push(handler);
  };
  document.removeEventListener = () => {};
  document.dispatchEvent = (event) => {
    for (const handler of document.listeners[event?.type] ?? [])
      handler.call(document, event);
    return true;
  };
  return document;
}

function createStorage() {
  const values = new Map();
  return {
    get length() {
      return values.size;
    },
    getItem: (key) =>
      values.has(String(key)) ? values.get(String(key)) : null,
    setItem: (key, value) => values.set(String(key), String(value)),
    removeItem: (key) => values.delete(String(key)),
    clear: () => values.clear(),
    key: (index) => [...values.keys()][index] ?? null,
  };
}

// --- i18n --------------------------------------------------------------------

// The real locale file, read the way js/i18n-loader.js reads it. Content modules
// call i18n.t() while defining themselves, so a stub that returned the key would
// put the key into every name and description in the game -- and check-i18n.js
// exists precisely to catch that in the shipped product.
function createI18n(localeCode) {
  const localeRoot = path.join(root, "locales");
  const manifest = JSON.parse(
    fs.readFileSync(path.join(localeRoot, "manifest.json"), "utf8"),
  );
  const read = (code) => {
    const definition = manifest.locales.find((locale) => locale.code === code);
    if (!definition)
      throw new Error(`locales/manifest.json does not register "${code}".`);
    return JSON.parse(
      fs.readFileSync(path.join(localeRoot, definition.file), "utf8"),
    );
  };
  const fallback = read(manifest.defaultLocale);
  const selected =
    localeCode === manifest.defaultLocale ? fallback : read(localeCode);

  const getPath = (source, key) =>
    String(key)
      .split(".")
      .reduce((value, part) => value?.[part], source);
  const interpolate = (value, replacements = {}) =>
    typeof value === "string"
      ? value.replace(/\{([\w.-]+)\}/g, (match, key) =>
          Object.hasOwn(replacements, key) ? replacements[key] : match,
        )
      : value;

  return {
    availableLocales: manifest.locales.map(({ code, name }) => ({
      code,
      name,
    })),
    currentLocale: localeCode,
    defaultLocale: manifest.defaultLocale,
    format: (value, replacements) => interpolate(value, replacements),
    get(key) {
      return getPath(selected, key) ?? getPath(fallback, key);
    },
    setLocale() {},
    t(key, replacements) {
      const value = this.get(key);
      return interpolate(typeof value === "string" ? value : key, replacements);
    },
  };
}

// --- Loading -----------------------------------------------------------------

function bundleSource() {
  // The same concatenation scripts/build.js performs, from the same list, so the
  // harness cannot be testing a different program than the one that ships. Read
  // from the sources rather than js/game.js so a check does not need a build.
  return sources
    .map((source) => fs.readFileSync(path.join(root, source), "utf8").trim())
    .join("\n\n");
}

/**
 * Run the bundle and hand back its global scope.
 *
 * @param {object} [options]
 * @param {string} [options.locale] Locale code the content is defined in. "en"
 *   by default; pass "tr" to check what a Turkish player actually reads.
 * @param {boolean} [options.runTimers] Let setInterval/setTimeout fire. Off by
 *   default: the game installs a one-second tick, and a check that only wants to
 *   read the registries must not be left with a live timer holding Node open.
 * @returns {object} The vm context. Every global the bundle declares -- item,
 *   creature, area, chss, skl, you, dmg_calc, and the rest -- is a property of it.
 */
function loadGame(options = {}) {
  const { locale = "en", runTimers = false } = options;

  const document = createDocument();
  const timers = [];
  const noopTimer = (handler, delay, ...args) => {
    timers.push({ handler, delay, args });
    return timers.length;
  };

  const context = {
    document,
    i18n: createI18n(locale),
    console,
    // Only things a vm context does NOT already own. Math, Date, JSON, Number and
    // the rest are the context's own, and passing Node's in their place is a real
    // trap rather than a convenience: a vm realm has its own intrinsics, so a
    // number created inside the bundle has the CONTEXT's Number as its
    // constructor. Overwriting the global with Node's makes
    // `a[0].constructor === Number` false for every number in the program. The
    // Mersenne Twister in js/utils/random.js branches on exactly that comparison
    // and recurses into setSeed forever when it fails, which is how this was
    // found. Do not add intrinsics to this list.
    URL,
    URLSearchParams,
    TextEncoder,
    TextDecoder,
    btoa,
    atob,
    queueMicrotask,
    structuredClone,
    Image: class Image {
      constructor() {
        this.width = 0;
        this.height = 0;
        this.src = "";
      }
      addEventListener() {}
    },
    Audio: class Audio {
      constructor(src) {
        this.src = src;
      }
      play() {
        return Promise.resolve();
      }
      pause() {}
    },
    Event: class Event {
      constructor(type) {
        this.type = type;
      }
    },
    requestAnimationFrame: () => 0,
    cancelAnimationFrame: () => {},
    getComputedStyle: () => ({ display: "block", getPropertyValue: () => "" }),
  };

  context.setTimeout = runTimers ? setTimeout : noopTimer;
  context.setInterval = runTimers ? setInterval : noopTimer;
  context.clearTimeout = runTimers ? clearTimeout : () => {};
  context.clearInterval = runTimers ? clearInterval : () => {};

  const window = context;
  window.window = window;
  window.globalThis = window;
  window.self = window;
  window.localStorage = createStorage();
  window.sessionStorage = createStorage();
  window.location = new URL("http://localhost/");
  window.location.reload = () => {};
  window.location.replace = () => {};
  window.innerWidth = 1280;
  window.innerHeight = 900;
  window.devicePixelRatio = 1;
  window.listeners = {};
  window.addEventListener = (type, handler) => {
    (window.listeners[type] ??= []).push(handler);
  };
  window.removeEventListener = () => {};
  window.dispatchEvent = (event) => {
    for (const handler of window.listeners[event?.type] ?? [])
      handler.call(window, event);
    return true;
  };
  window.navigator = { language: locale, userAgent: "node" };

  vm.createContext(context);
  vm.runInContext(bundleSource(), context, { filename: "game-bundle.js" });

  // The pending timer calls, for a check that wants to assert one was scheduled.
  context.__timers = timers;
  return context;
}

/**
 * Start the game the way a finished page load does, after loadGame() has run.
 * Only for checks that need restored state; the registries do not need it.
 */
function startGame(context) {
  context.document.readyState = "complete";
  context.dispatchEvent({ type: "load" });
  return context;
}

module.exports = { loadGame, startGame, bundleSource };
