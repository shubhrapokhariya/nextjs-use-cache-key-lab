# use cache key lab: results

| run | next | node | platform | date |
|---|---|---|---|---|
| 16.0.0 / node 22.23.4 | 16.0.0 | 22.23.4 | linux/x64 | 2026-11-13 |
| 16.1.0 / node 22.23.4 | 16.1.0 | 22.23.4 | linux/x64 | 2026-11-13 |
| 16.1.7 / node 22.23.4 | 16.1.7 | 22.23.4 | linux/x64 | 2026-11-13 |
| 16.2.0 / node 22.23.4 | 16.2.0 | 22.23.4 | linux/x64 | 2026-11-13 |
| 16.2.12 / node 22.23.4 | 16.2.12 | 22.23.4 | linux/x64 | 2026-11-13 |
| 16.3.0 / node 22.23.4 | 16.3.0 | 22.23.4 | linux/x64 | 2026-11-13 |
| 16.3.8 / node 22.23.4 | 16.3.8 | 22.23.4 | linux/x64 | 2026-11-13 |
| 16.4.0 / node 22.23.4 | 16.4.0 | 22.23.4 | linux/x64 | 2026-11-13 |
| 16.4.3 / node 22.23.4 | 16.4.3 | 22.23.4 | linux/x64 | 2026-11-13 |
| 16.4.4 / node 20.20.2 | 16.4.4 | 20.20.2 | linux/x64 | 2026-11-13 |
| 16.4.4 / node 22.23.4 | 16.4.4 | 22.23.4 | linux/x64 | 2026-11-13 |
| 16.4.4 / node 24.22.3 | 16.4.4 | 24.22.3 | linux/x64 | 2026-11-13 |
| 16.4.5 / node 22.23.4 | 16.4.5 | 22.23.4 | linux/x64 | 2026-11-13 |
| 16.4.6 / node 20.20.2 | 16.4.6 | 20.20.2 | linux/x64 | 2026-11-13 |
| 16.4.6 / node 22.23.4 | 16.4.6 | 22.23.4 | linux/x64 | 2026-11-13 |
| 16.4.6 / node 24.22.3 | 16.4.6 | 24.22.3 | linux/x64 | 2026-11-13 |

**Legend**: `SEPARATE` = own cache entry. `SHARED` = reused the first caller's entry (output identical to what the 2nd caller would have produced). `SHARED-WRONG` = reused the first caller's entry AND the 2nd caller received output computed for a different input. `ERROR` = threw. `NO-CACHE` = control call was not cached (result invalid).

## 1. Key cases (54 inputs)

| id | group | what differs | 16.0.0<br>node 22.23.4 | 16.1.0<br>node 22.23.4 | 16.1.7<br>node 22.23.4 | 16.2.0<br>node 22.23.4 | 16.2.12<br>node 22.23.4 | 16.3.0<br>node 22.23.4 | 16.3.8<br>node 22.23.4 | 16.4.0<br>node 22.23.4 | 16.4.3<br>node 22.23.4 | 16.4.4<br>node 20.20.2 | 16.4.4<br>node 22.23.4 | 16.4.4<br>node 24.22.3 | 16.4.5<br>node 22.23.4 | 16.4.6<br>node 20.20.2 | 16.4.6<br>node 22.23.4 | 16.4.6<br>node 24.22.3 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| p-string | primitive | 'a' vs 'b' | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| p-number | primitive | 1 vs 2 | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| p-neg-zero | primitive | 0 vs -0 | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| p-nan-inf | primitive | NaN vs Infinity | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| p-bigint | primitive | 1n vs 2n | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| p-bool | primitive | true vs false | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| p-null-undefined | primitive | null vs undefined | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| p-str-vs-num | primitive | '1' vs 1 | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| p-undefined-vs-string | primitive | undefined vs the string '$undefined' | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| o-value | object | {a:1} vs {a:2} | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| o-key-order | object | {a,b} vs {b,a} (same data, key order swapped) | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| o-undefined-prop | object | {a:1,b:undefined} vs {a:1} | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| o-shared-ref | object | {x:r,y:r} (one shared reference) vs {x:{..},y:{..}} (two equal copies) | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| o-nested | object | {a:{b:{c:1}}} vs {a:{b:{c:2}}} | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| o-null-proto | object | plain {a:1} vs Object.create(null) with a:1 | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| o-array-order | object | [1,2] vs [2,1] | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| o-array-hole | object | [1,<hole>,3] vs [1,undefined,3] | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED |
| o-array-vs-obj | object | [1] vs {0:1} | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| o-empty | object | {} vs [] | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| b-date | builtin | Date(1000) vs Date(2000) | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| b-map-value | builtin | Map k=1 vs Map k=2 | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| b-map-order | builtin | Map insertion order swapped | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| b-set-value | builtin | Set ['x'] vs Set ['y'] | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| b-set-order | builtin | Set insertion order swapped | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| b-formdata | builtin | FormData a=1 vs a=2 | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| b-formdata-order | builtin | FormData entry order swapped | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| b-url | builtin | URL 'http://x.test/a' vs '/b' (docs list URL as unsupported) | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| b-urlsearchparams | builtin | URLSearchParams a=1 vs a=2 | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| t-u8-bytes | typed | Uint8Array(16) filled with 1 vs 2 | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| t-u8-last-byte | typed | Uint8Array(200000) differing only in the LAST byte | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| t-u8-vs-i8 | typed | Uint8Array vs Int8Array, same bytes | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| t-u8-vs-u16 | typed | Uint8Array([1,1]) vs Uint16Array([257]), same bytes | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| t-u8-vs-arraybuffer | typed | Uint8Array vs ArrayBuffer, same bytes | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| t-u8-vs-buffer | typed | Uint8Array vs Node Buffer, same bytes | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| t-f32 | typed | Float32Array([1]) vs ([2]) | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| t-u8-trailing-zero | typed | Uint8Array([61,62,63]) (3 bytes) vs Uint8Array([61,62,63,0]) (4 bytes: same plus one trailing zero byte) | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| t-view-offset | typed | same 4 visible bytes: standalone array vs a view at offset 2 of a larger buffer | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED |
| f-blob-bytes | file | Blob: different bytes, same type | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| f-blob-type | file | Blob: same bytes, type text/a vs text/b | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| f-blob-empty-type | file | Blob: empty, type '' vs 'text/plain' | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| f-blob-last-byte | file | Blob(200000 bytes) differing only in the LAST byte | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| f-file-bytes | file | File: different bytes, same name and type | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| f-file-name | file | File: same bytes, name alice.pdf vs bob.pdf | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| f-file-type | file | File: same bytes and name, type text/a vs text/b | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| f-file-lastmod | file | File: same bytes and name, lastModified 1000 vs 2000 | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG |
| f-blob-trailing-zero | file | Blob([71,72,73]) (3 bytes) vs Blob([71,72,73,0]) (4 bytes: same plus one trailing zero byte) | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| f-file-trailing-zero | file | File([81,82,83]) (3 bytes) vs File([81,82,83,0]) (4 bytes), same name and type | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| f-blob-vs-file | file | Blob vs File with the same bytes | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SHARED-WRONG | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| x-class | opaque | class instance 1 vs 2 (function ignores it) | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED |
| x-function | opaque | () => 1 vs () => 2 (function ignores it) | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED |
| x-regexp | opaque | /a/ vs /b/ (function ignores it) | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED |
| x-symbol-local | opaque | Symbol('a') vs Symbol('b') (function ignores it) | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED |
| x-symbol-registered | opaque | Symbol.for('a') vs Symbol.for('b') (function ignores it) | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED |
| s-long-last-char | string | 100000-char string differing only in the LAST character | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |

**Totals per run**: 16.0.0: {"SEPARATE":38,"SHARED":7,"SHARED-WRONG":9} ; 16.1.0: {"SEPARATE":38,"SHARED":7,"SHARED-WRONG":9} ; 16.1.7: {"SEPARATE":38,"SHARED":7,"SHARED-WRONG":9} ; 16.2.0: {"SEPARATE":38,"SHARED":7,"SHARED-WRONG":9} ; 16.2.12: {"SEPARATE":38,"SHARED":7,"SHARED-WRONG":9} ; 16.3.0: {"SEPARATE":38,"SHARED":7,"SHARED-WRONG":9} ; 16.3.8: {"SEPARATE":38,"SHARED":7,"SHARED-WRONG":9} ; 16.4.0: {"SEPARATE":38,"SHARED":7,"SHARED-WRONG":9} ; 16.4.3: {"SEPARATE":38,"SHARED":7,"SHARED-WRONG":9} ; 16.4.4: {"SEPARATE":38,"SHARED":7,"SHARED-WRONG":9} ; 16.4.4: {"SEPARATE":38,"SHARED":7,"SHARED-WRONG":9} ; 16.4.4: {"SEPARATE":38,"SHARED":7,"SHARED-WRONG":9} ; 16.4.5: {"SEPARATE":46,"SHARED":7,"SHARED-WRONG":1} ; 16.4.6: {"SEPARATE":46,"SHARED":7,"SHARED-WRONG":1} ; 16.4.6: {"SEPARATE":46,"SHARED":7,"SHARED-WRONG":1} ; 16.4.6: {"SEPARATE":46,"SHARED":7,"SHARED-WRONG":1}

### Details for ERROR and SHARED-WRONG rows

**next 16.0.0 / node 22.23.4**

- `t-u8-trailing-zero` SHARED-WRONG: second caller received `Uint8Array length=3 byteLength=3 head=[61,62,63] tail=[62,63]` but should have seen `Uint8Array length=4 byteLength=4 head=[61,62,63,0] tail=[63,0]`
- `f-blob-type` SHARED-WRONG: second caller received `File size=16 type="text/a" name="blob" lastModified=1794547155796 head=[21,21,21,21] tail=[21,21]` but should have seen `Blob size=16 type="text/b" name=- lastModified=- head=[21,21,21,21] tail=[21,21]`
- `f-blob-empty-type` SHARED-WRONG: second caller received `File size=0 type="" name="blob" lastModified=1794547155807 head=[] tail=[]` but should have seen `Blob size=0 type="text/plain" name=- lastModified=- head=[] tail=[]`
- `f-file-name` SHARED-WRONG: second caller received `File size=16 type="" name="alice.pdf" lastModified=1794547155860 head=[22,22,22,22] tail=[22,22]` but should have seen `File size=16 type="" name="bob.pdf" lastModified=1794547155869 head=[22,22,22,22] tail=[22,22]`
- `f-file-type` SHARED-WRONG: second caller received `File size=16 type="text/a" name="same.bin" lastModified=1794547155870 head=[23,23,23,23] tail=[23,23]` but should have seen `File size=16 type="text/b" name="same.bin" lastModified=1794547155877 head=[23,23,23,23] tail=[23,23]`
- `f-file-lastmod` SHARED-WRONG: second caller received `File size=16 type="" name="same.bin" lastModified=1000 head=[24,24,24,24] tail=[24,24]` but should have seen `File size=16 type="" name="same.bin" lastModified=2000 head=[24,24,24,24] tail=[24,24]`
- `f-blob-trailing-zero` SHARED-WRONG: second caller received `File size=3 type="" name="blob" lastModified=1794547155889 head=[71,72,73] tail=[72,73]` but should have seen `Blob size=4 type="" name=- lastModified=- head=[71,72,73,0] tail=[73,0]`
- `f-file-trailing-zero` SHARED-WRONG: second caller received `File size=3 type="" name="z.bin" lastModified=1794547155898 head=[81,82,83] tail=[82,83]` but should have seen `File size=4 type="" name="z.bin" lastModified=1794547155905 head=[81,82,83,0] tail=[83,0]`
- `f-blob-vs-file` SHARED-WRONG: second caller received `File size=16 type="" name="blob" lastModified=1794547155907 head=[25,25,25,25] tail=[25,25]` but should have seen `File size=16 type="" name="x.bin" lastModified=1794547155914 head=[25,25,25,25] tail=[25,25]`

