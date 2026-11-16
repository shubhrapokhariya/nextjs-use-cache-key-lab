// Used only by `npm run keys`: same as next.config.js plus a handler that records cache keys.
module.exports = {
  cacheComponents: true,
  cacheHandlers: { default: require.resolve('./keylog-handler.cjs') },
}
