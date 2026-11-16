# use cache key lab

Reproducible experiments on what goes into a Next.js `use cache` cache key: 54 input pairs, closures, size limits, the real key strings, a Server Action upload, and a workaround check. The main results were run on Next.js 16.4.4, 16.4.5 and 16.4.6. The same experiments also ran on a second machine with identical key-matrix results (size limits differ by machine). `reference-results/` holds that second machine's results, including 12 versions that were not re-run on the first.

It installs a throwaway Next.js app for each version you ask for, builds it, runs `next start`, and measures over HTTP:

| Experiment            | Question it answers                                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `cases` (54 inputs)   | For two inputs that differ in one way, does the second call get its own cache entry or reuse the first one's?     |
| `closure` (20 checks) | What happens when a `use cache` function captures a value from an outer scope?                                    |
| `limits`              | How large can an argument be before the cache call throws?                                                        |
| `demo`                | The two small examples (File name, trailing zero byte).                                                           |
| `keys`                | The actual cache key strings, captured by a logging cache handler.                                                |
| `action`              | The same File bug through a Server Action with a real form upload.                                                |
| `workaround`          | Which extra arguments (name, type, size, lastModified) avoid which collisions.                                    |
| `diagnose`            | Why: prints the cache-key function out of **your own build output**, and reproduces the size limit in plain Node. |

Nothing here talks to any server except the npm registry (to install Next.js) and `127.0.0.1` (the throwaway app).

**Security note:** the lab installs old Next.js versions (16.0.0 to 16.4.0 are covered by a reported Critical advisory, GHSA-673q-mjm6-r5xr, fixed in 16.4.1; 16.0.0 to 16.4.4 by the binary-argument one, GHSA-rhh4-g77r-r9qj, fixed in 16.4.5). The servers listen on 127.0.0.1 only. Still, run the lab on a personal or throwaway machine, never on a server reachable from the internet.

---

## Before you start

- Node **20.9 or newer** (`node -v`), npm, and an internet connection for the first install.
- Free disk: roughly 400 MB per Next.js version, so about 1.2 GB for `quick` and about 5 GB for `full` (12 versions). Yours may differ a little by platform.
- Free CPU: close heavy apps while the size-limit tests run; they are about the call stack, but a starved machine can time out.

## Step-by-step

Open a terminal in this folder.

### Step 1: the demo (start here)

```bash
npm run demo
```

It tests Next.js 16.4.4 and 16.4.5. The first run installs both, so allow a few minutes. **You should see this pattern** (the numbers in `filledAt` will differ, the values will not):

```
=== next@16.4.4 ===
    File alice.pdf (32 bytes of 7)        -> {"name":"alice.pdf", ...}
    File bob.pdf   (SAME 32 bytes)        -> {"name":"alice.pdf", ...}     <- bob got alice's result
    Uint8Array [61,62,63]                 -> {"length":3, ...}
    Uint8Array [61,62,63,0] (one extra zero byte) -> {"length":3, ...}     <- should be 4

=== next@16.4.5 ===
    File bob.pdf   (SAME 32 bytes)        -> {"name":"bob.pdf", ...}       <- correct
    Uint8Array [61,62,63,0] ...           -> {"length":4, ...}             <- correct
```

If you see this, the main finding reproduces on your machine. If you do **not**, stop and note exactly what you saw (copy the output): please open an issue with the output.

### Step 2: the full key matrix on three versions

```bash
npm run quick
npm run summarize
```

`quick` tests 16.4.4 (before the fix), 16.4.5 (the fix) and 16.4.6 (the latest stable when I tested, November 2026). The first run installs three versions of Next.js, so allow some time; later runs reuse `.work/`.

Open `results/SUMMARY.md`. Compare it with `reference-results/SUMMARY.md`. Expected on every machine:

- **16.4.4:** 38 SEPARATE, 7 SHARED, 9 SHARED-WRONG
- **16.4.5 and 16.4.6:** 46 SEPARATE, 7 SHARED, 1 SHARED-WRONG (`f-file-lastmod`)

These counts do not depend on your OS or Node version. If yours differ, open an issue and say which rows.

### Step 3: the root cause

```bash
npm run diagnose
```

Prints (1) the plain-Node reproduction of the size limit and (2) a table showing which fields the cache-key builder includes, per version, read from your own `.next` build output. Expected: `name in key` and `type in key` are `no` up to 16.4.4 and `yes` from 16.4.5; `lastModified in key` is `no` everywhere.

### Step 3b: the real cache keys

```bash
npm run keys
```

Builds 16.4.4 and 16.4.5 with a small custom cache handler (`template/keylog-handler.cjs`) that wraps Next.js's own default handler and records every key it receives. Nothing about caching changes; it only prints. **You should see:** on 16.4.4 the `alice.pdf` and `bob.pdf` keys are the _same string_ (bob's lookup is a HIT) and so are `[61,62,63]` and `[61,62,63,0]`; on 16.4.5 all four keys differ, and the file keys contain the file names. This is the direct proof of the root cause. The random-looking ids inside the keys differ per build, so compare the two lines within one version, not across versions.

### Step 3c: the same bug through a Server Action

```bash
npm run action
```

