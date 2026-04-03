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
 * Signal delivery frequencies
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
 * EMA filter options (null = no filter)
 */
export const EMA_FILTERS = [
  { value: null, label: 'No EMA filter' },
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
 * Minimum probability threshold for signal matching trades
 */
export const PROBABILITY_LEVELS = [
  { value: 0.66, label: '66%' },
  { value: 0.75, label: '75%' },
  { value: 0.90, label: '90%' },
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
  { key: 'symbols', title: 'Select Symbols', subtitle: 'Choose trading pairs to receive signals for' },
  { key: 'direction', title: 'Direction', subtitle: 'Choose your trade direction' },
  { key: 'frequency', title: 'Frequency', subtitle: 'How often should signals be generated?' },
  { key: 'strategy', title: 'Strategy', subtitle: 'Select a signal strategy' },
  { key: 'ema_filter', title: 'EMA Filter', subtitle: 'Optional trend filter' },
  { key: 'risk_level', title: 'Risk Level', subtitle: 'Maximum risk per trade (%)' },
  { key: 'confidence', title: 'Confidence', subtitle: 'Minimum confidence threshold' },
  { key: 'probability', title: 'Probability', subtitle: 'Minimum trade probability' },
  { key: 'review', title: 'Review', subtitle: 'Confirm your signal subscription' },
];

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
