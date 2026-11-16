"use cache";
import { describe } from "./describe";

// Every exported function in this file is a cached function.
// `fill` is random per EXECUTION: if two calls return the same `fill`, they hit
// the same cache entry. That is how the harness tells "shared" from "separate".
const fill = () => Math.random().toString(36).slice(2, 8);

// Reads the argument and reports what it saw.
export async function echo(arg) {
  return { fill: fill(), seen: await describe(arg) };
}

// Never touches the argument (needed for values the cache treats as opaque).
export async function ignore(arg) {
  return { fill: fill(), seen: "not read" };
}

// Used by the size-limit probes.
export async function size(arg) {
  return { fill: fill() };
}

// ---- small functions used by `npm run demo`, `keys` and `action` ----
// `filledAt` is the time the function body actually ran, so two calls that return the same
// `filledAt` were served by the same cache entry.
export async function inspectUpload(file) {
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    filledAt: Date.now(),
  };
}

export async function describeBytes(bytes) {
  return {
    length: bytes.length,
    first: bytes[0],
    last: bytes[bytes.length - 1],
    filledAt: Date.now(),
  };
}
