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

export const CONFIDENCE_LEVELS = [
  { value: 0.5, label: '50%+', description: 'More signals, lower threshold' },
  { value: 0.6, label: '60%+', description: 'Balanced quality and volume' },
  { value: 0.7, label: '70%+', description: 'Fewer signals, higher quality' },
];

export const DIRECTIONS = [
  { value: 'LONG', label: 'Long', description: 'Profit when price goes up' },
  { value: 'SHORT', label: 'Short', description: 'Profit when price goes down' },
];

export const SYMBOLS = [
  { value: 'BTCUSDT', label: 'BTC/USDT', base: 'BTC', name: 'Bitcoin' },
  { value: 'ETHUSDT', label: 'ETH/USDT', base: 'ETH', name: 'Ethereum' },
  { value: 'SOLUSDT', label: 'SOL/USDT', base: 'SOL', name: 'Solana' },
  { value: 'BNBUSDT', label: 'BNB/USDT', base: 'BNB', name: 'Binance Coin' },
  { value: 'XRPUSDT', label: 'XRP/USDT', base: 'XRP', name: 'Ripple' },
  { value: 'ADAUSDT', label: 'ADA/USDT', base: 'ADA', name: 'Cardano' },
  { value: 'AVAXUSDT', label: 'AVAX/USDT', base: 'AVAX', name: 'Avalanche' },
  { value: 'DOGEUSDT', label: 'DOGE/USDT', base: 'DOGE', name: 'Dogecoin' },
  { value: 'DOTUSDT', label: 'DOT/USDT', base: 'DOT', name: 'Polkadot' },
  { value: 'LINKUSDT', label: 'LINK/USDT', base: 'LINK', name: 'Chainlink' },
];

export const FREQUENCIES = [
  { value: '4h', label: 'Every 4 hours', description: 'More signals, faster updates' },
  { value: '24h', label: 'Every 24 hours', description: 'Fewer signals, daily analysis' },
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
    symbols_limit: 1, frequency_restriction: '24h',
    features: ['1 symbol', 'Daily signals only (24h)', 'Basic performance stats'],
  },
  {
    value: 'basic', label: 'Basic', price_monthly: 5, price_yearly: 50,
    symbols_limit: 5, frequency_restriction: null,
    features: ['Up to 5 symbols', '4h and 24h frequencies', 'Full performance dashboard', 'Signal update notifications'],
  },
  {
    value: 'premium', label: 'Premium', price_monthly: 20, price_yearly: 200,
    symbols_limit: null, frequency_restriction: null,
    features: ['All symbols (unlimited)', '4h and 24h frequencies', 'Full performance dashboard', 'Signal update notifications', 'Priority signal delivery', 'Advanced analytics'],
  },
];

/* ═══════════════════════════════════════════════
   Signal status constants
   ═══════════════════════════════════════════════ */
export const SIGNAL_STATUSES = { PENDING: 'PENDING', ACTIVE: 'ACTIVE', UPDATED: 'UPDATED', TRIGGERED: 'TRIGGERED', HIT_TP: 'HIT_TP', HIT_SL: 'HIT_SL', EXPIRED: 'EXPIRED' };
export const SIGNAL_RESULTS = { WIN: 'WIN', LOSS: 'LOSS' };
export const SUBSCRIPTION_STATUSES = { ACTIVE: 'active', PAUSED: 'paused', CANCELLED: 'cancelled' };