**next 16.1.0 / node 22.23.4**

- `t-u8-trailing-zero` SHARED-WRONG: second caller received `Uint8Array length=3 byteLength=3 head=[61,62,63] tail=[62,63]` but should have seen `Uint8Array length=4 byteLength=4 head=[61,62,63,0] tail=[63,0]`
- `f-blob-type` SHARED-WRONG: second caller received `File size=16 type="text/a" name="blob" lastModified=1794547162349 head=[21,21,21,21] tail=[21,21]` but should have seen `Blob size=16 type="text/b" name=- lastModified=- head=[21,21,21,21] tail=[21,21]`
- `f-blob-empty-type` SHARED-WRONG: second caller received `File size=0 type="" name="blob" lastModified=1794547162359 head=[] tail=[]` but should have seen `Blob size=0 type="text/plain" name=- lastModified=- head=[] tail=[]`
- `f-file-name` SHARED-WRONG: second caller received `File size=16 type="" name="alice.pdf" lastModified=1794547162410 head=[22,22,22,22] tail=[22,22]` but should have seen `File size=16 type="" name="bob.pdf" lastModified=1794547162419 head=[22,22,22,22] tail=[22,22]`
- `f-file-type` SHARED-WRONG: second caller received `File size=16 type="text/a" name="same.bin" lastModified=1794547162421 head=[23,23,23,23] tail=[23,23]` but should have seen `File size=16 type="text/b" name="same.bin" lastModified=1794547162428 head=[23,23,23,23] tail=[23,23]`
- `f-file-lastmod` SHARED-WRONG: second caller received `File size=16 type="" name="same.bin" lastModified=1000 head=[24,24,24,24] tail=[24,24]` but should have seen `File size=16 type="" name="same.bin" lastModified=2000 head=[24,24,24,24] tail=[24,24]`
- `f-blob-trailing-zero` SHARED-WRONG: second caller received `File size=3 type="" name="blob" lastModified=1794547162440 head=[71,72,73] tail=[72,73]` but should have seen `Blob size=4 type="" name=- lastModified=- head=[71,72,73,0] tail=[73,0]`
- `f-file-trailing-zero` SHARED-WRONG: second caller received `File size=3 type="" name="z.bin" lastModified=1794547162448 head=[81,82,83] tail=[82,83]` but should have seen `File size=4 type="" name="z.bin" lastModified=1794547162454 head=[81,82,83,0] tail=[83,0]`
- `f-blob-vs-file` SHARED-WRONG: second caller received `File size=16 type="" name="blob" lastModified=1794547162456 head=[25,25,25,25] tail=[25,25]` but should have seen `File size=16 type="" name="x.bin" lastModified=1794547162461 head=[25,25,25,25] tail=[25,25]`

**next 16.1.7 / node 22.23.4**

- `t-u8-trailing-zero` SHARED-WRONG: second caller received `Uint8Array length=3 byteLength=3 head=[61,62,63] tail=[62,63]` but should have seen `Uint8Array length=4 byteLength=4 head=[61,62,63,0] tail=[63,0]`
- `f-blob-type` SHARED-WRONG: second caller received `File size=16 type="text/a" name="blob" lastModified=1794547168742 head=[21,21,21,21] tail=[21,21]` but should have seen `Blob size=16 type="text/b" name=- lastModified=- head=[21,21,21,21] tail=[21,21]`
- `f-blob-empty-type` SHARED-WRONG: second caller received `File size=0 type="" name="blob" lastModified=1794547168754 head=[] tail=[]` but should have seen `Blob size=0 type="text/plain" name=- lastModified=- head=[] tail=[]`
- `f-file-name` SHARED-WRONG: second caller received `File size=16 type="" name="alice.pdf" lastModified=1794547168810 head=[22,22,22,22] tail=[22,22]` but should have seen `File size=16 type="" name="bob.pdf" lastModified=1794547168820 head=[22,22,22,22] tail=[22,22]`
- `f-file-type` SHARED-WRONG: second caller received `File size=16 type="text/a" name="same.bin" lastModified=1794547168822 head=[23,23,23,23] tail=[23,23]` but should have seen `File size=16 type="text/b" name="same.bin" lastModified=1794547168829 head=[23,23,23,23] tail=[23,23]`
- `f-file-lastmod` SHARED-WRONG: second caller received `File size=16 type="" name="same.bin" lastModified=1000 head=[24,24,24,24] tail=[24,24]` but should have seen `File size=16 type="" name="same.bin" lastModified=2000 head=[24,24,24,24] tail=[24,24]`
- `f-blob-trailing-zero` SHARED-WRONG: second caller received `File size=3 type="" name="blob" lastModified=1794547168842 head=[71,72,73] tail=[72,73]` but should have seen `Blob size=4 type="" name=- lastModified=- head=[71,72,73,0] tail=[73,0]`
- `f-file-trailing-zero` SHARED-WRONG: second caller received `File size=3 type="" name="z.bin" lastModified=1794547168851 head=[81,82,83] tail=[82,83]` but should have seen `File size=4 type="" name="z.bin" lastModified=1794547168857 head=[81,82,83,0] tail=[83,0]`
- `f-blob-vs-file` SHARED-WRONG: second caller received `File size=16 type="" name="blob" lastModified=1794547168859 head=[25,25,25,25] tail=[25,25]` but should have seen `File size=16 type="" name="x.bin" lastModified=1794547168866 head=[25,25,25,25] tail=[25,25]`

**next 16.2.0 / node 22.23.4**

