#!/usr/bin/env node
// Orchestrator. For each Next.js version it installs a throwaway app from ./template,
// builds it, starts `next start` on 127.0.0.1, runs the experiments over HTTP, and writes
// results/next-<version>__node-<version>.json.
//
//   node run.mjs --versions=16.4.4,16.4.5      which Next.js versions to test
//   node run.mjs --only=cases,limits           which experiments to run (default: all)
//                                              cases | closure | limits | demo | action | workaround
//   node run.mjs --only=keys                   the key-logging experiment. It runs on its own because
//                                              it builds with a custom cache handler (next.config.keys.js)
//   node run.mjs --only=limits --warm          size limit: cold vs warmed-up process
//   node run.mjs --only=limits --stack=500,984,2000   size limit under different V8 stack sizes
//
// Each experiment is a run*() function below. Results are merged into the JSON file of the same
// Next.js/Node pair, so re-running one experiment does not erase the others.

import { spawn, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import net from 'node:net'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const WORK = path.join(ROOT, '.work')
const RESULTS = path.join(ROOT, 'results')
const isWin = process.platform === 'win32'

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=')
    return [k, v ?? true]
  })
)
const VERSIONS = String(args.versions || '16.4.4,16.4.5,16.4.6').split(',').map(s => s.trim()).filter(Boolean)
const ONLY = String(args.only || 'all')
const STACKS = args.stack ? String(args.stack).split(',').map(Number).filter(Boolean) : []
const WARM = Boolean(args.warm)
const want = part => ONLY === 'all' || ONLY.split(',').includes(part)

fs.mkdirSync(WORK, { recursive: true })
fs.mkdirSync(RESULTS, { recursive: true })

const sleep = ms => new Promise(r => setTimeout(r, ms))
const log = (...a) => console.log(...a)

// ---------- project setup ----------
const nextBin = dir => path.join(dir, 'node_modules', 'next', 'dist', 'bin', 'next')
const installedVersion = dir => {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, 'node_modules', 'next', 'package.json'), 'utf8')).version
  } catch {
    return null
  }
}

function ensureProject(ver, configFile = 'next.config.js') {
  const dir = path.join(WORK, `next-${ver}`)
  fs.mkdirSync(dir, { recursive: true })
  if (installedVersion(dir) !== ver) {
    fs.writeFileSync(
      path.join(dir, 'package.json'),
      JSON.stringify({ name: `lab-${ver}`, private: true, dependencies: { next: ver, react: '19.2.0', 'react-dom': '19.2.0' } }, null, 2)
    )
    log(`  installing next@${ver} (first time only, can take a minute or two)...`)
    const r = spawnSync(isWin ? 'npm.cmd' : 'npm', ['install', '--no-audit', '--no-fund', '--loglevel=error'], {
      cwd: dir,
      stdio: 'inherit',
      shell: isWin,
    })
    if (r.status !== 0 || installedVersion(dir) !== ver) throw new Error(`npm install failed for next@${ver}`)
  }
  // always refresh the app from the template so edits are picked up
  fs.rmSync(path.join(dir, 'app'), { recursive: true, force: true })
  fs.cpSync(path.join(ROOT, 'template', 'app'), path.join(dir, 'app'), { recursive: true })
  fs.copyFileSync(path.join(ROOT, 'template', configFile), path.join(dir, 'next.config.js'))
  fs.copyFileSync(path.join(ROOT, 'template', 'keylog-handler.cjs'), path.join(dir, 'keylog-handler.cjs'))
  return dir
}

function build(dir) {
  fs.rmSync(path.join(dir, '.next'), { recursive: true, force: true })
  const fd = fs.openSync(path.join(dir, 'build.log'), 'w')
  const r = spawnSync(process.execPath, [nextBin(dir), 'build'], {
    cwd: dir,
    stdio: ['ignore', fd, fd],
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
  })
  fs.closeSync(fd)
  // Judge the build by its output, not the exit code: some versions print a notice and exit non-zero.
  if (!fs.existsSync(path.join(dir, '.next', 'BUILD_ID'))) {
    throw new Error(`build failed (see ${path.join(dir, 'build.log')})`)
  }
  return r.status
}

