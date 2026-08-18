#!/usr/bin/env node
"use strict";

// Shared by scripts/check-refs.js and scripts/check-flags.js. Extracted rather than
// copied so the two checks cannot drift apart on what counts as live code.

// Commented-out code is everywhere in these sources -- abandoned scenes, an older
// damage formula, a Pill Tower that was never finished. Those references are not
// live, so they are replaced by spaces rather than removed, which keeps every line
// and column number intact for the report.
function stripComments(text) {
  let out = "";
  let i = 0;
  let mode = "code"; // code | line | block | single | double | tick
  while (i < text.length) {
    const c = text[i];
    const next = text[i + 1];
    if (mode === "code") {
      if (c === "/" && next === "/") {
        mode = "line";
        out += "  ";
        i += 2;
        continue;
      }
      if (c === "/" && next === "*") {
        mode = "block";
        out += "  ";
        i += 2;
        continue;
      }
      if (c === "'") mode = "single";
      else if (c === '"') mode = "double";
      else if (c === "`") mode = "tick";
      out += c;
      i += 1;
      continue;
    }
    if (mode === "line") {
      if (c === "\n") {
        mode = "code";
        out += c;
      } else out += " ";
      i += 1;
      continue;
    }
    if (mode === "block") {
      if (c === "*" && next === "/") {
        mode = "code";
        out += "  ";
        i += 2;
        continue;
      }
      out += c === "\n" ? c : " ";
      i += 1;
      continue;
    }
    // Inside a string literal. Escapes are copied through as a pair so a
    // trailing backslash cannot end the literal early.
    if (c === "\\") {
      out += c + (next === undefined ? "" : next);
      i += 2;
      continue;
    }
    if (
      (mode === "single" && c === "'") ||
      (mode === "double" && c === '"') ||
      (mode === "tick" && c === "`")
    )
      mode = "code";
    out += c;
    i += 1;
  }
  return out;
}

module.exports = stripComments;
