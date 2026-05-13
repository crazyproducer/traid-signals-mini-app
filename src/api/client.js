/* ═══════════════════════════════════════════════
   HTTP client for /api/signals/* on api.traid.online.

   Auth: every request carries `Authorization: tma <initData>` so
   the gateway can verify the user via Telegram's HMAC scheme.

   USE_MOCK toggle: set to true during dev to skip the network and
   return mock-data.js fixtures from the api/signals.js methods.
   Each method falls back to its mock when USE_MOCK is on or when
   window.Telegram.WebApp isn't available (e.g., dev outside Telegram).
   ═══════════════════════════════════════════════ */

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.traid.online';

/* ─── Toggle for local dev. Flip back to true when running outside
   Telegram or before the gateway is reachable from your env. ───────── */
export const USE_MOCK = false;

/* Pulled from window.Telegram.WebApp.initData on every call —
 * Telegram refreshes auth_date on re-launch so we want the latest. */
function getInitData() {
  if (typeof window === 'undefined') return null;
  return window.Telegram?.WebApp?.initData || null;
}

/* Thrown for non-2xx responses; routers map to UI alerts / toast. */
export class ApiError extends Error {
  constructor(status, body, message) {
    super(message || `API error ${status}`);
    this.status = status;
    this.body = body;
  }
}

/* Hard timeout on every fetch. Telegram WebViews / mobile networks
 * occasionally leave requests hanging without a clear error — the page
 * stays "loading…" forever. Dropped to 3s while we're hunting the
 * stuck-fetch bug; bump back up to ~10s once we've identified the
 * root cause and don't need fast failure for diagnostics. */
const REQUEST_TIMEOUT_MS = 3_000;

/* Shared low-level fetch. Adds auth header, parses JSON,
 * normalizes errors. Returns parsed JSON or null for 204. */
async function request(method, path, { body, query } = {}) {
  const url = new URL(path.startsWith('http') ? path : `${API_BASE}${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') {
        url.searchParams.set(k, String(v));
      }
    }
  }

  const initData = getInitData();
  if (!initData) {
    throw new ApiError(401, null, 'Telegram initData unavailable — open inside the bot');
  }

  const headers = { Authorization: `tma ${initData}` };
  const init = { method, headers };
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }

  // Hard timeout so hangs surface as a real error.
  const controller = new AbortController();
  init.signal = controller.signal;
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let resp;
  try {
    resp = await fetch(url.toString(), init);
  } catch (e) {
    clearTimeout(timer);
    if (e.name === 'AbortError') {
      throw new ApiError(0, null, `Timeout after ${REQUEST_TIMEOUT_MS}ms`);
    }
    throw new ApiError(0, null, `Network error: ${e.message}`);
  }
  clearTimeout(timer);

  if (resp.status === 204) return null;

  let parsed = null;
  try {
    parsed = await resp.json();
  } catch {
    // Body wasn't JSON — leave parsed = null
  }

  if (!resp.ok) {
    const msg = parsed?.detail || `${method} ${path} → ${resp.status}`;
    throw new ApiError(resp.status, parsed, msg);
  }

  return parsed;
}

/* Verb helpers — sugar over request(). */
export const api = {
  get: (path, query) => request('GET', path, { query }),
  post: (path, body, query) => request('POST', path, { body, query }),
  patch: (path, body) => request('PATCH', path, { body }),
  del: (path) => request('DELETE', path),
};
