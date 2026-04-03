/* ═══════════════════════════════════════════════
   Wizard Options — Signal Subscription Configuration
   ═══════════════════════════════════════════════ */

/**
 * Top-10 crypto USDT trading pairs
 */
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

/**
 * Trade directions
 */
export const DIRECTIONS = [
  { value: 'LONG', label: 'Long', description: 'Profit when price goes up' },
  { value: 'SHORT', label: 'Short', description: 'Profit when price goes down' },
];

/**
 * Signal delivery frequencies / timeframes
 */
export const FREQUENCIES = [
  { value: '4h', label: 'Every 4 hours' },
  { value: '24h', label: 'Every 24 hours' },
];

/**
 * Available trading strategies
 */
export const STRATEGIES = [
  {
    value: 'pullback',
    label: 'Pull Back',
    description: 'Identifies pullback entry levels using local extremes and retracement calculations',
  },
];

/**
 * EMA filter options (for multi-select — no null option needed)
 */
export const EMA_FILTERS = [
  { value: 20, label: 'EMA 20' },
  { value: 50, label: 'EMA 50' },
  { value: 100, label: 'EMA 100' },
  { value: 200, label: 'EMA 200' },
];

/**
 * Maximum risk per trade (percentage of stop-loss distance)
 */
export const RISK_LEVELS = [1, 5, 10, 20, 30];

/**
 * Minimum confidence threshold for signals
 */
export const CONFIDENCE_LEVELS = [
  { value: 0.5, label: '50%+' },
  { value: 0.6, label: '60%+' },
  { value: 0.7, label: '70%+' },
];

/**
 * Subscription plans
 */
export const SUBSCRIPTION_PLANS = [
  {
    value: 'free',
    label: 'Free',
    price_monthly: 0,
    price_yearly: 0,
    symbols_limit: 1,
    frequency_restriction: '24h',
    features: [
      '1 symbol',
      'Daily signals only (24h)',
      'Basic performance stats',
    ],
  },
  {
    value: 'basic',
    label: 'Basic',
    price_monthly: 5,
    price_yearly: 50,
    symbols_limit: 5,
    frequency_restriction: null,
    features: [
      'Up to 5 symbols',
      '4h and 24h frequencies',
      'Full performance dashboard',
      'Signal update notifications',
    ],
  },
  {
    value: 'premium',
    label: 'Premium',
    price_monthly: 20,
    price_yearly: 200,
    symbols_limit: null,
    frequency_restriction: null,
    features: [
      'All symbols (unlimited)',
      '4h and 24h frequencies',
      'Full performance dashboard',
      'Signal update notifications',
      'Priority signal delivery',
      'Advanced analytics',
    ],
  },
];

/* ═══════════════════════════════════════════════
   Wizard step definitions
   ═══════════════════════════════════════════════ */

export const WIZARD_STEPS = [
  { key: 'strategy', title: 'Strategy', subtitle: 'Select a signal strategy' },
  { key: 'risk_level', title: 'Risk Level', subtitle: 'Maximum risk per trade (%)' },
  { key: 'confidence', title: 'Confidence', subtitle: 'Minimum confidence threshold' },
  { key: 'directions', title: 'Direction', subtitle: 'Choose trade direction(s)' },
  { key: 'symbols', title: 'Symbols', subtitle: 'Choose trading pairs to receive signals for' },
  { key: 'frequency', title: 'Timeframe', subtitle: 'How often should signals be generated?' },
  { key: 'ema_filters', title: 'Filters', subtitle: 'Optional EMA trend filters' },
  { key: 'review', title: 'Review & Launch', subtitle: 'Confirm your signal subscription' },
];

/* ═══════════════════════════════════════════════
   Mock record counts for wizard steps
   ═══════════════════════════════════════════════ */

// Total database: 125,847 records
export const MOCK_RECORD_COUNTS = {
  // Step 0: Strategy (from full database)
  strategy: {
    pullback: 125847,
  },
  // Step 1: Risk (after strategy selected)
  risk: {
    1: 8420,
    5: 31250,
    10: 42180,
    20: 28940,
    30: 15057,
  },
  // Step 2: Confidence (after risk)
  confidence: {
    0.5: 28750,
    0.6: 18420,
    0.7: 9830,
  },
  // Step 3: Direction (after confidence)
  direction: {
    LONG: 5890,
    SHORT: 3940,
  },
  // Step 4: Symbols (after direction)
  symbols: {
    BTCUSDT: 1820,
    ETHUSDT: 1540,
    SOLUSDT: 980,
    BNBUSDT: 870,
    XRPUSDT: 760,
    ADAUSDT: 650,
    AVAXUSDT: 580,
    DOGEUSDT: 520,
    DOTUSDT: 440,
    LINKUSDT: 390,
  },
  // Step 5: Frequency/Timeframe (after symbols)
  frequency: {
    '4h': 4200,
    '24h': 2890,
  },
  // Step 6: Filters/EMA (after frequency)
  ema: {
    20: 3100,
    50: 2800,
    100: 2200,
    200: 1600,
  },
};

/* ═══════════════════════════════════════════════
   Signal status constants
   ═══════════════════════════════════════════════ */

export const SIGNAL_STATUSES = {
  ACTIVE: 'ACTIVE',
  UPDATED: 'UPDATED',
  TRIGGERED: 'TRIGGERED',
  HIT_TP: 'HIT_TP',
  HIT_SL: 'HIT_SL',
  EXPIRED: 'EXPIRED',
};

export const SIGNAL_RESULTS = {
  WIN: 'WIN',
  LOSS: 'LOSS',
};

export const SUBSCRIPTION_STATUSES = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
};