// ---------- server control ----------
function freePort() {
  return new Promise((resolve, reject) => {
    const s = net.createServer()
    s.on('error', reject)
    s.listen(0, '127.0.0.1', () => {
      const p = s.address().port
      s.close(() => resolve(p))
    })
  })
}

function killTree(child) {
  try {
    if (isWin) spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'])
    else process.kill(-child.pid, 'SIGKILL')
  } catch {}
}

async function startServer(dir, nodeArgs = []) {
  const port = await freePort()
  const out = { text: '' }
  const child = spawn(process.execPath, [...nodeArgs, nextBin(dir), 'start', '-p', String(port), '-H', '127.0.0.1'], {
    cwd: dir,
    detached: !isWin,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  child.stdout.on('data', d => (out.text += d))
  child.stderr.on('data', d => (out.text += d))
  const base = `http://127.0.0.1:${port}`
  for (let i = 0; i < 90; i++) {
    try {
      const r = await fetch(base + '/api/cases', { signal: AbortSignal.timeout(3000) })
      if (r.ok) return { child, base, out }
    } catch {}
    await sleep(500)
  }
  killTree(child)
  throw new Error('server did not start:\n' + out.text.slice(-800))
}

async function get(srv, p) {
  const mark = srv.out.text.length
  let status = 0
  let body
  try {
    const r = await fetch(srv.base + p, { signal: AbortSignal.timeout(60000) })
    status = r.status
    const text = await r.text()
    try {
      body = JSON.parse(text)
    } catch {
      body = { error: text.slice(0, 200) }
    }
  } catch (e) {
    body = { error: String(e) }
  }
  if (status !== 200) await sleep(60) // give the server log a moment to flush
  return { status, body, serverLog: srv.out.text.slice(mark) }
}

const firstServerError = text => {
  const m = text.match(/^.*Error:.*$/m)
  return m ? m[0].trim().slice(0, 220) : ''
}

// ---------- experiment 1: key cases ----------
async function runCases(srv) {
  const list = (await get(srv, '/api/cases')).body.cases
  const out = []
  for (const c of list) {
    const q = v => `/api/case?c=${encodeURIComponent(c.id)}&v=${v}`
    const a1 = await get(srv, q('A'))
    const a2 = await get(srv, q('A'))
    const b = await get(srv, q('B'))
    const exp = await get(srv, q('B') + '&mode=expected')

    const row = { id: c.id, group: c.group, desc: c.desc }
    const bad = [['A', a1], ['A2', a2], ['B', b]].find(([, x]) => x.status !== 200)
    if (bad) {
      row.status = 'ERROR'
      row.errorOn = bad[0]
      row.error = bad[1].body.error || ''
      row.serverError = firstServerError(bad[1].serverLog)
    } else if (a1.body.fill !== a2.body.fill) {
      row.status = 'NO-CACHE'
    } else if (b.body.fill !== a1.body.fill) {
      row.status = 'SEPARATE'
    } else {
      // B reused A's entry. Did B receive output computed for a DIFFERENT input?
      row.status = b.body.seen === exp.body.seen ? 'SHARED' : 'SHARED-WRONG'
    }
    const clip = t => (typeof t === 'string' && t.length > 300 ? t.slice(0, 300) + `... (${t.length} chars)` : t)
    row.aSeen = clip(a1.body.seen)
    row.bSeen = clip(b.body.seen)
    row.bShouldSee = clip(exp.body.seen)
    out.push(row)
    log(`    ${row.status.padEnd(12)} ${c.id}`)
  }
  return out
}

// ---------- experiment 2: closures ----------
async function runClosure(srv) {
  const kinds = ['cls', 'fn', 're', 'symlocal', 'symreg', 'url', 'date', 'map', 'set', 'plain']
  const out = []
  for (const mode of ['ref', 'read']) {
    for (const k of kinds) {
      const a = await get(srv, `/api/closure?k=${k}&v=A&mode=${mode}`)
      const b = await get(srv, `/api/closure?k=${k}&v=B&mode=${mode}`)
      const row = { kind: k, mode }
      if (a.status !== 200 || b.status !== 200) {
        const bad = a.status !== 200 ? a : b
        row.status = 'ERROR'
        row.error = (bad.body.error || '').slice(0, 160)
        row.serverError = firstServerError(bad.serverLog)
      } else {
        row.status = a.body.fill === b.body.fill ? 'SHARED' : 'SEPARATE'
        row.seen = a.body.seen
      }
      out.push(row)
      log(`    ${row.status.padEnd(9)} ${mode.padEnd(5)} ${k}`)
    }
  }
  return out
}

// ---------- experiment 3: size limits ----------
const LIMIT_SPECS = {
  u8: { hi: 1_000_000, unit: 'bytes', perEl: 1 },
  u16: { hi: 500_000, unit: 'elements', perEl: 2 },
  f64: { hi: 200_000, unit: 'elements', perEl: 8 },
  buf: { hi: 4_000_000, unit: 'bytes', perEl: 1 },
  str: { hi: 4_000_000, unit: 'characters', perEl: 1 },
  blob: { hi: 1_000_000, unit: 'bytes', perEl: 1 },
}
const probe = async (srv, kind, n) => (await get(srv, `/api/limit?kind=${kind}&n=${n}`)).status === 200

async function bisect(srv, kind, hi, lo = 1000) {
  if (!(await probe(srv, kind, lo))) return { maxOk: null, note: `failed already at ${lo}` }
  if (await probe(srv, kind, hi)) return { maxOk: hi, note: `no failure up to ${hi}` }
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2)
    if (await probe(srv, kind, mid)) lo = mid
    else hi = mid
  }
  return { maxOk: lo, firstFail: hi }
}

