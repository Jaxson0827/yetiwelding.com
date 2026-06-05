/**
 * Debug helper: test Prisma migrate deploy connectivity and log safe diagnostics.
 * Does NOT log credentials.
 */
import { spawn } from 'node:child_process';
import { readFileSync, appendFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOG_PATH = resolve(__dirname, '..', 'debug-a2dec7.log');
const INGEST =
  'http://127.0.0.1:7770/ingest/26ec8b26-3a41-495e-98d8-c28eed080d0c';
const SESSION = 'a2dec7';

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(__dirname, '..', '.env.local'), 'utf8');
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
    /* .env.local optional on CI */
  }
}

function safeDbHost(url) {
  if (!url) return null;
  try {
    const u = new URL(url.replace(/^postgres(ql)?:\/\//, 'http://'));
    return { host: u.hostname, port: u.port || '5432', hasSsl: url.includes('sslmode=') };
  } catch {
    return { host: 'parse_error', port: null, hasSsl: false };
  }
}

function writeLog(entry) {
  const line = JSON.stringify({ sessionId: SESSION, timestamp: Date.now(), ...entry }) + '\n';
  try {
    appendFileSync(LOG_PATH, line);
  } catch {
    /* ignore */
  }
  fetch(INGEST, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': SESSION },
    body: JSON.stringify({ sessionId: SESSION, timestamp: Date.now(), ...entry }),
  }).catch(() => {});
}

loadEnvLocal();

const dbUrl = process.env.DATABASE_URL;
const unpooled = process.env.DATABASE_URL_UNPOOLED;

// #region agent log
writeLog({
  hypothesisId: 'A,B,C',
  location: 'scripts/debug-db-migrate.mjs:startup',
  message: 'env presence and host summary',
  data: {
    hasDatabaseUrl: Boolean(dbUrl),
    hasUnpooledUrl: Boolean(unpooled),
    databaseUrlHost: safeDbHost(dbUrl),
    unpooledHost: safeDbHost(unpooled),
    nodeEnv: process.env.NODE_ENV ?? null,
    vercel: process.env.VERCEL ?? null,
  },
  runId: process.env.DEBUG_RUN_ID ?? 'pre-fix',
});
// #endregion

function runMigrate(envOverrides = {}) {
  return new Promise((resolvePromise) => {
    const started = Date.now();
    const child = spawn('npx', ['prisma', 'migrate', 'deploy'], {
      cwd: resolve(__dirname, '..'),
      shell: true,
      env: { ...process.env, ...envOverrides },
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => {
      stdout += d.toString();
    });
    child.stderr.on('data', (d) => {
      stderr += d.toString();
    });
    child.on('close', (code) => {
      const combined = `${stdout}\n${stderr}`;
      const p1001 = /P1001/i.test(combined);
      const p1012 = /P1012/i.test(combined);
      // #region agent log
      writeLog({
        hypothesisId: 'A,B,C,D',
        location: 'scripts/debug-db-migrate.mjs:migrate-result',
        message: 'prisma migrate deploy finished',
        data: {
          exitCode: code,
          durationMs: Date.now() - started,
          p1001,
          p1012,
          errorSnippet: combined.slice(-400),
          usedEnv: envOverrides.USED_LABEL ?? 'DATABASE_URL',
        },
        runId: process.env.DEBUG_RUN_ID ?? 'pre-fix',
      });
      // #endregion
      resolvePromise({ code, combined });
    });
  });
}

const primary = await runMigrate({ USED_LABEL: 'DATABASE_URL' });

if (unpooled && primary.code !== 0) {
  // #region agent log
  writeLog({
    hypothesisId: 'C',
    location: 'scripts/debug-db-migrate.mjs:retry-unpooled',
    message: 'retrying migrate with DATABASE_URL_UNPOOLED as DATABASE_URL',
    data: { primaryExitCode: primary.code },
    runId: process.env.DEBUG_RUN_ID ?? 'pre-fix',
  });
  // #endregion
  await runMigrate({
    DATABASE_URL: unpooled,
    USED_LABEL: 'DATABASE_URL_UNPOOLED',
  });
}

process.exit(primary.code ?? 1);
