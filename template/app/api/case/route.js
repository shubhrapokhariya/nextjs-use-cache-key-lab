import { CASES } from '../../lib/cases'
import { describe } from '../../lib/describe'
import { echo, ignore } from '../../lib/cached'

// GET /api/case?c=<id>&v=A|B[&mode=expected]
//  default        -> calls the CACHED function with the value
//  mode=expected  -> describes the value WITHOUT the cache (what the function should see)
export async function GET(req) {
  const p = new URL(req.url).searchParams
  const c = CASES.find(x => x.id === p.get('c'))
  const v = p.get('v') === 'B' ? 'B' : 'A'
  const mode = p.get('mode') || 'cached'
  if (!c) return Response.json({ error: 'unknown case' }, { status: 404 })
  try {
    const arg = c.make(v)
    // opaque values are never read by the cached function, so its "expected" output is constant
    if (mode === 'expected') return Response.json({ seen: c.fn === 'ignore' ? 'not read' : await describe(arg) })
    const fn = c.fn === 'ignore' ? ignore : echo
    return Response.json(await fn(arg))
  } catch (e) {
    return Response.json({ error: String((e && e.message) || e).slice(0, 300) }, { status: 500 })
  }
}