async function runLimits(srv) {
  const out = {}
  for (const [kind, spec] of Object.entries(LIMIT_SPECS)) {
    const r = await bisect(srv, kind, spec.hi)
    r.unit = spec.unit
    if (r.maxOk) r.approxBytes = r.maxOk * spec.perEl
    out[kind] = r
    log(`    ${kind.padEnd(5)} max OK = ${r.maxOk} ${spec.unit}${r.firstFail ? ` (first failure ${r.firstFail})` : ''}`)
  }
  return out
}

async function runWarm(dir, firstFail) {
  const srv = await startServer(dir)
  try {
    const cold = await probe(srv, 'u8', firstFail)
    for (let i = 1; i <= 300; i++) await get(srv, `/api/limit?kind=u8&n=${1000 + i}`)
    const warm = await probe(srv, 'u8', firstFail)
    const warmMax = await bisect(srv, 'u8', firstFail * 2, firstFail - 1)
    return { probedBytes: firstFail, coldFreshProcess: cold ? 'OK' : 'FAIL', afterWarmup300: warm ? 'OK' : 'FAIL', warmMaxOk: warmMax.maxOk }
  } finally {
    killTree(srv.child)
  }
}

async function runStacks(dir) {
  const out = []
  for (const s of STACKS) {
    let srv
    try {
      srv = await startServer(dir, [`--stack-size=${s}`])
      const r = await bisect(srv, 'u8', 4_000_000)
      out.push({ stackSizeKB: s, maxOkBytes: r.maxOk, firstFail: r.firstFail })
      log(`    --stack-size=${s}: max OK = ${r.maxOk} bytes`)
    } catch (e) {
      out.push({ stackSizeKB: s, error: String(e).slice(0, 200) })
      log(`    --stack-size=${s}: ${String(e).slice(0, 120)}`)
    } finally {
      if (srv) killTree(srv.child)
      await sleep(500)
    }
  }
  return out
}

