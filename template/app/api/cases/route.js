import { CASES } from "../../lib/cases";

// GET /api/cases -> the list of test cases (the harness also uses it as a readiness check)
export async function GET(req) {
  void req.url; // read the request so this route is rendered per request
  return Response.json({
    cases: CASES.map(({ id, group, desc, fn }) => ({
      id,
      group,
      desc,
      fn: fn || "echo",
    })),
  });
}
