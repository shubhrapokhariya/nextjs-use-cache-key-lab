import { withMeta } from '../../lib/meta'

// GET /api/workaround?c=name|type|size|lastmod&v=A|B&meta=0|1|2
// meta=0 passes only the File.
// meta=2 also passes name, type and size as separate arguments (NOT lastModified).
// meta=1 passes name, type, size and lastModified as separate arguments.
const SEED = { name: 11, type: 12, size: 13, lastmod: 14 }

function make(c, v, meta) {
  const fill = SEED[c] + meta * 10 // unique bytes per case so cases cannot hit each other's entries
  const A = v === 'A'
  // lastModified is pinned: a File built without it gets Date.now(), which would make every call a new key once we pass it as an argument.
  if (c === 'name') return new File([new Uint8Array(16).fill(fill)], A ? 'alice.pdf' : 'bob.pdf', { lastModified: 5000 })
  if (c === 'type') return new File([new Uint8Array(16).fill(fill)], 'same.bin', { type: A ? 'text/a' : 'text/b', lastModified: 5000 })
  if (c === 'size') return new File([Uint8Array.from(A ? [fill, fill, fill] : [fill, fill, fill, 0])], 'same.bin', { lastModified: 5000 })
  if (c === 'lastmod') return new File([new Uint8Array(16).fill(fill)], 'same.bin', { lastModified: A ? 1000 : 2000 })
  throw new Error('unknown case')
}

export async function GET(req) {
  const p = new URL(req.url).searchParams
  const c = p.get('c')
  const v = p.get('v')
  const meta = Number(p.get('meta') || 0)
  try {
    const f = make(c, v, meta)
    const r = meta === 1 ? await withMeta(f, f.name, f.type, f.size, f.lastModified) : meta === 2 ? await withMeta(f, f.name, f.type, f.size) : await withMeta(f)
    return Response.json(r)
  } catch (e) {
    return Response.json({ error: String((e && e.message) || e).slice(0, 300) }, { status: 500 })
  }
}
