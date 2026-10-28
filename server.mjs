import { createServer } from 'node:http';
import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { randomUUID, timingSafeEqual } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const STORE_PATH = resolve(process.env.TEMPLATE_STORE_PATH || resolve(ROOT, '.data/template-content.json'));
const MAX_BODY_BYTES = 512 * 1024;
const allowedOrigins = new Set(
  String(process.env.ALLOWED_ORIGINS || 'https://workers-settlement-zdku.onrender.com')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
);

function sendJson(res, statusCode, value) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(JSON.stringify(value));
}

function applyCors(req, res) {
  const origin = req.headers.origin;
  if (!origin || !allowedOrigins.has(origin)) return false;

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Access-Control-Max-Age', '600');
  return true;
}

function readRequestBody(req) {
  return new Promise((resolveBody, reject) => {
    const chunks = [];
    let size = 0;
    let settled = false;
    req.on('data', (chunk) => {
      if (settled) return;
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        settled = true;
        reject(Object.assign(new Error('Request body is too large.'), { statusCode: 413 }));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (!settled) resolveBody(Buffer.concat(chunks).toString('utf8'));
    });
    req.on('error', (error) => {
      if (!settled) reject(error);
    });
  });
}

function isAuthorized(req) {
  const expected = process.env.TEMPLATE_SYNC_PASSWORD;
  if (!expected) return false;

  const match = String(req.headers.authorization || '').match(/^Bearer\s+(.+)$/i);
  if (!match) return false;

  const actualBuffer = Buffer.from(match[1]);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

function validateTemplate(data) {
  if (!Array.isArray(data) || data.length > 500) return false;
  return data.every((item, index) =>
    item && Number.isInteger(item.index) && item.index === index &&
    typeof item.html === 'string' && item.html.length <= 50_000,
  );
}

async function readSavedTemplate() {
  try {
    const raw = await readFile(STORE_PATH, 'utf8');
    const saved = JSON.parse(raw);
    if (!saved || !validateTemplate(saved.data) || typeof saved.updatedAt !== 'string') return null;
    return saved;
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function saveTemplate(data) {
  await mkdir(dirname(STORE_PATH), { recursive: true });
  const saved = { data, updatedAt: new Date().toISOString() };
  const temporaryPath = `${STORE_PATH}.${process.pid}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(saved), { encoding: 'utf8', mode: 0o600 });
  await rename(temporaryPath, STORE_PATH);
  return saved;
}

async function handleTemplateApi(req, res) {
  if (req.method === 'GET') {
    try {
      const saved = await readSavedTemplate();
      return sendJson(res, 200, saved
        ? { saved: true, data: saved.data, updatedAt: saved.updatedAt }
        : { saved: false, data: null, updatedAt: null });
    } catch (error) {
      console.error('[template-sync] Could not read saved content:', error);
      return sendJson(res, 500, { error: 'Could not read saved content.' });
    }
  }

  if (req.method !== 'PUT' && req.method !== 'DELETE') {
    res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS');
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }

  if (!process.env.TEMPLATE_SYNC_PASSWORD) {
    return sendJson(res, 503, { error: 'Cloud save is not configured yet.' });
  }
  if (!isAuthorized(req)) {
    return sendJson(res, 401, { error: 'The cloud save password is incorrect.' });
  }

  if (req.method === 'DELETE') {
    try {
      await unlink(STORE_PATH).catch((error) => {
        if (error.code !== 'ENOENT') throw error;
      });
      return sendJson(res, 200, { deleted: true });
    } catch (error) {
      console.error('[template-sync] Could not reset saved content:', error);
      return sendJson(res, 500, { error: 'Could not reset saved content.' });
    }
  }

  try {
    const bodyText = await readRequestBody(req);
    const body = JSON.parse(bodyText);
    if (!body || !validateTemplate(body.data)) {
      return sendJson(res, 400, { error: 'Invalid template content.' });
    }
    const saved = await saveTemplate(body.data);
    return sendJson(res, 200, { saved: true, updatedAt: saved.updatedAt });
  } catch (error) {
    if (error.statusCode) return sendJson(res, error.statusCode, { error: error.message });
    if (error instanceof SyntaxError) return sendJson(res, 400, { error: 'Invalid JSON.' });
    console.error('[template-sync] Could not save content:', error);
    return sendJson(res, 500, { error: 'Could not save content.' });
  }
}

const server = createServer(async (req, res) => {
  const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  if (requestUrl.pathname === '/healthz' && req.method === 'GET') {
    return sendJson(res, 200, { ok: true });
  }

  if (requestUrl.pathname !== '/api/template') {
    return sendJson(res, 404, { error: 'Not found.' });
  }

  const originAllowed = applyCors(req, res);
  if (req.method === 'OPTIONS') {
    if (!originAllowed) return sendJson(res, 403, { error: 'Origin is not allowed.' });
    res.writeHead(204);
    return res.end();
  }

  if (req.headers.origin && !originAllowed) {
    return sendJson(res, 403, { error: 'Origin is not allowed.' });
  }

  return handleTemplateApi(req, res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[template-sync] API listening on 0.0.0.0:${PORT}`);
  console.log(`[template-sync] Data file: ${STORE_PATH}`);
  if (!process.env.TEMPLATE_SYNC_PASSWORD) {
    console.warn('[template-sync] TEMPLATE_SYNC_PASSWORD is missing; cloud writes are disabled.');
  }
});
