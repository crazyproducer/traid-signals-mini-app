/* ═══════════════════════════════════════════════
   Mock Data — Signal Subscription App
   ═══════════════════════════════════════════════ */

/* ─── User ─── */

export const mockUser = {
  id: 'usr_a1b2c3d4',
  tg_user_id: 884217653,
  username: 'alextrader',
  first_name: 'Alex',
  terms_accepted: true,
  subscription: 'basic',
  created_at: '2026-02-15T10:30:00Z',
};

/* ─── Signal Subscriptions ─── */

export const mockSignalSubscriptions = [
  {
    id: 'sub_001',
    user_id: 'usr_a1b2c3d4',
    symbols: ['BTCUSDT', 'ETHUSDT'],
    direction: 'LONG',
    frequency: '4h',
    strategy: 'pullback',
    ema_filter: 50,
    risk_level: 10,
    confidence: 0.6,
    min_probability: 0.75,
    status: 'active',
    signals_count: 42,
    created_at: '2026-03-01T08:00:00Z',
  },
  {
    id: 'sub_002',
    user_id: 'usr_a1b2c3d4',
    symbols: ['SOLUSDT', 'AVAXUSDT', 'LINKUSDT'],
    direction: 'LONG',
    frequency: '24h',
    strategy: 'pullback',
    ema_filter: 200,
    risk_level: 5,
    confidence: 0.7,
    min_probability: 0.66,
    status: 'active',
    signals_count: 31,
    created_at: '2026-03-05T12:00:00Z',
  },
  {
    id: 'sub_003',
    user_id: 'usr_a1b2c3d4',
    symbols: ['BNBUSDT'],
    direction: 'SHORT',
    frequency: '4h',
    strategy: 'pullback',
    ema_filter: null,
    risk_level: 20,
    confidence: 0.5,
    min_probability: 0.90,
    status: 'paused',
    signals_count: 16,
    created_at: '2026-03-10T16:00:00Z',
  },
];

/* ─── Signals ─── */

