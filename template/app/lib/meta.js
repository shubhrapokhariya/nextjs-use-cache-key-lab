'use cache'

// Like inspectUpload, but the caller may pass the metadata as extra primitive arguments.
// `fill` is random per execution: equal `fill` values mean the same cache entry.
export async function withMeta(file, name, type, size, lastModified) {
  return {
    fill: Math.random().toString(36).slice(2, 8),
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    fileLastModified: file.lastModified,
  }
}
