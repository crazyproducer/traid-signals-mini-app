/* ═══════════════════════════════════════════════
   Wizard Options — Signal Subscription Configuration
   ═══════════════════════════════════════════════ */

export const STRATEGIES = [
  {
    value: 'pullback',
    label: 'Pull Back',
    description: 'Pullback entry levels using local extremes and retracement',
  },
];

export const RISK_LEVELS = [
  { value: 1, label: '1%', description: 'Ultra-tight stop' },
  { value: 5, label: '5%', description: 'Conservative' },
  { value: 10, label: '10%', description: 'Moderate' },
  { value: 20, label: '20%', description: 'Wide stop' },
  { value: 30, label: '30%', description: 'Very wide' },
];

/* ═══════════════════════════════════════════════
   Wizard quality dials (Phase 4: D2 design — two explicit thresholds
   instead of one "confidence" knob).

   The wizard now splits the old single "confidence" step into two:
   MIN_TRADES (statistical significance — how many backtest trades
   support this combo) and MIN_WIN_RATES (the actual probability
   threshold). Plus a new TIME_RANGES dial that limits both display
   stats and matcher predicate to a recent window.
   ═══════════════════════════════════════════════ */

export const MIN_TRADES = [
  { value: 10,  label: '10+ trades',  description: 'Lowest bar — may catch unproven setups' },
  { value: 30,  label: '30+ trades',  description: 'Balanced — enough data to be meaningful' },
  { value: 100, label: '100+ trades', description: 'Strong evidence — fewer combos qualify' },
];

export const MIN_WIN_RATES = [
  { value: 0.66, label: '66%+', description: 'Loose — more signals, modest edge' },
  { value: 0.75, label: '75%+', description: 'Balanced — strong historical performance' },
  { value: 0.90, label: '90%+', description: 'Strict — fewer signals, top performers' },
];

export const TIME_RANGES = [
  { value: 1,    label: 'Last month',   description: 'Only very recent performance' },
  { value: 3,    label: 'Last 3 months', description: 'Recent regime' },
  { value: 6,    label: 'Last 6 months', description: 'Medium-term — balanced' },
  { value: 12,   label: 'Last 12 months', description: 'Full year — broad sample' },
  { value: null, label: 'All time',     description: 'All available history (default)' },
];

/* DEPRECATED — kept for backward import compat with any not-yet-updated screens.
   Will be removed once the rewire is complete. */
export const CONFIDENCE_LEVELS = MIN_TRADES;

export const DIRECTIONS = [
  { value: 'LONG', label: 'Long', description: 'Profit when price goes up' },
  { value: 'SHORT', label: 'Short', description: 'Profit when price goes down' },
];

/* V1 ships with BTCUSDT only. As msrv-symbols-history's whitelist
   expands, the gateway's GET /api/signals/symbols will return more
   pairs and the wizard step will source from there at load time. */
export const SYMBOLS = [
  { value: 'BTCUSDT', label: 'BTC/USDT', base: 'BTC', name: 'Bitcoin' },
];

export const FREQUENCIES = [
  { value: '4h', label: 'Several times per day', description: 'More signals, faster updates' },
  { value: '24h', label: 'Once a day or less', description: 'Fewer signals, daily analysis' },
];

export const EMA_FILTERS = [
  { value: 20, label: 'EMA 20', description: 'Short-term trend' },
  { value: 50, label: 'EMA 50', description: 'Medium-term trend' },
  { value: 100, label: 'EMA 100', description: 'Long-term trend' },
  { value: 200, label: 'EMA 200', description: 'Macro trend' },
];

/* ═══════════════════════════════════════════════
   Mock record counts — progressively decreasing
   Total database: 125,847 records
   ═══════════════════════════════════════════════ */
export const RECORD_COUNTS = {
  strategy: { pullback: 125847 },
  risk: { 1: 8420, 5: 31250, 10: 42180, 20: 28940, 30: 15057 },
  confidence: { 0.5: 28750, 0.6: 18420, 0.7: 9830 },
  direction: { LONG: 5890, SHORT: 3940 },
  symbol: {
    BTCUSDT: 1820, ETHUSDT: 1540, SOLUSDT: 980, BNBUSDT: 870,
    XRPUSDT: 760, ADAUSDT: 650, AVAXUSDT: 580, DOGEUSDT: 520,
    DOTUSDT: 440, LINKUSDT: 390,
  },
  frequency: { '4h': 4200, '24h': 2890 },
  ema: { 20: 3100, 50: 2800, 100: 2200, 200: 1600 },
};

/* ═══════════════════════════════════════════════
   Subscription plans
   ═══════════════════════════════════════════════ */
export const SUBSCRIPTION_PLANS = [
  {
    value: 'free', label: 'Free', price_monthly: 0, price_yearly: 0,
    symbols_limit: 1, configs_limit: 1,
    features: ['1 symbol', '1 configuration', 'All timeframes', 'All strategies & filters', 'Full notifications'],
  },
  {
    value: 'basic', label: 'Basic', price_monthly: 5, price_yearly: 50,
    symbols_limit: 5, configs_limit: 3,
    features: ['Up to 5 symbols', '3 configurations', 'All timeframes', 'Full performance dashboard', 'Signal update notifications'],
  },
  {
    value: 'premium', label: 'Premium', price_monthly: 20, price_yearly: 200,
    symbols_limit: null, configs_limit: null,
    features: ['All symbols (unlimited)', 'Unlimited configurations', 'All timeframes', 'Full performance dashboard', 'Priority signal delivery', 'Advanced analytics'],
  },
];

/* ═══════════════════════════════════════════════
   Signal status constants
   ═══════════════════════════════════════════════ */
export const SIGNAL_STATUSES = { PENDING: 'PENDING', ACTIVE: 'ACTIVE', UPDATED: 'UPDATED', TRIGGERED: 'TRIGGERED', HIT_TP: 'HIT_TP', HIT_SL: 'HIT_SL', EXPIRED: 'EXPIRED' };
export const SIGNAL_RESULTS = { WIN: 'WIN', LOSS: 'LOSS' };
export const SUBSCRIPTION_STATUSES = { ACTIVE: 'active', PAUSED: 'paused', CANCELLED: 'cancelled' };