- `t-u8-trailing-zero` SHARED-WRONG: second caller received `Uint8Array length=3 byteLength=3 head=[61,62,63] tail=[62,63]` but should have seen `Uint8Array length=4 byteLength=4 head=[61,62,63,0] tail=[63,0]`
- `f-blob-type` SHARED-WRONG: second caller received `File size=16 type="text/a" name="blob" lastModified=1794547175151 head=[21,21,21,21] tail=[21,21]` but should have seen `Blob size=16 type="text/b" name=- lastModified=- head=[21,21,21,21] tail=[21,21]`
- `f-blob-empty-type` SHARED-WRONG: second caller received `File size=0 type="" name="blob" lastModified=1794547175161 head=[] tail=[]` but should have seen `Blob size=0 type="text/plain" name=- lastModified=- head=[] tail=[]`
- `f-file-name` SHARED-WRONG: second caller received `File size=16 type="" name="alice.pdf" lastModified=1794547175206 head=[22,22,22,22] tail=[22,22]` but should have seen `File size=16 type="" name="bob.pdf" lastModified=1794547175212 head=[22,22,22,22] tail=[22,22]`
- `f-file-type` SHARED-WRONG: second caller received `File size=16 type="text/a" name="same.bin" lastModified=1794547175217 head=[23,23,23,23] tail=[23,23]` but should have seen `File size=16 type="text/b" name="same.bin" lastModified=1794547175226 head=[23,23,23,23] tail=[23,23]`
- `f-file-lastmod` SHARED-WRONG: second caller received `File size=16 type="" name="same.bin" lastModified=1000 head=[24,24,24,24] tail=[24,24]` but should have seen `File size=16 type="" name="same.bin" lastModified=2000 head=[24,24,24,24] tail=[24,24]`
- `f-blob-trailing-zero` SHARED-WRONG: second caller received `File size=3 type="" name="blob" lastModified=1794547175237 head=[71,72,73] tail=[72,73]` but should have seen `Blob size=4 type="" name=- lastModified=- head=[71,72,73,0] tail=[73,0]`
- `f-file-trailing-zero` SHARED-WRONG: second caller received `File size=3 type="" name="z.bin" lastModified=1794547175247 head=[81,82,83] tail=[82,83]` but should have seen `File size=4 type="" name="z.bin" lastModified=1794547175254 head=[81,82,83,0] tail=[83,0]`
- `f-blob-vs-file` SHARED-WRONG: second caller received `File size=16 type="" name="blob" lastModified=1794547175257 head=[25,25,25,25] tail=[25,25]` but should have seen `File size=16 type="" name="x.bin" lastModified=1794547175264 head=[25,25,25,25] tail=[25,25]`

**next 16.2.12 / node 22.23.4**

- `t-u8-trailing-zero` SHARED-WRONG: second caller received `Uint8Array length=3 byteLength=3 head=[61,62,63] tail=[62,63]` but should have seen `Uint8Array length=4 byteLength=4 head=[61,62,63,0] tail=[63,0]`
- `f-blob-type` SHARED-WRONG: second caller received `File size=16 type="text/a" name="blob" lastModified=1794547181427 head=[21,21,21,21] tail=[21,21]` but should have seen `Blob size=16 type="text/b" name=- lastModified=- head=[21,21,21,21] tail=[21,21]`
- `f-blob-empty-type` SHARED-WRONG: second caller received `File size=0 type="" name="blob" lastModified=1794547181436 head=[] tail=[]` but should have seen `Blob size=0 type="text/plain" name=- lastModified=- head=[] tail=[]`
- `f-file-name` SHARED-WRONG: second caller received `File size=16 type="" name="alice.pdf" lastModified=1794547181478 head=[22,22,22,22] tail=[22,22]` but should have seen `File size=16 type="" name="bob.pdf" lastModified=1794547181484 head=[22,22,22,22] tail=[22,22]`
- `f-file-type` SHARED-WRONG: second caller received `File size=16 type="text/a" name="same.bin" lastModified=1794547181486 head=[23,23,23,23] tail=[23,23]` but should have seen `File size=16 type="text/b" name="same.bin" lastModified=1794547181493 head=[23,23,23,23] tail=[23,23]`
- `f-file-lastmod` SHARED-WRONG: second caller received `File size=16 type="" name="same.bin" lastModified=1000 head=[24,24,24,24] tail=[24,24]` but should have seen `File size=16 type="" name="same.bin" lastModified=2000 head=[24,24,24,24] tail=[24,24]`
- `f-blob-trailing-zero` SHARED-WRONG: second caller received `File size=3 type="" name="blob" lastModified=1794547181501 head=[71,72,73] tail=[72,73]` but should have seen `Blob size=4 type="" name=- lastModified=- head=[71,72,73,0] tail=[73,0]`
- `f-file-trailing-zero` SHARED-WRONG: second caller received `File size=3 type="" name="z.bin" lastModified=1794547181510 head=[81,82,83] tail=[82,83]` but should have seen `File size=4 type="" name="z.bin" lastModified=1794547181515 head=[81,82,83,0] tail=[83,0]`
- `f-blob-vs-file` SHARED-WRONG: second caller received `File size=16 type="" name="blob" lastModified=1794547181517 head=[25,25,25,25] tail=[25,25]` but should have seen `File size=16 type="" name="x.bin" lastModified=1794547181523 head=[25,25,25,25] tail=[25,25]`

**next 16.3.0 / node 22.23.4**