Builds 16.4.4, 16.4.5 and 16.4.6 with a page at `/action-test` that has a real `<form action={upload}>`. The harness posts the form with `alice.pdf` and `bob.pdf` (same 32 bytes), then with a 3-byte and a 4-byte file, and reads the Server Action's result. **You should see:** on 16.4.4 `bob.pdf` gets `alice.pdf`'s result and the 4-byte file gets the 3-byte result; on 16.4.5 and 16.4.6 each gets its own. It also prints a canary line (a post with a fake action id must not run the action) and a `lastModified probe` line (a sent value of 1000 comes back as the server's current time). The harness posts the form without a browser, as a no-JavaScript form submission.

### Step 3d: does passing the metadata as separate arguments fix it?

```bash
npm run workaround
```

For four cases (file name, file type, 3 vs 4 bytes, `lastModified`) it calls a cached function three ways: with the `File` only, with the `File` plus `name`, `type` and `size` as separate arguments, and with those plus `lastModified`. **You should see:** "File only" is SHARED-WRONG for all four on 16.4.4 (and for `lastModified` on every version). With `name`, `type` and `size` added, the first three are SEPARATE on every version and `lastModified` is still SHARED-WRONG. With `lastModified` added too, all four are SEPARATE. Note that `lastModified` is pinned in the test; a `File` built without it gets `Date.now()`, which would make every call a new key.

### Step 4: size limits, warm-up and stack size

```bash
npm run limits
```

Runs the limit search on 16.4.6, plus the warm-up experiment and the `--stack-size` experiment. **These numbers are machine, OS and Node specific.** In my runs the largest working Uint8Array was between about 246,900 and 250,900 bytes, depending on the machine and Node version. Expect yours to land in that range, not on the same number. What should hold on your machine:

- Uint8Array and Blob fail at about the same byte count.
- Buffer and long strings fail at about 1,000,000, with a different error message.
- In the `reference-results` run, `--stack-size=500` roughly halved the Uint8Array limit (123,117 bytes) and `--stack-size=2000` roughly doubled it (507,117). I did not try it on every machine (see Troubleshooting).

### Step 5 (optional): every version, and other Node versions

```bash
npm run full                      # 12 Next.js versions, the first run installs all of them
```

To compare Node versions, switch Node (nvm, fnm or Volta) and run for example `node run.mjs --versions=16.4.4,16.4.6`. Result files are named by Next.js and Node version, so runs never overwrite each other, and `npm run summarize` merges them all.

---

## What the output means

| Status         | Meaning                                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `SEPARATE`     | The second input got its own cache entry.                                                                                   |
| `SHARED`       | It reused the first input's entry, and the function's output is the same as it would have produced anyway (harmless alias). |
| `SHARED-WRONG` | It reused the first input's entry **and received output computed for a different input**.                                   |
| `ERROR`        | The call threw. The error text is in `results/SUMMARY.md`.                                                                  |
| `NO-CACHE`     | The control call was not cached, so that case is invalid. Re-run it.                                                        |

How a case works: build value A and value B (they differ in one attribute), call a cached function with A, again with A (control), then with B. The cached function returns a random `fill` per execution, so equal `fill` values mean the same cache entry.

## Files

```
package.json         the npm scripts used above
run.mjs              orchestrator: install, build, start, measure, save
summarize.mjs        merges results/*.json into results/SUMMARY.md
                     (renders cases, closures and limits; keys, action and workaround print to the terminal and are stored in the JSON)
diagnose.mjs         root-cause checks (plain Node + your build output)
template/            the Next.js app that is copied for every version
  keylog-handler.cjs logging cache handler used only by `npm run keys`
  app/lib/cases.js   the 54 inputs (edit or add your own)
  app/lib/cached.js  the 'use cache' functions under test
  app/api/*          routes the harness calls
  app/action-test/   the form page and Server Action used by `npm run action`
reference-results/   results from a second machine (Node 20, 22 and 24), for comparison
```

To add your own case, append an entry to `CASES` in `template/app/lib/cases.js`: an `id`, a `group`, a `desc`, and `make(v)` that returns a value for `'A'` or `'B'`. Then run `node run.mjs --versions=16.4.6 --only=cases`.

## Troubleshooting

- **"build failed"**: open `.work/next-<version>/build.log`. A build is judged by whether `.next/BUILD_ID` exists, not by the exit code, because some versions print an upgrade notice and exit non-zero after a successful build.
- **"server did not start"**: another program may be blocking local ports, or your firewall prompted and was dismissed. Re-run.
- **npm install fails behind a company proxy**: set the usual `HTTPS_PROXY` or point npm at your registry, then re-run.
- **A result looks wrong**: delete `.work/next-<version>` and re-run to force a clean install.
- **Everything is slow**: `quick` needs three installs; later runs reuse `.work/`.
- **The stack-size part of `npm run limits` fails or crashes**: it raises Node's `--stack-size`, which I have not tried on every OS. Skip it with `node run.mjs --versions=16.4.6 --only=limits --warm` and `node diagnose.mjs --skip-stack`; everything else in the lab is unaffected.

---

## Limits of this lab

It tests route handlers and one Server Action page with `next start`, the default in-memory cache handler and `cacheComponents: true`. It does **not** test: a second cache handler (Redis, `use cache: remote`), `use cache: private`, page or component renders, `next dev`, Bun or Deno, or patch versions it didn't install.

## License

[MIT](LICENSE)
