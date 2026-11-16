// Describes whatever value a cached function received, as a plain string.
// This file is NOT a 'use cache' file: it is used both inside the cached function
// (to show what the function actually saw) and outside it (to compute what the
// function SHOULD have seen for a given input).

export async function describe(a) {
  try {
    if (a === null) return 'null'
    const t = typeof a
    if (t === 'undefined') return 'undefined'
    if (t !== 'object') return `${t}:${String(a)}`

    const tag = Object.prototype.toString.call(a).slice(8, -1)
    const ctor = (a.constructor && a.constructor.name) || 'NullProto'

    if (tag === 'Blob' || tag === 'File') {
      const bytes = new Uint8Array(await a.arrayBuffer())
      return (
        `${tag} size=${a.size} type=${JSON.stringify(a.type)} ` +
        `name=${'name' in a ? JSON.stringify(a.name) : '-'} ` +
        `lastModified=${'lastModified' in a ? a.lastModified : '-'} ` +
        `head=[${Array.from(bytes.slice(0, 4))}] tail=[${Array.from(bytes.slice(-2))}]`
      )
    }
    if (tag === 'ArrayBuffer') {
      const u = new Uint8Array(a)
      return `ArrayBuffer byteLength=${a.byteLength} head=[${Array.from(u.slice(0, 4))}] tail=[${Array.from(u.slice(-2))}]`
    }
    if (ArrayBuffer.isView(a)) {
      const u = new Uint8Array(a.buffer, a.byteOffset, a.byteLength)
      return (
        `${ctor} length=${a.length} byteLength=${a.byteLength} ` +
        `head=[${Array.from(u.slice(0, 4))}] tail=[${Array.from(u.slice(-2))}]`
      )
    }
    if (tag === 'Date') return `Date ${a.getTime()}`
    if (tag === 'Map') return `Map ${JSON.stringify([...a.entries()])}`
    if (tag === 'Set') return `Set ${JSON.stringify([...a])}`
    if (tag === 'FormData') return `FormData ${JSON.stringify([...a.entries()])}`
    if (Array.isArray(a)) return `Array json=${JSON.stringify(a)} keys=${Object.keys(a).join(',')}`

    const proto = Object.getPrototypeOf(a) === null ? 'NullProto' : ctor
    let extra = ''
    if ('x' in a && 'y' in a) extra = ` x===y:${a.x === a.y}`
    return `${proto} keys=${Object.keys(a).join(',')} json=${JSON.stringify(a)}${extra}`
  } catch (e) {
    return 'read threw: ' + String((e && e.message) || e).slice(0, 90)
  }
}
