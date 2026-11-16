import { inspectUpload, describeBytes } from '../../lib/cached'

// GET /api/demo?name=alice.pdf            -> inspectUpload(new File(<32 bytes of 7>, name))
// GET /api/demo?bytes=61,62,63            -> describeBytes(Uint8Array.from([61,62,63]))
export async function GET(req) {
  const p = new URL(req.url).searchParams
  try {
    if (p.get('bytes')) {
      const arr = Uint8Array.from(p.get('bytes').split(',').map(Number))
      return Response.json(await describeBytes(arr))
    }
    const file = new File([new Uint8Array(32).fill(7)], p.get('name') || 'a.bin', { type: p.get('type') || '' })
    return Response.json(await inspectUpload(file))
  } catch (e) {
    return Response.json({ error: String((e && e.message) || e).slice(0, 300) }, { status: 500 })
  }
}
