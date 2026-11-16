// GET /api/closure?k=<kind>&v=A|B&mode=ref|read
// A 'use cache' function defined INSIDE a handler captures outer variables.
// Captured values are passed to the cache the same way arguments are.
//  mode=ref   -> the cached function only mentions the captured value
//  mode=read  -> the cached function reads typeof / constructor.name of it

class Widget {
  constructor(n) {
    this.n = n
  }
}

const MAKE = {
  cls: v => new Widget(v),
  fn: v => () => v,
  re: v => new RegExp(v),
  symlocal: v => Symbol(v),
  symreg: v => Symbol.for(v),
  url: v => new URL('http://x.test/' + v),
  date: v => new Date(v === 'A' ? 1000 : 2000),
  map: v => new Map([[v, 1]]),
  set: v => new Set([v]),
  plain: v => ({ v }),
}

export async function GET(req) {
  const p = new URL(req.url).searchParams
  const k = p.get('k')
  const v = p.get('v') === 'B' ? 'B' : 'A'
  const mode = p.get('mode') === 'read' ? 'read' : 'ref'
  if (!MAKE[k]) return Response.json({ error: 'unknown kind' }, { status: 404 })
  const val = MAKE[k](v)

  async function inner() {
    'use cache'
    const fill = Math.random().toString(36).slice(2, 8)
    if (mode === 'read') {
      return { fill, seen: typeof val + ':' + (val && val.constructor && val.constructor.name) }
    }
    val // only mention the captured value
    return { fill }
  }

  try {
    return Response.json(await inner())
  } catch (e) {
    return Response.json({ error: String((e && e.message) || e).slice(0, 300) }, { status: 500 })
  }
}
