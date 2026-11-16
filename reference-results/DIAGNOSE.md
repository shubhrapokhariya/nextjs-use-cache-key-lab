# Part 1: plain Node v22.23.4 (no Next.js): largest Uint16Array you can spread into String.fromCodePoint(...)

default stack: 125342 elements = 250684 bytes   (Next.js showed ~247,000 bytes for Uint8Array)
--stack-size=500: 63390 elements = 126780 bytes
--stack-size=2000: 255390 elements = 510780 bytes

The limit scales with the stack size: each spread argument takes one stack slot (about 8 bytes).

# Part 2: what the cache-key builder includes for a binary (File/Blob/typed array) argument

| next | found | name in key | type in key | byteLength in key | lastModified in key | spreads bytes into fromCodePoint |
|---|---|---|---|---|---|---|
| 16.0.0 | yes | no | no | no | no | yes |
| 16.1.0 | yes | no | no | no | no | yes |
| 16.1.7 | yes | no | no | no | no | yes |
| 16.2.0 | yes | no | no | no | no | yes |
| 16.2.12 | yes | no | no | no | no | yes |
| 16.3.0 | yes | no | no | no | no | yes |
| 16.3.8 | yes | no | no | no | no | yes |
| 16.4.0 | yes | no | no | no | no | yes |
| 16.4.3 | yes | no | no | no | no | yes |
| 16.4.4 | yes | no | no | no | no | yes |
| 16.4.5 | yes | yes | yes | yes | no | yes |
| 16.4.6 | yes | yes | yes | yes | no | yes |

## The function itself (minified, copied from your own build output)

### 16.0.0

```js
async function I(e){let t="";for(let[r,n]of e){let e;if(t+=r.length.toString(16)+":"+r,"string"==typeof n)e=n;else{let t=await n.arrayBuffer();e=t.byteLength%2==0?String.fromCodePoint(...new Uint16Array(t)):String.fromCodePoint(...new Uint16Array(t,0,(t.byteLength-1)/2))+String.fromCodePoint(new Uint8Array(t,t.byteLength-1,1)[0])}t+=e.length.toString(16)+":"+e}return t}
```

### 16.1.0, 16.1.7

```js
async function k(e){let t="";for(let[r,n]of e){let e;if(t+=r.length.toString(16)+":"+r,"string"==typeof n)e=n;else{let t=await n.arrayBuffer();e=t.byteLength%2==0?String.fromCodePoint(...new Uint16Array(t)):String.fromCodePoint(...new Uint16Array(t,0,(t.byteLength-1)/2))+String.fromCodePoint(new Uint8Array(t,t.byteLength-1,1)[0])}t+=e.length.toString(16)+":"+e}return t}
```

### 16.2.0, 16.2.12

```js
async function B(e){let t="";for(let[r,n]of e){let e;if(t+=r.length.toString(16)+":"+r,"string"==typeof n)e=n;else{let t=await n.arrayBuffer();e=t.byteLength%2==0?String.fromCodePoint(...new Uint16Array(t)):String.fromCodePoint(...new Uint16Array(t,0,(t.byteLength-1)/2))+String.fromCodePoint(new Uint8Array(t,t.byteLength-1,1)[0])}t+=e.length.toString(16)+":"+e}return t}
```

### 16.3.0, 16.3.8

```js
async function Q(e){let t="";for(let[r,n]of e){let e;if(t+=r.length.toString(16)+":"+r,"string"==typeof n)e=n;else{let t=await n.arrayBuffer();e=t.byteLength%2==0?String.fromCodePoint(...new Uint16Array(t)):String.fromCodePoint(...new Uint16Array(t,0,(t.byteLength-1)/2))+String.fromCodePoint(new Uint8Array(t,t.byteLength-1,1)[0])}t+=e.length.toString(16)+":"+e}return t}
```

### 16.4.0, 16.4.3, 16.4.4

```js
async function en(e){let t="";for(let[r,n]of e){let e;if(t+=r.length.toString(16)+":"+r,"string"==typeof n)e=n;else{let t=await n.arrayBuffer();e=t.byteLength%2==0?String.fromCodePoint(...new Uint16Array(t)):String.fromCodePoint(...new Uint16Array(t,0,(t.byteLength-1)/2))+String.fromCodePoint(new Uint8Array(t,t.byteLength-1,1)[0])}t+=e.length.toString(16)+":"+e}return t}
```

### 16.4.5, 16.4.6

```js
async function eo(e){let t="";for(let[r,n]of e)if(t+=r.length.toString(16)+":"+r,"string"==typeof n)t+=n.length.toString(16)+":"+n;else{let e,r=await n.arrayBuffer();e=r.byteLength%2==0?String.fromCodePoint(...new Uint16Array(r)):String.fromCodePoint(...new Uint16Array(r,0,(r.byteLength-1)/2))+String.fromCodePoint(new Uint8Array(r,r.byteLength-1,1)[0]),t+="B"+n.name.length.toString(16)+":"+n.name+n.type.length.toString(16)+":"+n.type+r.byteLength.toString(16)+":"+e}return t}
```