- `t-u8-trailing-zero` SHARED-WRONG: second caller received `Uint8Array length=3 byteLength=3 head=[61,62,63] tail=[62,63]` but should have seen `Uint8Array length=4 byteLength=4 head=[61,62,63,0] tail=[63,0]`
- `f-blob-type` SHARED-WRONG: second caller received `File size=16 type="text/a" name="blob" lastModified=1794547190615 head=[21,21,21,21] tail=[21,21]` but should have seen `Blob size=16 type="text/b" name=- lastModified=- head=[21,21,21,21] tail=[21,21]`
- `f-blob-empty-type` SHARED-WRONG: second caller received `File size=0 type="" name="blob" lastModified=1794547190626 head=[] tail=[]` but should have seen `Blob size=0 type="text/plain" name=- lastModified=- head=[] tail=[]`
- `f-file-name` SHARED-WRONG: second caller received `File size=16 type="" name="alice.pdf" lastModified=1794547190676 head=[22,22,22,22] tail=[22,22]` but should have seen `File size=16 type="" name="bob.pdf" lastModified=1794547190683 head=[22,22,22,22] tail=[22,22]`
- `f-file-type` SHARED-WRONG: second caller received `File size=16 type="text/a" name="same.bin" lastModified=1794547190686 head=[23,23,23,23] tail=[23,23]` but should have seen `File size=16 type="text/b" name="same.bin" lastModified=1794547190693 head=[23,23,23,23] tail=[23,23]`
- `f-file-lastmod` SHARED-WRONG: second caller received `File size=16 type="" name="same.bin" lastModified=1000 head=[24,24,24,24] tail=[24,24]` but should have seen `File size=16 type="" name="same.bin" lastModified=2000 head=[24,24,24,24] tail=[24,24]`
- `f-blob-trailing-zero` SHARED-WRONG: second caller received `File size=3 type="" name="blob" lastModified=1794547190704 head=[71,72,73] tail=[72,73]` but should have seen `Blob size=4 type="" name=- lastModified=- head=[71,72,73,0] tail=[73,0]`
- `f-file-trailing-zero` SHARED-WRONG: second caller received `File size=3 type="" name="z.bin" lastModified=1794547190712 head=[81,82,83] tail=[82,83]` but should have seen `File size=4 type="" name="z.bin" lastModified=1794547190718 head=[81,82,83,0] tail=[83,0]`
- `f-blob-vs-file` SHARED-WRONG: second caller received `File size=16 type="" name="blob" lastModified=1794547190720 head=[25,25,25,25] tail=[25,25]` but should have seen `File size=16 type="" name="x.bin" lastModified=1794547190726 head=[25,25,25,25] tail=[25,25]`

**next 16.3.8 / node 22.23.4**

- `t-u8-trailing-zero` SHARED-WRONG: second caller received `Uint8Array length=3 byteLength=3 head=[61,62,63] tail=[62,63]` but should have seen `Uint8Array length=4 byteLength=4 head=[61,62,63,0] tail=[63,0]`
- `f-blob-type` SHARED-WRONG: second caller received `File size=16 type="text/a" name="blob" lastModified=1794547199509 head=[21,21,21,21] tail=[21,21]` but should have seen `Blob size=16 type="text/b" name=- lastModified=- head=[21,21,21,21] tail=[21,21]`
- `f-blob-empty-type` SHARED-WRONG: second caller received `File size=0 type="" name="blob" lastModified=1794547199517 head=[] tail=[]` but should have seen `Blob size=0 type="text/plain" name=- lastModified=- head=[] tail=[]`
- `f-file-name` SHARED-WRONG: second caller received `File size=16 type="" name="alice.pdf" lastModified=1794547199558 head=[22,22,22,22] tail=[22,22]` but should have seen `File size=16 type="" name="bob.pdf" lastModified=1794547199564 head=[22,22,22,22] tail=[22,22]`
- `f-file-type` SHARED-WRONG: second caller received `File size=16 type="text/a" name="same.bin" lastModified=1794547199565 head=[23,23,23,23] tail=[23,23]` but should have seen `File size=16 type="text/b" name="same.bin" lastModified=1794547199573 head=[23,23,23,23] tail=[23,23]`
- `f-file-lastmod` SHARED-WRONG: second caller received `File size=16 type="" name="same.bin" lastModified=1000 head=[24,24,24,24] tail=[24,24]` but should have seen `File size=16 type="" name="same.bin" lastModified=2000 head=[24,24,24,24] tail=[24,24]`
- `f-blob-trailing-zero` SHARED-WRONG: second caller received `File size=3 type="" name="blob" lastModified=1794547199582 head=[71,72,73] tail=[72,73]` but should have seen `Blob size=4 type="" name=- lastModified=- head=[71,72,73,0] tail=[73,0]`
- `f-file-trailing-zero` SHARED-WRONG: second caller received `File size=3 type="" name="z.bin" lastModified=1794547199590 head=[81,82,83] tail=[82,83]` but should have seen `File size=4 type="" name="z.bin" lastModified=1794547199597 head=[81,82,83,0] tail=[83,0]`
- `f-blob-vs-file` SHARED-WRONG: second caller received `File size=16 type="" name="blob" lastModified=1794547199602 head=[25,25,25,25] tail=[25,25]` but should have seen `File size=16 type="" name="x.bin" lastModified=1794547199611 head=[25,25,25,25] tail=[25,25]`

**next 16.4.0 / node 22.23.4**

- `t-u8-trailing-zero` SHARED-WRONG: second caller received `Uint8Array length=3 byteLength=3 head=[61,62,63] tail=[62,63]` but should have seen `Uint8Array length=4 byteLength=4 head=[61,62,63,0] tail=[63,0]`
- `f-blob-type` SHARED-WRONG: second caller received `File size=16 type="text/a" name="blob" lastModified=1794547207018 head=[21,21,21,21] tail=[21,21]` but should have seen `Blob size=16 type="text/b" name=- lastModified=- head=[21,21,21,21] tail=[21,21]`
- `f-blob-empty-type` SHARED-WRONG: second caller received `File size=0 type="" name="blob" lastModified=1794547207028 head=[] tail=[]` but should have seen `Blob size=0 type="text/plain" name=- lastModified=- head=[] tail=[]`
- `f-file-name` SHARED-WRONG: second caller received `File size=16 type="" name="alice.pdf" lastModified=1794547207069 head=[22,22,22,22] tail=[22,22]` but should have seen `File size=16 type="" name="bob.pdf" lastModified=1794547207078 head=[22,22,22,22] tail=[22,22]`
- `f-file-type` SHARED-WRONG: second caller received `File size=16 type="text/a" name="same.bin" lastModified=1794547207080 head=[23,23,23,23] tail=[23,23]` but should have seen `File size=16 type="text/b" name="same.bin" lastModified=1794547207086 head=[23,23,23,23] tail=[23,23]`
- `f-file-lastmod` SHARED-WRONG: second caller received `File size=16 type="" name="same.bin" lastModified=1000 head=[24,24,24,24] tail=[24,24]` but should have seen `File size=16 type="" name="same.bin" lastModified=2000 head=[24,24,24,24] tail=[24,24]`
- `f-blob-trailing-zero` SHARED-WRONG: second caller received `File size=3 type="" name="blob" lastModified=1794547207095 head=[71,72,73] tail=[72,73]` but should have seen `Blob size=4 type="" name=- lastModified=- head=[71,72,73,0] tail=[73,0]`
- `f-file-trailing-zero` SHARED-WRONG: second caller received `File size=3 type="" name="z.bin" lastModified=1794547207102 head=[81,82,83] tail=[82,83]` but should have seen `File size=4 type="" name="z.bin" lastModified=1794547207108 head=[81,82,83,0] tail=[83,0]`
- `f-blob-vs-file` SHARED-WRONG: second caller received `File size=16 type="" name="blob" lastModified=1794547207110 head=[25,25,25,25] tail=[25,25]` but should have seen `File size=16 type="" name="x.bin" lastModified=1794547207117 head=[25,25,25,25] tail=[25,25]`