// ---------- experiment 4: the article's demos ----------
async function runDemo(srv) {
  const calls = [
    ['File alice.pdf (32 bytes of 7)', '/api/demo?name=alice.pdf'],
    ['File bob.pdf   (SAME 32 bytes)', '/api/demo?name=bob.pdf'],
    ['Uint8Array [61,62,63]', '/api/demo?bytes=61,62,63'],
    ['Uint8Array [61,62,63,0] (one extra zero byte)', '/api/demo?bytes=61,62,63,0'],
  ]
  const out = []
  for (const [label, p] of calls) {
    const r = await get(srv, p)
    out.push({ label, status: r.status, body: r.body })
    log(`    ${label.padEnd(48)} -> ${JSON.stringify(r.body)}`)
  }
  return out
}


// ---------- experiment 5: the real cache keys (needs a logging cache handler) ----------
function readKeyLog(file) {
  if (!fs.existsSync(file)) return []
  return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l))
}
// Show a key readably: escape control characters, clip the middle of long keys.
function showKey(k) {
  const esc = JSON.stringify(k).slice(1, -1)
  return esc.length > 260 ? esc.slice(0, 150) + ' ...[' + (esc.length - 230) + ' more]... ' + esc.slice(-80) : esc
}
async function runKeys(srv, logFile) {
  const calls = [
    ['File alice.pdf', '/api/demo?name=alice.pdf'],
    ['File bob.pdf (same bytes)', '/api/demo?name=bob.pdf'],
    ['Uint8Array [61,62,63]', '/api/demo?bytes=61,62,63'],
    ['Uint8Array [61,62,63,0]', '/api/demo?bytes=61,62,63,0'],
  ]
  fs.rmSync(logFile, { force: true })
  const out = []
  for (const [label, p] of calls) {
    const before = readKeyLog(logFile).length
    const r = await get(srv, p)
    await sleep(300)
    const lines = readKeyLog(logFile).slice(before)
    const getLine = lines.find(l => l.op === 'get')
    out.push({ label, status: r.status, body: r.body, key: getLine?.key ?? null, hit: getLine?.hit ?? null })
    log(`    ${label}`)
    log(`      cache ${getLine ? (getLine.hit ? 'HIT ' : 'miss') : 'no get recorded'}   key (${getLine?.keyLength ?? '?'} chars): ${getLine ? showKey(getLine.key) : '-'}`)
  }
  const same = (a, b) => out[a].key !== null && out[a].key === out[b].key
  const verdict = {
    fileNamesGiveSameKey: same(0, 1),
    trailingZeroGivesSameKey: same(2, 3),
  }
  log(`    -> alice.pdf and bob.pdf have ${verdict.fileNamesGiveSameKey ? 'the SAME key' : 'different keys'}`)
  log(`    -> [61,62,63] and [61,62,63,0] have ${verdict.trailingZeroGivesSameKey ? 'the SAME key' : 'different keys'}`)
  return { calls: out, verdict }
}

// ---------- experiment 6: a File from a real form upload via a Server Action ----------
const readLast = async srv => (await fetch(srv.base + `/api/last?t=${Date.now()}${Math.random()}`)).json()

// Posts one upload. The Server Action increments a run counter, so we only accept the result
// if the counter went up by exactly one for THIS post. A failed post can never be mistaken for the previous result.
async function postUpload(srv, actionField, bytes, name, type = '', lastModified = undefined) {
  const before = (await readLast(srv)).runs
  const fd = new FormData()
  fd.set(actionField, '')
  fd.set('file', new File([bytes], name, lastModified === undefined ? { type } : { type, lastModified }))
  let status = 0
  try {
    status = (await fetch(srv.base + '/action-test', { method: 'POST', body: fd, signal: AbortSignal.timeout(20000) })).status
  } catch {}
  let after = await readLast(srv)
  for (let i = 0; i < 10 && after.runs === before; i++) {
    await sleep(200)
    after = await readLast(srv)
  }
  const ran = after.runs === before + 1 && after.last && after.last.run === after.runs
  return { status, ran, last: ran ? after.last : null }
}

