/**
 * Vercel build migration step: safe logging + retries + unpooled URL preference.
 */
import { spawn } from 'node:child_process';
import { readFileSync, appendFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const LOG_PATH = resolve(ROOT, 'debug-a2dec7.log');
const INGEST =
  'http://127.0.0.1:7770/ingest/26ec8b26-3a41-495e-98d8-c28eed080d0c';
const SESSION = 'a2dec7';
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 8000;

function loadEnvLocal() {
  if (process.env.VERCEL) return;
  try {
    const raw = readFileSync(resolve(ROOT, '.env.local'), 'utf8');
    for (const line of raw.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const i = t.indexOf('=');
      if (i === -1) continue;
      const key = t.slice(0, i);
      let val = t.slice(i + 1);
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  } catch {
    /* optional locally */
  }
}

function safeDbHost(url) {
  if (!url) return null;
  try {
    const u = new URL(url.replace(/^postgres(ql)?:\/\//, 'http://'));
    return {
      host: u.hostname,
      port: u.port || '5432',
      pooler: u.hostname.includes('-pooler'),
      hasSsl: url.includes('sslmode='),
    };
  } catch {
    return { host: 'parse_error', port: null, pooler: false, hasSsl: false };
  }
}

function writeLog(entry) {
  const payload = { sessionId: SESSION, timestamp: Date.now(), ...entry };
  const line = JSON.stringify(payload) + '\n';
  try {
    appendFileSync(LOG_PATH, line);
  } catch {
    /* ignore */
  }
  fetch(INGEST, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': SESSION },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function runMigrate(migrateUrl, label, attempt) {
  return new Promise((resolvePromise) => {
    const started = Date.now();
    const child = spawn('npx', ['prisma', 'migrate', 'deploy'], {
      cwd: ROOT,
      shell: true,
      env: { ...process.env, DATABASE_URL: migrateUrl },
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => {
      const s = d.toString();
      stdout += s;
      process.stdout.write(s);
    });
    child.stderr.on('data', (d) => {
      const s = d.toString();
      stderr += s;
      process.stderr.write(s);
    });
    child.on('close', (code) => {
      const combined = `${stdout}\n${stderr}`;
      const result = {
        exitCode: code ?? 1,
        durationMs: Date.now() - started,
        p1001: /P1001/i.test(combined),
        p1012: /P1012/i.test(combined),
        errorSnippet: combined.slice(-500),
      };
      // #region agent log
      writeLog({
        hypothesisId: 'A,B,C,D',
        location: 'scripts/vercel-migrate.mjs:attempt',
        message: 'migrate attempt finished',
        data: { ...result, attempt, label, host: safeDbHost(migrateUrl) },
        runId: process.env.DEBUG_RUN_ID ?? 'pre-fix',
      });
      // #endregion
      resolvePromise(result);
    });
  });
}

loadEnvLocal();

const pooled = process.env.DATABASE_URL;
const unpooled = process.env.DATABASE_URL_UNPOOLED;
/** Pooled first (works in local repro); unpooled is fallback on P1001 only. */
const migrateCandidates = [
  ...(pooled ? [{ url: pooled, label: 'DATABASE_URL' }] : []),
  ...(unpooled ? [{ url: unpooled, label: 'DATABASE_URL_UNPOOLED' }] : []),
];

if (migrateCandidates.length === 0) {
  console.error('[vercel-migrate] DATABASE_URL is not set');
  // #region agent log
  writeLog({
    hypothesisId: 'B',
    location: 'scripts/vercel-migrate.mjs:missing-env',
    message: 'DATABASE_URL missing at build time',
    data: { hasUnpooled: Boolean(unpooled), vercel: process.env.VERCEL ?? null },
    runId: process.env.DEBUG_RUN_ID ?? 'pre-fix',
  });
  // #endregion
  process.exit(1);
}

const startup = {
  hasDatabaseUrl: Boolean(pooled),
  hasUnpooledUrl: Boolean(unpooled),
  candidateLabels: migrateCandidates.map((c) => c.label),
  pooledHost: safeDbHost(pooled),
  unpooledHost: safeDbHost(unpooled),
  vercel: process.env.VERCEL ?? null,
  vercelEnv: process.env.VERCEL_ENV ?? null,
};

console.log('[vercel-migrate] diagnostics:', JSON.stringify(startup));

// #region agent log
writeLog({
  hypothesisId: 'A,B,C',
  location: 'scripts/vercel-migrate.mjs:startup',
  message: 'vercel migrate startup',
  data: startup,
  runId: process.env.DEBUG_RUN_ID ?? 'pre-fix',
});
// #endregion

let lastResult = null;
let attempt = 0;
for (const candidate of migrateCandidates) {
  for (let round = 1; round <= MAX_ATTEMPTS; round++) {
    attempt += 1;
    console.log(
      `[vercel-migrate] attempt ${round}/${MAX_ATTEMPTS} using ${candidate.label}`
    );
    lastResult = await runMigrate(candidate.url, candidate.label, attempt);
    if (lastResult.exitCode === 0) {
      console.log(`[vercel-migrate] success via ${candidate.label} on round ${round}`);
      process.exit(0);
    }
    const retryable = lastResult.p1001 || /P1002/i.test(lastResult.errorSnippet);
    if (retryable && round < MAX_ATTEMPTS) {
      console.warn(
        `[vercel-migrate] retryable DB error; waiting ${RETRY_DELAY_MS}ms (Neon cold start / lock)`
      );
      await sleep(RETRY_DELAY_MS);
      continue;
    }
    break;
  }
  if (lastResult?.exitCode === 0) break;
}

console.error('[vercel-migrate] all attempts failed');
process.exit(lastResult?.exitCode ?? 1);
