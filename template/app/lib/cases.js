// Each case builds a value for variant 'A' and variant 'B' that differ in ONE attribute.
// The harness calls the cached function with A, A again (control), then B, and checks
// whether B got its own cache entry or reused A's.

class Widget {
  constructor(n) {
    this.n = n
  }
}

const pick = (v, a, b) => (v === 'A' ? a() : b())
const bytes = (n, fill, last) => {
  const u = new Uint8Array(n).fill(fill)
  if (last !== undefined) u[n - 1] = last
  return u
}

export const CASES = [
  // ---- primitives ----
  { id: 'p-string', group: 'primitive', desc: "'a' vs 'b'", make: v => pick(v, () => 'a', () => 'b') },
  { id: 'p-number', group: 'primitive', desc: '1 vs 2', make: v => pick(v, () => 1, () => 2) },
  { id: 'p-neg-zero', group: 'primitive', desc: '0 vs -0', make: v => pick(v, () => 0, () => -0) },
  { id: 'p-nan-inf', group: 'primitive', desc: 'NaN vs Infinity', make: v => pick(v, () => NaN, () => Infinity) },
  { id: 'p-bigint', group: 'primitive', desc: '1n vs 2n', make: v => pick(v, () => 1n, () => 2n) },
  { id: 'p-bool', group: 'primitive', desc: 'true vs false', make: v => pick(v, () => true, () => false) },
  { id: 'p-null-undefined', group: 'primitive', desc: 'null vs undefined', make: v => pick(v, () => null, () => undefined) },
  { id: 'p-str-vs-num', group: 'primitive', desc: "'1' vs 1", make: v => pick(v, () => '1', () => 1) },
  { id: 'p-undefined-vs-string', group: 'primitive', desc: "undefined vs the string '$undefined'", make: v => pick(v, () => undefined, () => '$undefined') },

  // ---- plain objects and arrays ----
  { id: 'o-value', group: 'object', desc: '{a:1} vs {a:2}', make: v => pick(v, () => ({ a: 1 }), () => ({ a: 2 })) },
  { id: 'o-key-order', group: 'object', desc: '{a,b} vs {b,a} (same data, key order swapped)', make: v => pick(v, () => ({ a: 1, b: 2 }), () => ({ b: 2, a: 1 })) },
  { id: 'o-undefined-prop', group: 'object', desc: '{a:1,b:undefined} vs {a:1}', make: v => pick(v, () => ({ a: 1, b: undefined }), () => ({ a: 1 })) },
  {
    id: 'o-shared-ref',
    group: 'object',
    desc: '{x:r,y:r} (one shared reference) vs {x:{..},y:{..}} (two equal copies)',
    make: v =>
      pick(
        v,
        () => {
          const r = { k: 1 }
          return { x: r, y: r }
        },
        () => ({ x: { k: 1 }, y: { k: 1 } })
      ),
  },
  { id: 'o-nested', group: 'object', desc: '{a:{b:{c:1}}} vs {a:{b:{c:2}}}', make: v => pick(v, () => ({ a: { b: { c: 1 } } }), () => ({ a: { b: { c: 2 } } })) },
  {
    id: 'o-null-proto',
    group: 'object',
    desc: 'plain {a:1} vs Object.create(null) with a:1',
    make: v =>
      pick(
        v,
        () => ({ a: 1 }),
        () => Object.assign(Object.create(null), { a: 1 })
      ),
  },
  { id: 'o-array-order', group: 'object', desc: '[1,2] vs [2,1]', make: v => pick(v, () => [1, 2], () => [2, 1]) },
  {
    id: 'o-array-hole',
    group: 'object',
    desc: '[1,<hole>,3] vs [1,undefined,3]',
    make: v =>
      pick(
        v,
        () => [1, , 3], // eslint-disable-line no-sparse-arrays
        () => [1, undefined, 3]
      ),
  },
  { id: 'o-array-vs-obj', group: 'object', desc: '[1] vs {0:1}', make: v => pick(v, () => [1], () => ({ 0: 1 })) },
  { id: 'o-empty', group: 'object', desc: '{} vs []', make: v => pick(v, () => ({}), () => []) },

  // ---- built-ins ----
  { id: 'b-date', group: 'builtin', desc: 'Date(1000) vs Date(2000)', make: v => pick(v, () => new Date(1000), () => new Date(2000)) },
  { id: 'b-map-value', group: 'builtin', desc: "Map k=1 vs Map k=2", make: v => pick(v, () => new Map([['k', 1]]), () => new Map([['k', 2]])) },
  {
    id: 'b-map-order',
    group: 'builtin',
    desc: 'Map insertion order swapped',
    make: v =>
      pick(
        v,
        () => new Map([['a', 1], ['b', 2]]),
        () => new Map([['b', 2], ['a', 1]])
      ),
  },
  { id: 'b-set-value', group: 'builtin', desc: "Set ['x'] vs Set ['y']", make: v => pick(v, () => new Set(['x']), () => new Set(['y'])) },
  { id: 'b-set-order', group: 'builtin', desc: 'Set insertion order swapped', make: v => pick(v, () => new Set([1, 2]), () => new Set([2, 1])) },
  {
    id: 'b-formdata',
    group: 'builtin',
    desc: 'FormData a=1 vs a=2',
    make: v => {
      const f = new FormData()
      f.append('a', v === 'A' ? '1' : '2')
      return f
    },
  },
  {
    id: 'b-formdata-order',
    group: 'builtin',
    desc: 'FormData entry order swapped',
    make: v => {
      const f = new FormData()
      if (v === 'A') {
        f.append('a', '1')
        f.append('b', '2')
      } else {
        f.append('b', '2')
        f.append('a', '1')
      }
      return f
    },
  },
  { id: 'b-url', group: 'builtin', desc: "URL 'http://x.test/a' vs '/b' (docs list URL as unsupported)", make: v => new URL('http://x.test/' + (v === 'A' ? 'a' : 'b')) },
  { id: 'b-urlsearchparams', group: 'builtin', desc: 'URLSearchParams a=1 vs a=2', make: v => new URLSearchParams({ a: v === 'A' ? '1' : '2' }) },

  // ---- typed arrays and buffers ----
  { id: 't-u8-bytes', group: 'typed', desc: 'Uint8Array(16) filled with 1 vs 2', make: v => pick(v, () => bytes(16, 1), () => bytes(16, 2)) },
  { id: 't-u8-last-byte', group: 'typed', desc: 'Uint8Array(200000) differing only in the LAST byte', make: v => pick(v, () => bytes(200000, 1, 1), () => bytes(200000, 1, 2)) },
  { id: 't-u8-vs-i8', group: 'typed', desc: 'Uint8Array vs Int8Array, same bytes', make: v => pick(v, () => new Uint8Array(16).fill(31), () => new Int8Array(16).fill(31)) },
  { id: 't-u8-vs-u16', group: 'typed', desc: 'Uint8Array([1,1]) vs Uint16Array([257]), same bytes', make: v => pick(v, () => new Uint8Array([1, 1]), () => new Uint16Array([257])) },
  { id: 't-u8-vs-arraybuffer', group: 'typed', desc: 'Uint8Array vs ArrayBuffer, same bytes', make: v => pick(v, () => new Uint8Array(16).fill(32), () => new Uint8Array(16).fill(32).buffer) },
  { id: 't-u8-vs-buffer', group: 'typed', desc: 'Uint8Array vs Node Buffer, same bytes', make: v => pick(v, () => new Uint8Array(16).fill(33), () => Buffer.alloc(16, 33)) },
  { id: 't-f32', group: 'typed', desc: 'Float32Array([1]) vs ([2])', make: v => pick(v, () => new Float32Array([1]), () => new Float32Array([2])) },
  {
    id: 't-u8-trailing-zero',
    group: 'typed',
    desc: 'Uint8Array([61,62,63]) (3 bytes) vs Uint8Array([61,62,63,0]) (4 bytes: same plus one trailing zero byte)',
    make: v => pick(v, () => new Uint8Array([61, 62, 63]), () => new Uint8Array([61, 62, 63, 0])),
  },
  {
    id: 't-view-offset',
    group: 'typed',
    desc: 'same 4 visible bytes: standalone array vs a view at offset 2 of a larger buffer',
    make: v =>
      pick(
        v,
        () => new Uint8Array([1, 2, 3, 4]),
        () => new Uint8Array(new Uint8Array([9, 9, 1, 2, 3, 4]).buffer, 2, 4)
      ),
  },

  // ---- Blob and File ----
  { id: 'f-blob-bytes', group: 'file', desc: 'Blob: different bytes, same type', make: v => new Blob([bytes(16, v === 'A' ? 1 : 2)], { type: 'text/plain' }) },
  { id: 'f-blob-type', group: 'file', desc: 'Blob: same bytes, type text/a vs text/b', make: v => new Blob([bytes(16, 21)], { type: v === 'A' ? 'text/a' : 'text/b' }) },
  { id: 'f-blob-empty-type', group: 'file', desc: "Blob: empty, type '' vs 'text/plain'", make: v => new Blob([], { type: v === 'A' ? '' : 'text/plain' }) },
  { id: 'f-blob-last-byte', group: 'file', desc: 'Blob(200000 bytes) differing only in the LAST byte', make: v => new Blob([bytes(200000, 1, v === 'A' ? 1 : 2)]) },
  { id: 'f-file-bytes', group: 'file', desc: 'File: different bytes, same name and type', make: v => new File([bytes(16, v === 'A' ? 41 : 42)], 'same.bin', { type: 'text/plain' }) },
  { id: 'f-file-name', group: 'file', desc: 'File: same bytes, name alice.pdf vs bob.pdf', make: v => new File([bytes(16, 22)], v === 'A' ? 'alice.pdf' : 'bob.pdf') },
  { id: 'f-file-type', group: 'file', desc: 'File: same bytes and name, type text/a vs text/b', make: v => new File([bytes(16, 23)], 'same.bin', { type: v === 'A' ? 'text/a' : 'text/b' }) },
  { id: 'f-file-lastmod', group: 'file', desc: 'File: same bytes and name, lastModified 1000 vs 2000', make: v => new File([bytes(16, 24)], 'same.bin', { lastModified: v === 'A' ? 1000 : 2000 }) },
  {
    id: 'f-blob-trailing-zero',
    group: 'file',
    desc: 'Blob([71,72,73]) (3 bytes) vs Blob([71,72,73,0]) (4 bytes: same plus one trailing zero byte)',
    make: v => pick(v, () => new Blob([new Uint8Array([71, 72, 73])]), () => new Blob([new Uint8Array([71, 72, 73, 0])])),
  },
  {
    id: 'f-file-trailing-zero',
    group: 'file',
    desc: 'File([81,82,83]) (3 bytes) vs File([81,82,83,0]) (4 bytes), same name and type',
    make: v => pick(v, () => new File([new Uint8Array([81, 82, 83])], 'z.bin'), () => new File([new Uint8Array([81, 82, 83, 0])], 'z.bin')),
  },
  { id: 'f-blob-vs-file', group: 'file', desc: 'Blob vs File with the same bytes', make: v => pick(v, () => new Blob([bytes(16, 25)]), () => new File([bytes(16, 25)], 'x.bin')) },

  // ---- opaque values: the cache cannot read them, so the function must not either ----
  { id: 'x-class', group: 'opaque', fn: 'ignore', desc: 'class instance 1 vs 2 (function ignores it)', make: v => new Widget(v === 'A' ? 1 : 2) },
  { id: 'x-function', group: 'opaque', fn: 'ignore', desc: '() => 1 vs () => 2 (function ignores it)', make: v => pick(v, () => () => 1, () => () => 2) },
  { id: 'x-regexp', group: 'opaque', fn: 'ignore', desc: '/a/ vs /b/ (function ignores it)', make: v => pick(v, () => /a/, () => /b/) },
  { id: 'x-symbol-local', group: 'opaque', fn: 'ignore', desc: "Symbol('a') vs Symbol('b') (function ignores it)", make: v => pick(v, () => Symbol('a'), () => Symbol('b')) },
  { id: 'x-symbol-registered', group: 'opaque', fn: 'ignore', desc: "Symbol.for('a') vs Symbol.for('b') (function ignores it)", make: v => pick(v, () => Symbol.for('a'), () => Symbol.for('b')) },

  // ---- long strings ----
  { id: 's-long-last-char', group: 'string', desc: "100000-char string differing only in the LAST character", make: v => 'a'.repeat(100000) + (v === 'A' ? 'x' : 'y') },
]
