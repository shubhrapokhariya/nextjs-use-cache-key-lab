#!/usr/bin/env node
// Verifies the ROOT CAUSES without trusting anyone's write-up:
//  1. the size limit reproduces in plain Node (no Next.js) with String.fromCodePoint(...uint16)
//  2. what the cache-key builder in each BUILT Next.js version actually includes for binary arguments
//
//   node diagnose.mjs            (uses every version already built in .work/)
//   node diagnose.mjs --skip-stack   (skip the --stack-size part, e.g. on Windows)

import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const WORK = path.join(ROOT, '.work')
const skipStack = process.argv.includes('--skip-stack')
const lines = []
const out = s => {
  console.log(s)
  lines.push(s)
}

// ---------- Part 1: plain Node ----------
const probe = `
function ok(n){ try { String.fromCodePoint(...new Uint16Array(n)); return true } catch { return false } }
let lo=1000, hi=3000000
while (hi-lo>1){ const m=(lo+hi)>>1; if (ok(m)) lo=m; else hi=m }
console.log(lo)
`
const run = (flags = []) => {
  const r = spawnSync(process.execPath, [...flags, '-e', probe], { encoding: 'utf8' })
  return r.status === 0 ? Number(r.stdout.trim()) : null
}
out(`# Part 1: plain Node ${process.version} (no Next.js): largest Uint16Array you can spread into String.fromCodePoint(...)\n`)
const base = run()
out(`default stack: ${base} elements = ${base * 2} bytes   (compare with the Uint8Array limit from npm run limits)`)
if (!skipStack) {
  for (const s of [500, 2000]) {
    const v = run([`--stack-size=${s}`])
    out(`--stack-size=${s}: ${v == null ? 'process crashed (your OS stack is too small for this value)' : `${v} elements = ${v * 2} bytes`}`)
  }
}
out(skipStack ? '\nEach spread argument takes one stack slot. (Stack-size runs skipped; run without --skip-stack to compare 500 and 2000.)\n' : '\nThe limit scales with the stack size: each spread argument takes one stack slot (about 8 bytes).\n')

// ---------- Part 2: the cache-key builder in built versions ----------
out('# Part 2: what the cache-key builder includes for a binary (File/Blob/typed array) argument\n')
const walk = (dir, acc = []) => {
  for (const e of fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : []) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, acc)
    else if (e.name.endsWith('.js')) acc.push(p)
  }
  return acc
}
const semver = v => v.split('.').map(Number)
const versions = fs.existsSync(WORK) ? fs.readdirSync(WORK).filter(d => d.startsWith('next-')).map(d => d.slice(5)) : []
versions.sort((a, b) => { const x = semver(a), y = semver(b); return x[0] - y[0] || x[1] - y[1] || x[2] - y[2] })
if (!versions.length) out('No built versions in .work/ yet. Run `npm run quick` first.')

out('| next | found | name in key | type in key | byteLength in key | lastModified in key | spreads bytes into fromCodePoint |')
out('|---|---|---|---|---|---|---|')
// This step pattern-matches minified build output: it finds the function that spreads bytes into
// String.fromCodePoint and cuts it at `return t}`. That ties it to the shape of Next 16.x builds.
// If a build minifies differently it reports "not found" instead of guessing.
const snippets = []
for (const v of versions) {
  const server = path.join(WORK, `next-${v}`, '.next', 'server')
  let found = null
  for (const f of walk(server)) {
    if (fs.statSync(f).size > 30e6) continue
    const s = fs.readFileSync(f, 'utf8')
    const m = s.match(/String\.fromCodePoint\(\.\.\.new Uint16Array/)
    if (m) {
      const start = s.lastIndexOf('async function', m.index)
      const end = s.indexOf('return t}', m.index)
      found = s.slice(start, end + 9)
      break
    }
  }
  if (!found) {
    out(`| ${v} | not found | - | - | - | - | - |`)
    continue
  }
  const yn = b => (b ? 'yes' : 'no')
  out(`| ${v} | yes | ${yn(/\.name\.length/.test(found))} | ${yn(/\.type\.length/.test(found))} | ${yn(/byteLength\.toString\(16\)/.test(found))} | ${yn(/lastModified/.test(found))} | yes |`)
  snippets.push([v, found])
}

out('\n## The function itself (minified, copied from your own build output)\n')
const seen = new Set()
for (const [v, code] of snippets) {
  const key = code.replace(/\b[a-z]\b/g, '_') // same logic with different minified names counts as the same
  if (seen.has(key)) continue
  seen.add(key)
  const same = snippets.filter(([, c]) => c.replace(/\b[a-z]\b/g, '_') === key).map(([x]) => x)
  out(`### ${same.join(', ')}\n\n\`\`\`js\n${code}\n\`\`\`\n`)
}

fs.mkdirSync(path.join(ROOT, 'results'), { recursive: true })
fs.writeFileSync(path.join(ROOT, 'results', 'DIAGNOSE.md'), lines.join('\n'))
console.log('\n(saved to results/DIAGNOSE.md)')
