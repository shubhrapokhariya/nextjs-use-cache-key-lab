// GET /api/last?t=<anything> -> how many times the Server Action has run, and its most recent result
export async function GET(req) {
  new URL(req.url).searchParams.get('t') // read the request so this route stays dynamic
  return Response.json({ runs: globalThis.__actionRuns ?? 0, last: globalThis.__lastAction ?? null })
}
