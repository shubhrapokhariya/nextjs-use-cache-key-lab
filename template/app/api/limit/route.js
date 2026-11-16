import { size } from '../../lib/cached'

// GET /api/limit?kind=u8|u16|f64|buf|str|blob&n=<count>
// Passes a value of n elements/bytes/characters to a cached function that does nothing.
const MAKE = {
  u8: n => new Uint8Array(n).fill(1),
  u16: n => new Uint16Array(n).fill(1),
  f64: n => new Float64Array(n).fill(1),
  buf: n => Buffer.alloc(n, 1),
  str: n => 'a'.repeat(n),
  blob: n => new Blob([new Uint8Array(n).fill(1)]),
}

export async function GET(req) {
  const p = new URL(req.url).searchParams
  const kind = p.get('kind')
  const n = Number(p.get('n'))
  if (!MAKE[kind] || !Number.isFinite(n) || n < 0) return Response.json({ error: 'bad params' }, { status: 400 })
  try {
    await size(MAKE[kind](n))
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: String((e && e.message) || e).slice(0, 300), stack: String((e && e.stack) || '').split('\n').slice(0, 10) }, { status: 500 })
  }
}
