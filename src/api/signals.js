/* ═══════════════════════════════════════════════
   Typed wrappers for /api/signals/* endpoints.

   Pages import functions from here — never api/client directly. Each
   function falls back to a mock-data fixture when USE_MOCK is true
   (or when the real call throws, for graceful dev outside Telegram).

   API shapes match the gateway's Pydantic schemas (app/schemas/signals.py
   in the http-gateway repo). When a schema change there breaks one of
   these mappings, this file is the single place to fix.
   ═══════════════════════════════════════════════ */

import { api, USE_MOCK, ApiError } from './client';
import {
  mockUser,
  mockSignalSubscriptions,
  mockSignals,
  mockPerformance,
  mockEquityCurve,
  mockSubscription,
  mockTemplates,
  getRecentSignals,
} from './mock-data';

/* ─── Defensive wrap: try the real API; fall back to mock if explicitly
       USE_MOCK or if a 401 (e.g. running outside Telegram) breaks auth.
       Other errors propagate so the UI can surface them. ─────────── */
async function tryApi(realCall, mockFn) {
  if (USE_MOCK) return mockFn();
  try {
    return await realCall();
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      console.warn('[api] 401 — running outside Telegram? Using mocks.');
      return mockFn();
    }
    throw e;
  }
}

/* ─── Me / terms ────────────────────────────────────────────────────── */

export function getMe() {
  return tryApi(
    () => api.get('/api/signals/me'),
    () => ({
      telegram_user_id: mockUser.tg_user_id,
      first_name: mockUser.first_name,
      username: mockUser.username,
      accepted_terms: mockUser.terms_accepted,
    }),
  );
}

export function acceptTerms() {
  return tryApi(
    () => api.post('/api/signals/me/accept-terms'),
    () => null,
  );
}

/* ─── Symbols (wizard step) ─────────────────────────────────────────── */

export function listSymbols() {
  return tryApi(
    () => api.get('/api/signals/symbols'),
    () => ({ symbols: ['BTCUSDT'] }),
  );
}

/* ─── Configs CRUD ──────────────────────────────────────────────────── */

export function listConfigs() {
  return tryApi(
    () => api.get('/api/signals/configs'),
    () => ({ configs: mockSignalSubscriptions.map(_mockConfigShape) }),
  );
}

export function getConfig(configId) {
  return tryApi(
    () => api.get(`/api/signals/configs/${configId}`),
    () => {
      const c = mockSignalSubscriptions.find((s) => s.id === String(configId));
      return c ? _mockConfigShape(c) : null;
    },
  );
}

export function createConfig(payload) {
  return tryApi(
    () => api.post('/api/signals/configs', payload),
    () => ({ config: { ..._mockConfigShape({ id: 'sub_mock', ...payload }), config_id: Date.now() } }),
  );
}

export function updateConfig(configId, patch) {
  return tryApi(
    () => api.patch(`/api/signals/configs/${configId}`, patch),
    () => {
      const c = mockSignalSubscriptions.find((s) => s.id === String(configId));
      return c ? { ..._mockConfigShape(c), ...patch } : null;
    },
  );
}

export function pauseConfig(configId) {
  return tryApi(
    () => api.post(`/api/signals/configs/${configId}/pause`),
    () => ({ ..._mockConfigShape(mockSignalSubscriptions[0]), status: 'paused' }),
  );
}

export function resumeConfig(configId) {
  return tryApi(
    () => api.post(`/api/signals/configs/${configId}/resume`),
    () => ({ ..._mockConfigShape(mockSignalSubscriptions[0]), status: 'active' }),
  );
}

export function deleteConfig(configId) {
  return tryApi(
    () => api.del(`/api/signals/configs/${configId}`),
    () => ({ ..._mockConfigShape(mockSignalSubscriptions[0]), status: 'deleted' }),
  );
}

/* Map old mock-shape SignalSubscription to new API ConfigResponse shape. */
function _mockConfigShape(s) {
  return {
    config_id: typeof s.id === 'string' ? parseInt(s.id.replace(/\D/g, ''), 10) || 1 : s.id,
    name: s.name || `${(s.symbols || ['BTCUSDT'])[0]} ${s.strategies?.[0] || 'pullback'}`,
    status: s.status || 'active',
    strategy: (s.strategies || ['pullback'])[0],
    risk_level: s.risk_level ?? 0,
    min_trade_count: s.min_trade_count ?? 0,
    min_win_rate: s.min_win_rate ?? 0.0,
    time_range_months: s.time_range_months ?? null,
    signal_sides: s.directions || ['BUY'],
    symbols: s.symbols || ['BTCUSDT'],
    timeframe: s.frequency === '24h' ? '1DAY' : '4HOUR',
    ema_filters: s.ema_filters || [],
    created_at: s.created_at || new Date().toISOString(),
    updated_at: s.created_at || new Date().toISOString(),
  };
}

/* ─── Feed / detail ─────────────────────────────────────────────────── */

export function getFeed({ tab = 'new', limit = 50, offset = 0 } = {}) {
  return tryApi(
    () => api.get('/api/signals/feed', { tab, limit, offset }),
    () => {
      const NEW = ['PENDING', 'ACTIVE', 'UPDATED'];
      const ACTIVE = ['TRIGGERED'];
      const HISTORY = ['HIT_TP', 'HIT_SL'];
      const EXPIRED = ['EXPIRED'];
      const map = { new: NEW, active: ACTIVE, history: HISTORY, expired: EXPIRED };
      const items = mockSignals
        .filter((s) => (map[tab] || []).includes(s.status))
        .slice(offset, offset + limit);
      return { items, has_more: false, next_cursor: null };
    },
  );
}

export function getSignal(signalId) {
  return tryApi(
    () => api.get(`/api/signals/${signalId}`),
    () => mockSignals.find((s) => s.id === String(signalId)) || null,
  );
}

/* ─── Performance ───────────────────────────────────────────────────── */

export function getPerformance({ period = '90D' } = {}) {
  return tryApi(
    () => api.get('/api/signals/performance', { period }),
    () => ({
      period,
      ...mockPerformance,
      equity_curve: mockEquityCurve[period] || [],
    }),
  );
}

/* ─── Preview-count (wizard live narrowing) ─────────────────────────── */

export function previewCount(filters) {
  return tryApi(
    () => api.post('/api/signals/preview-count', filters),
    () => ({ matching_records: 125847, matching_combos: 1500 }),
  );
}

/* ─── Subscription (plan + usage) ───────────────────────────────────── */

export function getSubscription() {
  return tryApi(
    () => api.get('/api/signals/subscription'),
    () => ({
      plan: mockSubscription.plan,
      status: mockSubscription.status,
      configs_used: mockSubscription.configs_used,
      configs_limit: mockSubscription.configs_limit,
      symbols_used: mockSubscription.symbols_used,
      symbols_limit: mockSubscription.symbols_limit,
    }),
  );
}

/* ─── Templates (Phase 5 — for now mock-only) ───────────────────────── */

export function listTemplates() {
  // No backend yet — Phase 5 will add /api/signals/templates leaderboard.
  return Promise.resolve({ templates: mockTemplates });
}

export function getTemplate(templateId) {
  return Promise.resolve(mockTemplates.find((t) => t.id === templateId) || null);
}