export const mockSignals = [
  // sub_001 — BTC/ETH Long
  {
    id: 'SIG-2847',
    subscription_id: 'sub_001',
    symbol: 'BTCUSDT',
    direction: 'LONG',
    entry_price: 66420.50,
    stop_loss: 65190.00,
    take_profit: 69250.00,
    risk_pct: 1.85,
    reward_pct: 4.26,
    win_rate: 0.72,
    matching_trades: 18,
    status: 'ACTIVE',
    created_at: '2026-04-03T08:00:00Z',
    triggered_at: null,
    resolved_at: null,
    result: null,
    updates: [
      { timestamp: '2026-04-03T08:00:00Z', field: 'created', message: 'Signal generated' },
    ],
  },
  {
    id: 'SIG-2841',
    subscription_id: 'sub_001',
    symbol: 'ETHUSDT',
    direction: 'LONG',
    entry_price: 3465.20,
    stop_loss: 3388.00,
    take_profit: 3620.00,
    risk_pct: 2.23,
    reward_pct: 4.47,
    win_rate: 0.68,
    matching_trades: 14,
    status: 'UPDATED',
    created_at: '2026-04-03T04:00:00Z',
    triggered_at: null,
    resolved_at: null,
    result: null,
    updates: [
      { timestamp: '2026-04-03T04:00:00Z', field: 'created', message: 'Signal generated' },
      { timestamp: '2026-04-03T08:00:00Z', field: 'entry_price', message: 'Entry updated: $3,480.10 -> $3,465.20' },
    ],
  },
  {
    id: 'SIG-2835',
    subscription_id: 'sub_001',
    symbol: 'BTCUSDT',
    direction: 'LONG',
    entry_price: 67100.00,
    stop_loss: 66050.00,
    take_profit: 69800.00,
    risk_pct: 1.56,
    reward_pct: 4.02,
    win_rate: 0.75,
    matching_trades: 22,
    status: 'TRIGGERED',
    created_at: '2026-04-02T20:00:00Z',
    triggered_at: '2026-04-02T22:15:00Z',
    resolved_at: null,
    result: null,
    updates: [
      { timestamp: '2026-04-02T20:00:00Z', field: 'created', message: 'Signal generated' },
      { timestamp: '2026-04-02T22:15:00Z', field: 'status', message: 'Entry price hit — trade triggered' },
    ],
  },
  {
    id: 'SIG-2820',
    subscription_id: 'sub_001',
    symbol: 'ETHUSDT',
    direction: 'LONG',
    entry_price: 3510.00,
    stop_loss: 3430.00,
    take_profit: 3685.00,
    risk_pct: 2.28,
    reward_pct: 4.99,
    win_rate: 0.71,
    matching_trades: 16,
    status: 'HIT_TP',
    created_at: '2026-04-01T12:00:00Z',
    triggered_at: '2026-04-01T14:30:00Z',
    resolved_at: '2026-04-02T06:45:00Z',
    result: 'WIN',
    updates: [
      { timestamp: '2026-04-01T12:00:00Z', field: 'created', message: 'Signal generated' },
      { timestamp: '2026-04-01T14:30:00Z', field: 'status', message: 'Entry price hit — trade triggered' },
      { timestamp: '2026-04-02T06:45:00Z', field: 'status', message: 'Take profit hit at $3,685.00' },
    ],
  },
  // sub_002 — SOL/AVAX/LINK Long
  {
    id: 'SIG-2843',
    subscription_id: 'sub_002',
    symbol: 'SOLUSDT',
    direction: 'LONG',
    entry_price: 142.80,
    stop_loss: 138.50,
    take_profit: 152.60,
    risk_pct: 3.01,
    reward_pct: 6.86,
    win_rate: 0.69,
    matching_trades: 12,
    status: 'ACTIVE',
    created_at: '2026-04-03T00:00:00Z',
    triggered_at: null,
    resolved_at: null,
    result: null,
    updates: [
      { timestamp: '2026-04-03T00:00:00Z', field: 'created', message: 'Signal generated' },
    ],
  },
  {
    id: 'SIG-2830',
    subscription_id: 'sub_002',
    symbol: 'LINKUSDT',
    direction: 'LONG',
    entry_price: 14.85,
    stop_loss: 14.20,
    take_profit: 16.10,
    risk_pct: 4.38,
    reward_pct: 8.42,
    win_rate: 0.66,
    matching_trades: 9,
    status: 'HIT_SL',
    created_at: '2026-04-01T00:00:00Z',
    triggered_at: '2026-04-01T08:20:00Z',
    resolved_at: '2026-04-01T19:55:00Z',
    result: 'LOSS',
    updates: [
      { timestamp: '2026-04-01T00:00:00Z', field: 'created', message: 'Signal generated' },
      { timestamp: '2026-04-01T08:20:00Z', field: 'status', message: 'Entry price hit — trade triggered' },
      { timestamp: '2026-04-01T19:55:00Z', field: 'status', message: 'Stop loss hit at $14.20' },
    ],
  },
  {
    id: 'SIG-2818',
    subscription_id: 'sub_002',
    symbol: 'AVAXUSDT',
    direction: 'LONG',
    entry_price: 36.40,
    stop_loss: 35.10,
    take_profit: 39.50,
    risk_pct: 3.57,
    reward_pct: 8.52,
    win_rate: 0.73,
    matching_trades: 11,
    status: 'HIT_TP',
    created_at: '2026-03-31T00:00:00Z',
    triggered_at: '2026-03-31T10:45:00Z',
    resolved_at: '2026-04-01T03:10:00Z',
    result: 'WIN',
    updates: [
      { timestamp: '2026-03-31T00:00:00Z', field: 'created', message: 'Signal generated' },
      { timestamp: '2026-03-31T10:45:00Z', field: 'status', message: 'Entry price hit — trade triggered' },
      { timestamp: '2026-04-01T03:10:00Z', field: 'status', message: 'Take profit hit at $39.50' },
    ],
  },
  // sub_003 — BNB Short (paused sub, older signals)
  {
    id: 'SIG-2810',
    subscription_id: 'sub_003',
    symbol: 'BNBUSDT',
    direction: 'SHORT',
    entry_price: 618.50,
    stop_loss: 637.00,
    take_profit: 585.00,
    risk_pct: 2.99,
    reward_pct: 5.42,
    win_rate: 0.64,
    matching_trades: 7,
    status: 'EXPIRED',
    created_at: '2026-03-28T16:00:00Z',
    triggered_at: null,
    resolved_at: '2026-03-29T16:00:00Z',
    result: null,
    updates: [
      { timestamp: '2026-03-28T16:00:00Z', field: 'created', message: 'Signal generated' },
      { timestamp: '2026-03-29T16:00:00Z', field: 'status', message: 'Signal expired — entry not reached within 24h' },
    ],
  },
  {
    id: 'SIG-2798',
    subscription_id: 'sub_003',
    symbol: 'BNBUSDT',
    direction: 'SHORT',
    entry_price: 625.00,
    stop_loss: 643.75,
    take_profit: 590.00,
    risk_pct: 3.00,
    reward_pct: 5.60,
    win_rate: 0.70,
    matching_trades: 10,
    status: 'HIT_TP',
    created_at: '2026-03-27T12:00:00Z',
    triggered_at: '2026-03-27T15:40:00Z',
    resolved_at: '2026-03-28T09:20:00Z',
    result: 'WIN',
    updates: [
      { timestamp: '2026-03-27T12:00:00Z', field: 'created', message: 'Signal generated' },
      { timestamp: '2026-03-27T15:40:00Z', field: 'status', message: 'Entry price hit — trade triggered' },
      { timestamp: '2026-03-28T09:20:00Z', field: 'status', message: 'Take profit hit at $590.00' },
    ],
  },
  {
    id: 'SIG-2785',
    subscription_id: 'sub_003',
    symbol: 'BNBUSDT',
    direction: 'SHORT',
    entry_price: 612.30,
    stop_loss: 630.70,
    take_profit: 578.00,
    risk_pct: 3.00,
    reward_pct: 5.60,
    win_rate: 0.67,
    matching_trades: 8,
    status: 'HIT_SL',
    created_at: '2026-03-26T08:00:00Z',
    triggered_at: '2026-03-26T11:10:00Z',
    resolved_at: '2026-03-26T18:30:00Z',
    result: 'LOSS',
    updates: [
      { timestamp: '2026-03-26T08:00:00Z', field: 'created', message: 'Signal generated' },
      { timestamp: '2026-03-26T11:10:00Z', field: 'status', message: 'Entry price hit — trade triggered' },
      { timestamp: '2026-03-26T18:30:00Z', field: 'status', message: 'Stop loss hit at $630.70' },
    ],
  },
];