async function runAction(srv) {
  const html = await (await fetch(srv.base + '/action-test')).text()
  const m = html.match(/name="(\$ACTION_ID_[^"]+)"/)
  if (!m) throw new Error('could not find the Server Action id in /action-test (page changed?)')
  const field = m[1]

  // Canary: a post with a bogus action id must NOT run the action. This proves the run counter detects a post that did nothing.
  const canary = await postUpload(srv, '$ACTION_ID_deadbeef00000000000000000000000000000000', new Uint8Array(4), 'canary.bin')
  if (canary.ran) {
    log('    -> ERROR: the canary post ran the action, so run detection is not reliable here. Result is NOT valid.')
    return { calls: [], verdict: { valid: false, reason: 'canary ran' } }
  }
  log('    canary: a post with a bogus action id did not run the action (run detection works)')

  const seven = new Uint8Array(32).fill(7)
  const calls = [
    ['form File alice.pdf (32 bytes of 7)', seven, 'alice.pdf'],
    ['form File bob.pdf   (SAME 32 bytes)', seven, 'bob.pdf'],
    ['form File z.bin [81,82,83]', Uint8Array.from([81, 82, 83]), 'z.bin'],
    ['form File z.bin [81,82,83,0] (one extra zero)', Uint8Array.from([81, 82, 83, 0]), 'z.bin'],
  ]
  const out = []
  for (const [label, bytes, name] of calls) {
    const r = await postUpload(srv, field, bytes, name)
    out.push({ label, status: r.status, ran: r.ran, result: r.last })
    const l = r.last
    log(`    ${label.padEnd(48)} -> ${r.ran && l && l.ok ? `name=${l.name} size=${l.size} filledAt=${l.filledAt} isFile=${l.isFile}` : `NO VALID RESULT (http ${r.status}, ran=${r.ran}) ${JSON.stringify(l)}`}`)
  }
  // What does the action see as lastModified for a form upload? Send 1000, read back what arrived.
  const lm = await postUpload(srv, field, new Uint8Array(8).fill(9), 'lm.bin', '', 1000)
  const lmProbe = lm.status > 0 && lm.status < 400 && lm.ran && lm.last && lm.last.ok === true && lm.last.isFile === true ? { sent: 1000, seen: lm.last.seenLastModified, serverNow: Date.now() } : null
  log(`    lastModified probe: sent 1000, the Server Action saw ${lmProbe ? lmProbe.seen : 'nothing'} (server time now ~${lmProbe ? lmProbe.serverNow : '?'})`)
  const good = i => out[i].status > 0 && out[i].status < 400 && out[i].ran && out[i].result && out[i].result.ok && out[i].result.isFile === true
  if (![0, 1, 2, 3].every(good)) {
    log('    -> ERROR: at least one upload failed, did not run the action, or did not arrive as a File. Result is NOT valid.')
    return { calls: out, verdict: { valid: false } }
  }
  const verdict = {
    valid: true,
    bobGotAlice: out[1].result.name === 'alice.pdf',
    trailingZeroGotShortFile: out[3].result.size === 3,
  }
  log(`    -> via a Server Action: bob.pdf ${verdict.bobGotAlice ? "GOT alice.pdf's result (wrong)" : 'got its own result'}; the 4-byte file ${verdict.trailingZeroGotShortFile ? 'GOT the 3-byte result (wrong)' : 'got its own result'}`)
  return { calls: out, verdict, lastModifiedProbe: lmProbe }
}

