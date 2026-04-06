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
    directions: ['LONG', 'SHORT'],
    frequency: '4h',
    strategies: ['pullback'],
    ema_filters: [50],
    risk_level: 10,
    confidence: 0.6,
    status: 'active',
    signals_count: 42,
    triggered: 32,
    wins: 23,
    losses: 9,
    win_rate: 0.719,
    pnl_pct: 18.7,
    created_at: '2026-03-01T08:00:00Z',
  },
  {
    id: 'sub_002',
    user_id: 'usr_a1b2c3d4',
    symbols: ['SOLUSDT', 'AVAXUSDT', 'LINKUSDT', 'ADAUSDT'],
    directions: ['LONG'],
    frequency: '24h',
    strategies: ['pullback'],
    ema_filters: [200],
    risk_level: 5,
    confidence: 0.7,
    status: 'active',
    signals_count: 31,
    triggered: 22,
    wins: 17,
    losses: 5,
    win_rate: 0.773,
    pnl_pct: 24.3,
    created_at: '2026-03-05T12:00:00Z',
  },
  {
    id: 'sub_003',
    user_id: 'usr_a1b2c3d4',
    symbols: ['BNBUSDT', 'XRPUSDT'],
    directions: ['SHORT'],
    frequency: '4h',
    strategies: ['pullback'],
    ema_filters: [],
    risk_level: 20,
    confidence: 0.5,
    status: 'paused',
    signals_count: 16,
    triggered: 11,
    wins: 6,
    losses: 5,
    win_rate: 0.545,
    pnl_pct: -3.2,
    created_at: '2026-03-10T16:00:00Z',
  },
];

/* ─── Signals ─── */