**next 16.4.3 / node 22.23.4**

- `t-u8-trailing-zero` SHARED-WRONG: second caller received `Uint8Array length=3 byteLength=3 head=[61,62,63] tail=[62,63]` but should have seen `Uint8Array length=4 byteLength=4 head=[61,62,63,0] tail=[63,0]`
- `f-blob-type` SHARED-WRONG: second caller received `File size=16 type="text/a" name="blob" lastModified=1794547213908 head=[21,21,21,21] tail=[21,21]` but should have seen `Blob size=16 type="text/b" name=- lastModified=- head=[21,21,21,21] tail=[21,21]`
- `f-blob-empty-type` SHARED-WRONG: second caller received `File size=0 type="" name="blob" lastModified=1794547213917 head=[] tail=[]` but should have seen `Blob size=0 type="text/plain" name=- lastModified=- head=[] tail=[]`
- `f-file-name` SHARED-WRONG: second caller received `File size=16 type="" name="alice.pdf" lastModified=1794547213964 head=[22,22,22,22] tail=[22,22]` but should have seen `File size=16 type="" name="bob.pdf" lastModified=1794547213982 head=[22,22,22,22] tail=[22,22]`
- `f-file-type` SHARED-WRONG: second caller received `File size=16 type="text/a" name="same.bin" lastModified=1794547213986 head=[23,23,23,23] tail=[23,23]` but should have seen `File size=16 type="text/b" name="same.bin" lastModified=1794547213994 head=[23,23,23,23] tail=[23,23]`
- `f-file-lastmod` SHARED-WRONG: second caller received `File size=16 type="" name="same.bin" lastModified=1000 head=[24,24,24,24] tail=[24,24]` but should have seen `File size=16 type="" name="same.bin" lastModified=2000 head=[24,24,24,24] tail=[24,24]`
- `f-blob-trailing-zero` SHARED-WRONG: second caller received `File size=3 type="" name="blob" lastModified=1794547214005 head=[71,72,73] tail=[72,73]` but should have seen `Blob size=4 type="" name=- lastModified=- head=[71,72,73,0] tail=[73,0]`
- `f-file-trailing-zero` SHARED-WRONG: second caller received `File size=3 type="" name="z.bin" lastModified=1794547214013 head=[81,82,83] tail=[82,83]` but should have seen `File size=4 type="" name="z.bin" lastModified=1794547214020 head=[81,82,83,0] tail=[83,0]`
- `f-blob-vs-file` SHARED-WRONG: second caller received `File size=16 type="" name="blob" lastModified=1794547214022 head=[25,25,25,25] tail=[25,25]` but should have seen `File size=16 type="" name="x.bin" lastModified=1794547214027 head=[25,25,25,25] tail=[25,25]`

**next 16.4.4 / node 20.20.2**

- `t-u8-trailing-zero` SHARED-WRONG: second caller received `Uint8Array length=3 byteLength=3 head=[61,62,63] tail=[62,63]` but should have seen `Uint8Array length=4 byteLength=4 head=[61,62,63,0] tail=[63,0]`
- `f-blob-type` SHARED-WRONG: second caller received `File size=16 type="text/a" name="blob" lastModified=1794547221379 head=[21,21,21,21] tail=[21,21]` but should have seen `Blob size=16 type="text/b" name=- lastModified=- head=[21,21,21,21] tail=[21,21]`
- `f-blob-empty-type` SHARED-WRONG: second caller received `File size=0 type="" name="blob" lastModified=1794547221390 head=[] tail=[]` but should have seen `Blob size=0 type="text/plain" name=- lastModified=- head=[] tail=[]`
- `f-file-name` SHARED-WRONG: second caller received `File size=16 type="" name="alice.pdf" lastModified=1794547221452 head=[22,22,22,22] tail=[22,22]` but should have seen `File size=16 type="" name="bob.pdf" lastModified=1794547221465 head=[22,22,22,22] tail=[22,22]`
- `f-file-type` SHARED-WRONG: second caller received `File size=16 type="text/a" name="same.bin" lastModified=1794547221467 head=[23,23,23,23] tail=[23,23]` but should have seen `File size=16 type="text/b" name="same.bin" lastModified=1794547221477 head=[23,23,23,23] tail=[23,23]`
- `f-file-lastmod` SHARED-WRONG: second caller received `File size=16 type="" name="same.bin" lastModified=1000 head=[24,24,24,24] tail=[24,24]` but should have seen `File size=16 type="" name="same.bin" lastModified=2000 head=[24,24,24,24] tail=[24,24]`
- `f-blob-trailing-zero` SHARED-WRONG: second caller received `File size=3 type="" name="blob" lastModified=1794547221493 head=[71,72,73] tail=[72,73]` but should have seen `Blob size=4 type="" name=- lastModified=- head=[71,72,73,0] tail=[73,0]`
- `f-file-trailing-zero` SHARED-WRONG: second caller received `File size=3 type="" name="z.bin" lastModified=1794547221504 head=[81,82,83] tail=[82,83]` but should have seen `File size=4 type="" name="z.bin" lastModified=1794547221514 head=[81,82,83,0] tail=[83,0]`
- `f-blob-vs-file` SHARED-WRONG: second caller received `File size=16 type="" name="blob" lastModified=1794547221521 head=[25,25,25,25] tail=[25,25]` but should have seen `File size=16 type="" name="x.bin" lastModified=1794547221538 head=[25,25,25,25] tail=[25,25]`