/* ─── Performance Stats ─── */

export const mockPerformance = {
  total_signals: 89,
  triggered: 67,
  wins: 48,
  losses: 19,
  expired: 22,
  win_rate: 0.716,
  avg_profit_pct: 2.3,
  avg_loss_pct: -1.1,
  total_return_pct: 18.7,
};

/* ─── Equity Curve ─── */

function generateEquityCurve(days, endPct) {
  const points = [];
  const now = new Date('2026-04-03T00:00:00Z');
  const volatility = endPct / days * 2.5;
  let cumulative = 0;

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Drift toward target with realistic noise
    const drift = endPct / days;
    const noise = (Math.sin(i * 1.7) * 0.4 + Math.cos(i * 0.9) * 0.3) * volatility;
    cumulative += drift + noise;

    // Clamp to avoid going too far below 0 or too far above target
    if (i > days * 0.2) {
      cumulative = Math.max(cumulative, -endPct * 0.15);
    }

    points.push({
      date: date.toISOString().slice(0, 10),
      cumulative_pct: Math.round(cumulative * 100) / 100,
    });
  }

  // Ensure the last point matches the target
  points[points.length - 1].cumulative_pct = endPct;

  return points;
}

export const mockEquityCurve = {
  '30D': generateEquityCurve(30, 5.8),
  '90D': generateEquityCurve(90, 18.7),
  'ALL': generateEquityCurve(120, 18.7),
};

/* ─── Subscription / Billing ─── */

export const mockSubscription = {
  plan: 'basic',
  status: 'active',
  price_monthly: 5,
  price_yearly: 50,
  next_billing: '2026-05-01',
  started_at: '2026-03-01',
  signals_used: 3,
  signals_limit: 5,
};

/* ─── Helper: get signals for a subscription ─── */

export function getSignalsForSubscription(subscriptionId) {
  return mockSignals.filter((s) => s.subscription_id === subscriptionId);
}

/* ─── Helper: get active signals count ─── */

export function getActiveSignalsCount() {
  return mockSignals.filter((s) => s.status === 'ACTIVE' || s.status === 'UPDATED' || s.status === 'TRIGGERED').length;
}

/* ─── Helper: get recent signals (last N) ─── */

export function getRecentSignals(limit = 5) {
  return [...mockSignals]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);
}
