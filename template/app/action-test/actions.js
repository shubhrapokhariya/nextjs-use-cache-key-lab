'use server'
import { inspectUpload } from '../lib/cached'

// Receives a File from a real <form> upload and passes it to a 'use cache' function.
// A run counter proves the action actually executed for each upload, so a failed POST can
// never be mistaken for the previous call's result.
export async function upload(formData) {
  const run = (globalThis.__actionRuns = (globalThis.__actionRuns ?? 0) + 1)
  const file = formData.get('file')
  try {
    const r = await inspectUpload(file)
    globalThis.__lastAction = { run, ok: true, isFile: file instanceof File, seenLastModified: file.lastModified, ...r }
  } catch (e) {
    globalThis.__lastAction = { run, ok: false, error: String((e && e.message) || e).slice(0, 300) }
  }
}