**next 16.4.4 / node 22.23.4**

- `t-u8-trailing-zero` SHARED-WRONG: second caller received `Uint8Array length=3 byteLength=3 head=[61,62,63] tail=[62,63]` but should have seen `Uint8Array length=4 byteLength=4 head=[61,62,63,0] tail=[63,0]`
- `f-blob-type` SHARED-WRONG: second caller received `File size=16 type="text/a" name="blob" lastModified=1794547124633 head=[21,21,21,21] tail=[21,21]` but should have seen `Blob size=16 type="text/b" name=- lastModified=- head=[21,21,21,21] tail=[21,21]`
- `f-blob-empty-type` SHARED-WRONG: second caller received `File size=0 type="" name="blob" lastModified=1794547124641 head=[] tail=[]` but should have seen `Blob size=0 type="text/plain" name=- lastModified=- head=[] tail=[]`
- `f-file-name` SHARED-WRONG: second caller received `File size=16 type="" name="alice.pdf" lastModified=1794547124690 head=[22,22,22,22] tail=[22,22]` but should have seen `File size=16 type="" name="bob.pdf" lastModified=1794547124696 head=[22,22,22,22] tail=[22,22]`
- `f-file-type` SHARED-WRONG: second caller received `File size=16 type="text/a" name="same.bin" lastModified=1794547124698 head=[23,23,23,23] tail=[23,23]` but should have seen `File size=16 type="text/b" name="same.bin" lastModified=1794547124706 head=[23,23,23,23] tail=[23,23]`
- `f-file-lastmod` SHARED-WRONG: second caller received `File size=16 type="" name="same.bin" lastModified=1000 head=[24,24,24,24] tail=[24,24]` but should have seen `File size=16 type="" name="same.bin" lastModified=2000 head=[24,24,24,24] tail=[24,24]`
- `f-blob-trailing-zero` SHARED-WRONG: second caller received `File size=3 type="" name="blob" lastModified=1794547124716 head=[71,72,73] tail=[72,73]` but should have seen `Blob size=4 type="" name=- lastModified=- head=[71,72,73,0] tail=[73,0]`
- `f-file-trailing-zero` SHARED-WRONG: second caller received `File size=3 type="" name="z.bin" lastModified=1794547124725 head=[81,82,83] tail=[82,83]` but should have seen `File size=4 type="" name="z.bin" lastModified=1794547124732 head=[81,82,83,0] tail=[83,0]`
- `f-blob-vs-file` SHARED-WRONG: second caller received `File size=16 type="" name="blob" lastModified=1794547124734 head=[25,25,25,25] tail=[25,25]` but should have seen `File size=16 type="" name="x.bin" lastModified=1794547124744 head=[25,25,25,25] tail=[25,25]`

**next 16.4.4 / node 24.22.3**

- `t-u8-trailing-zero` SHARED-WRONG: second caller received `Uint8Array length=3 byteLength=3 head=[61,62,63] tail=[62,63]` but should have seen `Uint8Array length=4 byteLength=4 head=[61,62,63,0] tail=[63,0]`
- `f-blob-type` SHARED-WRONG: second caller received `File size=16 type="text/a" name="blob" lastModified=1794547235907 head=[21,21,21,21] tail=[21,21]` but should have seen `Blob size=16 type="text/b" name=- lastModified=- head=[21,21,21,21] tail=[21,21]`
- `f-blob-empty-type` SHARED-WRONG: second caller received `File size=0 type="" name="blob" lastModified=1794547235916 head=[] tail=[]` but should have seen `Blob size=0 type="text/plain" name=- lastModified=- head=[] tail=[]`
- `f-file-name` SHARED-WRONG: second caller received `File size=16 type="" name="alice.pdf" lastModified=1794547235964 head=[22,22,22,22] tail=[22,22]` but should have seen `File size=16 type="" name="bob.pdf" lastModified=1794547235970 head=[22,22,22,22] tail=[22,22]`
- `f-file-type` SHARED-WRONG: second caller received `File size=16 type="text/a" name="same.bin" lastModified=1794547235972 head=[23,23,23,23] tail=[23,23]` but should have seen `File size=16 type="text/b" name="same.bin" lastModified=1794547235978 head=[23,23,23,23] tail=[23,23]`
- `f-file-lastmod` SHARED-WRONG: second caller received `File size=16 type="" name="same.bin" lastModified=1000 head=[24,24,24,24] tail=[24,24]` but should have seen `File size=16 type="" name="same.bin" lastModified=2000 head=[24,24,24,24] tail=[24,24]`
- `f-blob-trailing-zero` SHARED-WRONG: second caller received `File size=3 type="" name="blob" lastModified=1794547235986 head=[71,72,73] tail=[72,73]` but should have seen `Blob size=4 type="" name=- lastModified=- head=[71,72,73,0] tail=[73,0]`
- `f-file-trailing-zero` SHARED-WRONG: second caller received `File size=3 type="" name="z.bin" lastModified=1794547235995 head=[81,82,83] tail=[82,83]` but should have seen `File size=4 type="" name="z.bin" lastModified=1794547236000 head=[81,82,83,0] tail=[83,0]`
- `f-blob-vs-file` SHARED-WRONG: second caller received `File size=16 type="" name="blob" lastModified=1794547236002 head=[25,25,25,25] tail=[25,25]` but should have seen `File size=16 type="" name="x.bin" lastModified=1794547236007 head=[25,25,25,25] tail=[25,25]`

**next 16.4.5 / node 22.23.4**

- `f-file-lastmod` SHARED-WRONG: second caller received `File size=16 type="" name="same.bin" lastModified=1000 head=[24,24,24,24] tail=[24,24]` but should have seen `File size=16 type="" name="same.bin" lastModified=2000 head=[24,24,24,24] tail=[24,24]`

**next 16.4.6 / node 20.20.2**

- `f-file-lastmod` SHARED-WRONG: second caller received `File size=16 type="" name="same.bin" lastModified=1000 head=[24,24,24,24] tail=[24,24]` but should have seen `File size=16 type="" name="same.bin" lastModified=2000 head=[24,24,24,24] tail=[24,24]`

