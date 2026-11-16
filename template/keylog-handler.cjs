// A cache handler that behaves exactly like Next.js's own default in-memory handler,
// and additionally records every cache key it is asked for.
// Used only by `npm run keys`. It changes nothing about what gets cached.
// NOTE: `next/dist/...` is an internal path, not public API. It exists in the 16.4.x versions this
// lab tests and may move in other releases.
const fs = require("fs");
const path = require("path");
const {
  createDefaultCacheHandler,
} = require("next/dist/server/lib/cache-handlers/default.js");

const inner = createDefaultCacheHandler(50 * 1024 * 1024);
const file = process.env.KEYLOG_FILE || path.join(process.cwd(), "keys.jsonl");

function record(op, cacheKey, extra) {
  const key = typeof cacheKey === "string" ? cacheKey : String(cacheKey);
  try {
    fs.appendFileSync(
      file,
      JSON.stringify({ op, keyLength: key.length, key, ...extra }) + "\n",
    );
  } catch {}
}

module.exports = {
  async get(cacheKey, ...rest) {
    const result = await inner.get(cacheKey, ...rest);
    record("get", cacheKey, { hit: Boolean(result) });
    return result;
  },
  async set(cacheKey, ...rest) {
    record("set", cacheKey, {});
    return inner.set(cacheKey, ...rest);
  },
  refreshTags: (...a) => inner.refreshTags(...a),
  getExpiration: (...a) => inner.getExpiration(...a),
  updateTags: (...a) => inner.updateTags(...a),
};
