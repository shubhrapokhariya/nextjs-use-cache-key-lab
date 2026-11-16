#!/usr/bin/env node
// Merges results/*.json into results/SUMMARY.md (and prints it).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const RESULTS = path.join(ROOT, 'results')
const files = fs.existsSync(RESULTS) ? fs.readdirSync(RESULTS).filter(f => f.endsWith('.json')) : []
if (!files.length) {
  console.error('No results yet. Run `npm run quick` first.')
  process.exit(1)
}

const semver = v => v.split('.').map(Number)
const cmp = (a, b) => {
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] - b[i]
  return 0
}
const runs = files
  .map(f => JSON.parse(fs.readFileSync(path.join(RESULTS, f), 'utf8')))
  .sort((a, b) => cmp(semver(a.meta.next), semver(b.meta.next)) || cmp(semver(a.meta.node), semver(b.meta.node)))

const label = r => `${r.meta.next}<br>node ${r.meta.node}`
const esc = s => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ')
const md = []

md.push('# use cache key lab: results\n')
md.push('| run | next | node | platform | date |\n|---|---|---|---|---|')
for (const r of runs) md.push(`| ${r.meta.next} / node ${r.meta.node} | ${r.meta.next} | ${r.meta.node} | ${r.meta.platform} | ${r.meta.date.slice(0, 10)} |`)

md.push('\n**Legend**: `SEPARATE` = own cache entry. `SHARED` = reused the first caller\'s entry (output identical to what the 2nd caller would have produced). ' +
  '`SHARED-WRONG` = reused the first caller\'s entry AND the 2nd caller received output computed for a different input. `ERROR` = threw. `NO-CACHE` = control call was not cached (result invalid).\n')

// ---- cases ----
const withCases = runs.filter(r => r.cases)
if (withCases.length) {
  const total = withCases[0].cases.length
  md.push(`## 1. Key cases (${total} inputs)\n`)
  md.push(`| id | group | what differs | ${withCases.map(label).join(' | ')} |`)
  md.push(`|---|---|---|${withCases.map(() => '---').join('|')}|`)
  for (const c of withCases[0].cases) {
    const cells = withCases.map(r => (r.cases.find(x => x.id === c.id) || {}).status || '-')
    md.push(`| ${c.id} | ${c.group} | ${esc(c.desc)} | ${cells.join(' | ')} |`)
  }
  const counts = r => r.cases.reduce((m, x) => ((m[x.status] = (m[x.status] || 0) + 1), m), {})
  md.push('\n**Totals per run**: ' + withCases.map(r => `${r.meta.next}: ${JSON.stringify(counts(r))}`).join(' ; '))

  md.push('\n### Details for ERROR and SHARED-WRONG rows\n')
  for (const r of withCases) {
    const rows = r.cases.filter(x => x.status === 'ERROR' || x.status === 'SHARED-WRONG')
    if (!rows.length) continue
    md.push(`**next ${r.meta.next} / node ${r.meta.node}**\n`)
    for (const x of rows) {
      if (x.status === 'ERROR') md.push(`- \`${x.id}\` ERROR on ${x.errorOn}: ${esc(x.serverError || x.error)}`)
      else md.push(`- \`${x.id}\` SHARED-WRONG: second caller received \`${esc(x.bSeen)}\` but should have seen \`${esc(x.bShouldSee)}\``)
    }
    md.push('')
  }
}

// ---- closures ----
const withClosure = runs.filter(r => r.closure)
if (withClosure.length) {
  md.push('## 2. Values captured by a closure inside a `use cache` function\n')
  md.push(`| kind | mode | ${withClosure.map(label).join(' | ')} |`)
  md.push(`|---|---|${withClosure.map(() => '---').join('|')}|`)
  for (const row of withClosure[0].closure) {
    const cells = withClosure.map(r => (r.closure.find(x => x.kind === row.kind && x.mode === row.mode) || {}).status || '-')
    md.push(`| ${row.kind} | ${row.mode} | ${cells.join(' | ')} |`)
  }
  md.push('\n`ref` = the cached function only mentions the captured value; `read` = it reads `typeof` and `constructor.name`.')
  md.push('\nError text seen:\n')
  const seenErr = new Set()
  for (const r of withClosure)
    for (const x of r.closure)
      if (x.status === 'ERROR') {
        const key = `${x.kind}/${x.mode}: ${x.serverError || x.error}`
        if (!seenErr.has(key)) {
          seenErr.add(key)
          md.push(`- (${r.meta.next}) ${esc(key)}`)
        }
      }
  md.push('')
}

// ---- limits ----
const withLimits = runs.filter(r => r.limits)
if (withLimits.length) {
  md.push('## 3. Size limits (largest argument that still works)\n')
  md.push(`| type | unit | ${withLimits.map(label).join(' | ')} |`)
  md.push(`|---|---|${withLimits.map(() => '---').join('|')}|`)
  for (const kind of Object.keys(withLimits[0].limits)) {
    const cells = withLimits.map(r => {
      const x = r.limits[kind]
      return x ? (x.maxOk == null ? 'n/a' : x.maxOk.toLocaleString('en-US')) : '-'
    })
    md.push(`| ${kind} | ${withLimits[0].limits[kind].unit} | ${cells.join(' | ')} |`)
  }
  md.push('')
}
for (const r of runs.filter(x => x.warm)) {
  md.push(`### Warm-up experiment (next ${r.meta.next}, node ${r.meta.node})\n`)
  md.push(`Probing ${r.warm.probedBytes.toLocaleString('en-US')} bytes (the first failing size in the cold bisection): fresh process = **${r.warm.coldFreshProcess}**, after 300 warm-up requests = **${r.warm.afterWarmup300}**; warmed-process maximum = **${r.warm.warmMaxOk?.toLocaleString('en-US')}** bytes.\n`)
}
for (const r of runs.filter(x => x.stack)) {
  md.push(`### Stack-size experiment (next ${r.meta.next}, node ${r.meta.node})\n`)
  md.push('| `--stack-size` (KB) | largest working Uint8Array (bytes) |\n|---|---|')
  for (const s of r.stack) md.push(`| ${s.stackSizeKB} | ${s.maxOkBytes != null ? s.maxOkBytes.toLocaleString('en-US') : esc(s.error || 'n/a')} |`)
  md.push('')
}

const out = md.join('\n')
fs.writeFileSync(path.join(RESULTS, 'SUMMARY.md'), out)
console.log(out)
console.log(`\n(saved to results/SUMMARY.md)`)