export const mockSignals = [
  // ── New / Pending signals (not yet activated) ──
  {
    id: 'SIG-2855',
    subscription_id: 'sub_001',
    symbol: 'BTCUSDT',
    direction: 'LONG',
    entry_price: 65800.00,
    stop_loss: 64520.00,
    take_profit: 68400.00,
    risk_pct: 1.94,
    reward_pct: 3.95,
    win_rate: 0.74,
    matching_trades: 21,
    status: 'PENDING',
    created_at: '2026-04-04T06:00:00Z',
    triggered_at: null,
    resolved_at: null,
    result: null,
    updates: [
      { timestamp: '2026-04-04T06:00:00Z', field: 'created', message: 'Signal generated — awaiting activation' },
    ],
  },
  {
    id: 'SIG-2854',
    subscription_id: 'sub_002',
    symbol: 'SOLUSDT',
    direction: 'LONG',
    entry_price: 139.50,
    stop_loss: 135.80,
    take_profit: 148.20,
    risk_pct: 2.65,
    reward_pct: 6.24,
    win_rate: 0.70,
    matching_trades: 15,
    status: 'PENDING',
    created_at: '2026-04-04T06:00:00Z',
    triggered_at: null,
    resolved_at: null,
    result: null,
    updates: [
      { timestamp: '2026-04-04T06:00:00Z', field: 'created', message: 'Signal generated — awaiting activation' },
    ],
  },
  {
    id: 'SIG-2853',
    subscription_id: 'sub_001',
    symbol: 'ETHUSDT',
    direction: 'LONG',
    entry_price: 3420.00,
    stop_loss: 3350.00,
    take_profit: 3580.00,
    risk_pct: 2.05,
    reward_pct: 4.68,
    win_rate: 0.69,
    matching_trades: 13,
    status: 'PENDING',
    created_at: '2026-04-04T05:30:00Z',
    triggered_at: null,
    resolved_at: null,
    result: null,
    updates: [
      { timestamp: '2026-04-04T05:30:00Z', field: 'created', message: 'Signal generated — awaiting activation' },
    ],
  },
  // ── New / Pending SHORT signals ──
  {
    id: 'SIG-2852',
    subscription_id: 'sub_003',
    symbol: 'BNBUSDT',
    direction: 'SHORT',
    entry_price: 625.00,
    stop_loss: 643.75,
    take_profit: 590.00,
    risk_pct: 3.00,
    reward_pct: 5.60,
    win_rate: 0.68,
    matching_trades: 11,
    status: 'PENDING',
    created_at: '2026-04-04T07:00:00Z',
    triggered_at: null,
    resolved_at: null,
    result: null,
    updates: [
      { timestamp: '2026-04-04T07:00:00Z', field: 'created', message: 'Signal generated — awaiting activation' },
    ],
  },
  {
    id: 'SIG-2851',
    subscription_id: 'sub_003',
    symbol: 'XRPUSDT',
    direction: 'SHORT',
    entry_price: 0.62,
    stop_loss: 0.645,
    take_profit: 0.575,
    risk_pct: 4.03,
    reward_pct: 7.26,
    win_rate: 0.65,
    matching_trades: 9,
    status: 'UPDATED',
    created_at: '2026-04-04T05:00:00Z',
    triggered_at: null,
    resolved_at: null,
    result: null,
    updates: [
      { timestamp: '2026-04-04T05:00:00Z', field: 'created', message: 'Signal generated' },
      { timestamp: '2026-04-04T07:00:00Z', field: 'entry_price', message: 'Entry updated: $0.625 -> $0.620' },
    ],
  },
  // ── Active signals ──
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
    current_price: 67450.00,
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
  // ── Triggered LONG in loss ──
  {
    id: 'SIG-2834',
    subscription_id: 'sub_002',
    symbol: 'ADAUSDT',
    direction: 'LONG',
    entry_price: 0.485,
    stop_loss: 0.460,
    take_profit: 0.530,
    risk_pct: 5.15,
    reward_pct: 9.28,
    win_rate: 0.67,
    matching_trades: 14,
    status: 'TRIGGERED',
    current_price: 0.472,
    created_at: '2026-04-02T08:00:00Z',
    triggered_at: '2026-04-02T10:00:00Z',
    resolved_at: null,
    result: null,
    updates: [
      { timestamp: '2026-04-02T08:00:00Z', field: 'created', message: 'Signal generated' },
      { timestamp: '2026-04-02T10:00:00Z', field: 'status', message: 'Entry price hit — trade triggered' },
    ],
  },
  // ── Triggered SHORT signals ──
  {
    id: 'SIG-2833',
    subscription_id: 'sub_003',
    symbol: 'BNBUSDT',
    direction: 'SHORT',
    entry_price: 620.00,
    stop_loss: 638.60,
    take_profit: 585.00,
    risk_pct: 3.00,
    reward_pct: 5.65,
    win_rate: 0.66,
    matching_trades: 10,
    status: 'TRIGGERED',
    current_price: 612.50,
    created_at: '2026-04-02T16:00:00Z',
    triggered_at: '2026-04-02T18:30:00Z',
    resolved_at: null,
    result: null,
    updates: [
      { timestamp: '2026-04-02T16:00:00Z', field: 'created', message: 'Signal generated' },
      { timestamp: '2026-04-02T18:30:00Z', field: 'status', message: 'Entry price hit — trade triggered' },
    ],
  },
  {
    id: 'SIG-2831',
    subscription_id: 'sub_003',
    symbol: 'XRPUSDT',
    direction: 'SHORT',
    entry_price: 0.615,
    stop_loss: 0.640,
    take_profit: 0.572,
    risk_pct: 4.07,
    reward_pct: 6.99,
    win_rate: 0.63,
    matching_trades: 8,
    status: 'TRIGGERED',
    current_price: 0.628,
    created_at: '2026-04-02T12:00:00Z',
    triggered_at: '2026-04-02T14:45:00Z',
    resolved_at: null,
    result: null,
    updates: [
      { timestamp: '2026-04-02T12:00:00Z', field: 'created', message: 'Signal generated' },
      { timestamp: '2026-04-02T14:45:00Z', field: 'status', message: 'Entry price hit — trade triggered' },
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
  // ── Long HIT_SL ──
  {
    id: 'SIG-2815',
    subscription_id: 'sub_001',
    symbol: 'BTCUSDT',
    direction: 'LONG',
    entry_price: 66800.00,
    stop_loss: 65460.00,
    take_profit: 69500.00,
    risk_pct: 2.01,
    reward_pct: 4.04,
    win_rate: 0.70,
    matching_trades: 19,
    status: 'HIT_SL',
    created_at: '2026-03-30T08:00:00Z',
    triggered_at: '2026-03-30T12:20:00Z',
    resolved_at: '2026-03-30T22:10:00Z',
    result: 'LOSS',
    updates: [
      { timestamp: '2026-03-30T08:00:00Z', field: 'created', message: 'Signal generated' },
      { timestamp: '2026-03-30T12:20:00Z', field: 'status', message: 'Entry price hit — trade triggered' },
      { timestamp: '2026-03-30T22:10:00Z', field: 'status', message: 'Stop loss hit at $65,460.00' },
    ],
  },
  // ── Expired LONG ──
  {
    id: 'SIG-2812',
    subscription_id: 'sub_001',
    symbol: 'ETHUSDT',
    direction: 'LONG',
    entry_price: 3380.00,
    stop_loss: 3310.00,
    take_profit: 3540.00,
    risk_pct: 2.07,
    reward_pct: 4.73,
    win_rate: 0.72,
    matching_trades: 17,
    status: 'EXPIRED',
    created_at: '2026-03-29T08:00:00Z',
    triggered_at: null,
    resolved_at: '2026-03-30T08:00:00Z',
    result: null,
    updates: [
      { timestamp: '2026-03-29T08:00:00Z', field: 'created', message: 'Signal generated' },
      { timestamp: '2026-03-30T08:00:00Z', field: 'status', message: 'Signal expired — entry not reached within 24h' },
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
  plan: 'free',
  status: 'active',
  price_monthly: 0,
  price_yearly: 0,
  next_billing: null,
  started_at: '2026-03-01',
  configs_used: 1,
  configs_limit: 1,
  symbols_used: 1,
  symbols_limit: 1,
};

/* ─── Helper: get signals for a subscription ─── */

export function getSignalsForSubscription(subscriptionId) {
  return mockSignals.filter((s) => s.subscription_id === subscriptionId);
}

/* ─── Helper: get active signals count ─── */

export function getActiveSignalsCount() {
  return mockSignals.filter((s) => s.status === 'ACTIVE' || s.status === 'UPDATED' || s.status === 'TRIGGERED').length;
}

export function getNewSignalsCount() {
  return mockSignals.filter((s) => s.status === 'PENDING').length;
}

/* ─── Helper: get recent signals (last N) ─── */

export function getRecentSignals(limit = 5) {
  return [...mockSignals]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);
}

/* ─── Templates — auto-generated top performers ─── */

export const mockTemplateEquityCurve = generateEquityCurve(90, 28.5);

export const mockTemplateSignals = [
  { id: 'TS-101', symbol: 'BTCUSDT', direction: 'LONG', entry_price: 64200, stop_loss: 62916, take_profit: 67410, risk_pct: 2.0, reward_pct: 5.0, win_rate: 0.78, matching_trades: 22, status: 'HIT_TP', result: 'WIN', created_at: '2026-03-28T08:00:00Z', triggered_at: '2026-03-28T14:20:00Z', resolved_at: '2026-03-29T06:10:00Z', updates: [] },
  { id: 'TS-102', symbol: 'ETHUSDT', direction: 'LONG', entry_price: 3420, stop_loss: 3352, take_profit: 3591, risk_pct: 2.0, reward_pct: 5.0, win_rate: 0.74, matching_trades: 18, status: 'HIT_TP', result: 'WIN', created_at: '2026-03-27T12:00:00Z', triggered_at: '2026-03-27T18:40:00Z', resolved_at: '2026-03-28T10:30:00Z', updates: [] },
  { id: 'TS-103', symbol: 'SOLUSDT', direction: 'LONG', entry_price: 138.50, stop_loss: 135.73, take_profit: 145.43, risk_pct: 2.0, reward_pct: 5.0, win_rate: 0.71, matching_trades: 14, status: 'HIT_SL', result: 'LOSS', created_at: '2026-03-26T08:00:00Z', triggered_at: '2026-03-26T11:15:00Z', resolved_at: '2026-03-26T19:45:00Z', updates: [] },
  { id: 'TS-104', symbol: 'BTCUSDT', direction: 'LONG', entry_price: 65800, stop_loss: 64484, take_profit: 69090, risk_pct: 2.0, reward_pct: 5.0, win_rate: 0.76, matching_trades: 20, status: 'HIT_TP', result: 'WIN', created_at: '2026-03-25T08:00:00Z', triggered_at: '2026-03-25T10:30:00Z', resolved_at: '2026-03-26T02:15:00Z', updates: [] },
  { id: 'TS-105', symbol: 'BNBUSDT', direction: 'SHORT', entry_price: 620.00, stop_loss: 632.40, take_profit: 589.00, risk_pct: 2.0, reward_pct: 5.0, win_rate: 0.68, matching_trades: 12, status: 'HIT_TP', result: 'WIN', created_at: '2026-03-24T16:00:00Z', triggered_at: '2026-03-24T20:10:00Z', resolved_at: '2026-03-25T14:30:00Z', updates: [] },
  { id: 'TS-106', symbol: 'ETHUSDT', direction: 'LONG', entry_price: 3380, stop_loss: 3312, take_profit: 3549, risk_pct: 2.0, reward_pct: 5.0, win_rate: 0.73, matching_trades: 16, status: 'HIT_SL', result: 'LOSS', created_at: '2026-03-23T12:00:00Z', triggered_at: '2026-03-23T15:50:00Z', resolved_at: '2026-03-23T22:20:00Z', updates: [] },
  { id: 'TS-107', symbol: 'BTCUSDT', direction: 'LONG', entry_price: 63500, stop_loss: 62230, take_profit: 66675, risk_pct: 2.0, reward_pct: 5.0, win_rate: 0.77, matching_trades: 21, status: 'HIT_TP', result: 'WIN', created_at: '2026-03-22T08:00:00Z', triggered_at: '2026-03-22T12:45:00Z', resolved_at: '2026-03-23T08:00:00Z', updates: [] },
  { id: 'TS-108', symbol: 'SOLUSDT', direction: 'LONG', entry_price: 142.20, stop_loss: 139.36, take_profit: 149.31, risk_pct: 2.0, reward_pct: 5.0, win_rate: 0.70, matching_trades: 13, status: 'HIT_TP', result: 'WIN', created_at: '2026-03-21T08:00:00Z', triggered_at: '2026-03-21T10:20:00Z', resolved_at: '2026-03-22T04:10:00Z', updates: [] },
];

export const mockTemplates = [
  {
    id: 'tpl_001',
    name: 'BTC Conservative Long',
    description: 'Low-risk Bitcoin pullback entries on daily timeframe',
    strategies: ['pullback'],
    directions: ['LONG'],
    symbols: ['BTCUSDT'],
    frequency: '24h',
    risk_level: 5,
    confidence: 0.7,
    ema_filters: [200],
    signals_count: 156,
    triggered: 118,
    win_rate: 0.78,
    pnl_pct: 34.2,
    users: 847,
  },
  {
    id: 'tpl_002',
    name: 'ETH/SOL Momentum',
    description: 'Medium-risk multi-coin pullbacks with EMA trend filter',
    strategies: ['pullback'],
    directions: ['LONG'],
    symbols: ['ETHUSDT', 'SOLUSDT'],
    frequency: '4h',
    risk_level: 10,
    confidence: 0.6,
    ema_filters: [50],
    signals_count: 243,
    triggered: 189,
    win_rate: 0.72,
    pnl_pct: 28.7,
    users: 612,
  },
  {
    id: 'tpl_003',
    name: 'Multi-coin Both Directions',
    description: 'Balanced long and short entries across top coins',
    strategies: ['pullback'],
    directions: ['LONG', 'SHORT'],
    symbols: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'],
    frequency: '4h',
    risk_level: 10,
    confidence: 0.6,
    ema_filters: [50, 100],
    signals_count: 412,
    triggered: 310,
    win_rate: 0.69,
    pnl_pct: 22.1,
    users: 1243,
  },
  {
    id: 'tpl_004',
    name: 'BNB Short Aggressive',
    description: 'High-risk short entries on BNB with tight stops',
    strategies: ['pullback'],
    directions: ['SHORT'],
    symbols: ['BNBUSDT'],
    frequency: '4h',
    risk_level: 20,
    confidence: 0.5,
    ema_filters: [],
    signals_count: 98,
    triggered: 72,
    win_rate: 0.63,
    pnl_pct: 15.4,
    users: 234,
  },
  {
    id: 'tpl_005',
    name: 'Top-5 Daily Safe',
    description: 'Conservative daily signals across top 5 coins with strong trend filter',
    strategies: ['pullback'],
    directions: ['LONG'],
    symbols: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT'],
    frequency: '24h',
    risk_level: 5,
    confidence: 0.7,
    ema_filters: [100, 200],
    signals_count: 187,
    triggered: 142,
    win_rate: 0.76,
    pnl_pct: 31.5,
    users: 956,
  },
];