**next 16.4.6 / node 22.23.4**

- `f-file-lastmod` SHARED-WRONG: second caller received `File size=16 type="" name="same.bin" lastModified=1000 head=[24,24,24,24] tail=[24,24]` but should have seen `File size=16 type="" name="same.bin" lastModified=2000 head=[24,24,24,24] tail=[24,24]`

**next 16.4.6 / node 24.22.3**

- `f-file-lastmod` SHARED-WRONG: second caller received `File size=16 type="" name="same.bin" lastModified=1000 head=[24,24,24,24] tail=[24,24]` but should have seen `File size=16 type="" name="same.bin" lastModified=2000 head=[24,24,24,24] tail=[24,24]`

## 2. Values captured by a closure inside a `use cache` function

| kind | mode | 16.0.0<br>node 22.23.4 | 16.1.0<br>node 22.23.4 | 16.2.12<br>node 22.23.4 | 16.3.0<br>node 22.23.4 | 16.3.8<br>node 22.23.4 | 16.4.0<br>node 22.23.4 | 16.4.3<br>node 22.23.4 | 16.4.4<br>node 20.20.2 | 16.4.4<br>node 22.23.4 | 16.4.4<br>node 24.22.3 | 16.4.5<br>node 22.23.4 | 16.4.6<br>node 20.20.2 | 16.4.6<br>node 22.23.4 | 16.4.6<br>node 24.22.3 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| cls | ref | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR |
| fn | ref | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR |
| re | ref | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR |
| symlocal | ref | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR |
| symreg | ref | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED | SHARED |
| url | ref | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| date | ref | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| map | ref | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| set | ref | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| plain | ref | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| cls | read | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR |
| fn | read | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR |
| re | read | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR |
| symlocal | read | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR |
| symreg | read | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR | ERROR |
| url | read | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| date | read | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| map | read | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| set | read | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |
| plain | read | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE | SEPARATE |

`ref` = the cached function only mentions the captured value; `read` = it reads `typeof` and `constructor.name`.

Error text seen:

- (16.0.0) cls/ref: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.   ["ref", {n: 
- (16.0.0) fn/ref: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server". Or maybe you meant to call this functi
- (16.0.0) re/ref: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.   ["ref", RegE
- (16.0.0) symlocal/ref: Only global symbols received from Symbol.for(...) can be passed to Client Components. The symbol Symbol.for(A) cannot be found among global symbols.   ["ref", S
- (16.0.0) cls/read: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.   ["read", {n:
- (16.0.0) fn/read: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server". Or maybe you meant to call this functi
- (16.0.0) re/read: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.   ["read", Reg
- (16.0.0) symlocal/read: Only global symbols received from Symbol.for(...) can be passed to Client Components. The symbol Symbol.for(A) cannot be found among global symbols.   ["read", 
- (16.0.0) symreg/read: Error: Cannot access constructor on the server. You cannot dot into a temporary client reference from a server component. You can only pass the value through to the client.
- (16.1.0) symreg/read: ⨯ Error: Cannot access constructor on the server. You cannot dot into a temporary client reference from a server component. You can only pass the value through to the client.

## 3. Size limits (largest argument that still works)

| type | unit | 16.0.0<br>node 22.23.4 | 16.1.0<br>node 22.23.4 | 16.1.7<br>node 22.23.4 | 16.2.0<br>node 22.23.4 | 16.2.12<br>node 22.23.4 | 16.3.0<br>node 22.23.4 | 16.3.8<br>node 22.23.4 | 16.4.0<br>node 22.23.4 | 16.4.3<br>node 22.23.4 | 16.4.4<br>node 20.20.2 | 16.4.4<br>node 22.23.4 | 16.4.4<br>node 24.22.3 | 16.4.5<br>node 22.23.4 | 16.4.6<br>node 20.20.2 | 16.4.6<br>node 22.23.4 | 16.4.6<br>node 24.22.3 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| u8 | bytes | 247,021 | 247,021 | 247,021 | 247,021 | 247,021 | 247,021 | 247,021 | 247,021 | 247,021 | 246,883 | 247,021 | 247,011 | 247,021 | 246,883 | 247,021 | 247,011 |
| u16 | elements | 123,522 | 123,522 | 123,510 | 123,510 | 123,522 | 123,522 | 123,522 | 123,522 | 123,522 | 123,441 | 123,522 | 123,505 | 123,522 | 123,441 | 123,510 | 123,505 |
| f64 | elements | 30,880 | 30,880 | 30,877 | 30,877 | 30,880 | 30,880 | 30,880 | 30,880 | 30,880 | 30,860 | 30,880 | 30,876 | 30,880 | 30,860 | 30,877 | 30,876 |
| buf | bytes | 4,000,000 | 4,000,000 | 999,999 | 999,999 | 999,999 | 999,999 | 999,999 | 999,999 | 999,999 | 999,999 | 999,999 | 999,999 | 999,999 | 999,999 | 999,999 | 999,999 |
| str | characters | 4,000,000 | 4,000,000 | 999,931 | 999,931 | 999,931 | 999,931 | 999,931 | 999,929 | 999,929 | 999,929 | 999,929 | 999,929 | 999,929 | 999,929 | 999,929 | 999,929 |
| blob | bytes | 247,045 | 247,045 | 247,021 | 247,021 | 247,045 | 247,045 | 247,045 | 247,045 | 247,045 | 246,883 | 247,045 | 247,011 | 247,045 | 246,883 | 247,021 | 247,011 |

### Warm-up experiment (next 16.4.6, node 22.23.4)

Probing 247,022 bytes (the first failing size in the cold bisection): fresh process = **FAIL**, after 300 warm-up requests = **OK**; warmed-process maximum = **247,049** bytes.

### Stack-size experiment (next 16.4.6, node 22.23.4)

| `--stack-size` (KB) | largest working Uint8Array (bytes) |
|---|---|
| 500 | 123,117 |
| 984 | 247,021 |
| 2000 | 507,117 |