// ---------- experiment 7: does passing the metadata as separate arguments fix it? ----------
async function runWorkaround(srv) {
  const cases = [
    ['name', 'File name alice.pdf vs bob.pdf (same bytes)'],
    ['type', 'File type text/a vs text/b (same bytes)'],
    ['size', 'bytes [x,x,x] vs [x,x,x,0] (3 vs 4 bytes)'],
    ['lastmod', 'File lastModified 1000 vs 2000'],
  ]
  const out = []
  const LABEL = { 0: 'File only (control)', 2: 'File + name, type, size as separate arguments (no lastModified)', 1: 'File + name, type, size, lastModified as separate arguments' }
  for (const meta of [0, 2, 1]) {
    log(`    ${LABEL[meta]}:`)
    for (const [c, desc] of cases) {
      const q = v => `/api/workaround?c=${c}&v=${v}&meta=${meta}`
      const a1 = await get(srv, q('A'))
      const a2 = await get(srv, q('A'))
      const b = await get(srv, q('B'))
      let status
      if (a1.status !== 200 || a2.status !== 200 || b.status !== 200) status = 'ERROR'
      else if (a1.body.fill !== a2.body.fill) status = 'NO-CACHE'
      else status = b.body.fill === a1.body.fill ? 'SHARED-WRONG' : 'SEPARATE'
      out.push({ meta, case: c, desc, status })
      log(`      ${status.padEnd(13)} ${desc}`)
    }
  }
  return out
}

// ---------- main ----------
async function main() {
  log(`Node ${process.version} on ${process.platform}/${process.arch}`)
  log(`Versions: ${VERSIONS.join(', ')}   experiments: ${ONLY}`)
  for (const ver of VERSIONS) {
    log(`\n=== next@${ver} ===`)
    const dir = ensureProject(ver, ONLY === 'keys' ? 'next.config.keys.js' : 'next.config.js')
    const keyLog = path.join(dir, 'keys.jsonl')
    process.env.KEYLOG_FILE = keyLog
    const buildExit = build(dir)
    const srv = await startServer(dir)
    const result = {
      meta: {
        next: installedVersion(dir),
        node: process.versions.node,
        platform: `${process.platform}/${process.arch}`,
        cpus: os.cpus().length,
        date: new Date().toISOString(),
        buildExitCode: buildExit,
      },
    }
    try {
      if (want('cases')) {
        log('  key cases:')
        result.cases = await runCases(srv)
        result.meta.caseCount = result.cases.length
      }
      if (want('closure')) {
        log('  closures:')
        result.closure = await runClosure(srv)
      }
      if (want('limits')) {
        log('  size limits (this takes a little while):')
        result.limits = await runLimits(srv)
      }
      if (want('demo')) {
        log('  article demos:')
        result.demo = await runDemo(srv)
      }
      if (want('action')) {
        log('  Server Action with a form-uploaded File:')
        result.action = await runAction(srv)
      }
      if (want('workaround')) {
        log('  workaround check (metadata as separate arguments):')
        result.workaround = await runWorkaround(srv)
      }
      if (ONLY === 'keys') {
        log('  real cache keys (custom logging cache handler):')
        result.keys = await runKeys(srv, keyLog)
      }
    } finally {
      killTree(srv.child)
      await sleep(500)
    }
    if (want('limits') && WARM && result.limits?.u8?.firstFail) {
      log('  warm-up experiment:')
      result.warm = await runWarm(dir, result.limits.u8.firstFail)
      log('   ', JSON.stringify(result.warm))
    }
    if (want('limits') && STACKS.length) {
      log('  stack-size experiment:')
      result.stack = await runStacks(dir)
    }
    const file = path.join(RESULTS, `next-${ver}__node-${process.versions.node}.json`)
    // Merge with an earlier run of the same next/node pair, so re-running one experiment
    // (e.g. `--only=limits`) does not delete the others.
    let merged = result
    if (fs.existsSync(file)) {
      try {
        merged = { ...JSON.parse(fs.readFileSync(file, 'utf8')), ...result, meta: { ...result.meta } }
      } catch {}
    }
    fs.writeFileSync(file, JSON.stringify(merged, null, 2))
    log(`  saved ${path.relative(ROOT, file)}`)
  }
  log('\nDone. Now run:  npm run summarize')
}

main().catch(e => {
  console.error('\nFAILED:', e.message)
  process.exit(1)
})
