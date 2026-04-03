/**
 * Format USD value: $24,890.44
 */
export function formatUsd(value) {
  return '$' + Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Format USD PnL with sign: +$142.30 or -$18.40
 * Returns { text: string, isPositive: boolean, isNegative: boolean, isZero: boolean }
 */
export function formatPnlUsd(value) {
  const isZero = value === 0;
  const isPositive = value > 0;
  const isNegative = value < 0;
  const sign = isZero ? '' : isPositive ? '+' : '-';
  const text = sign + '$' + Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return { text, isPositive, isNegative, isZero };
}

/**
 * Format percentage with sign: +1.8% or -0.5%
 * Returns { text: string, isPositive: boolean, isNegative: boolean, isZero: boolean }
 */
export function formatPct(value) {
  const isZero = value === 0;
  const isPositive = value > 0;
  const isNegative = value < 0;
  const sign = isZero ? '' : isPositive ? '+' : '-';
  const text = sign + Math.abs(value).toFixed(1) + '%';
  return { text, isPositive, isNegative, isZero };
}

/**
 * Format relative time: "2m ago", "1h ago", "Yesterday", "3d ago"
 */
export function formatRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - new Date(timestamp).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + 'm ago';
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + 'h ago';
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return days + 'd ago';
}

/**
 * Format duration in seconds to human readable: "2h 15m", "45m", "3d 2h"
 */
export function formatDuration(seconds) {
  if (seconds < 60) return '<1m';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + 'm';
  const hours = Math.floor(minutes / 60);
  const remainMinutes = minutes % 60;
  if (hours < 24) return hours + 'h' + (remainMinutes > 0 ? ' ' + remainMinutes + 'm' : '');
  const days = Math.floor(hours / 24);
  const remainHours = hours % 24;
  return days + 'd' + (remainHours > 0 ? ' ' + remainHours + 'h' : '');
}

/**
 * Color class for PnL value
 */
export function pnlColorClass(value) {
  if (value > 0) return 'text-green';
  if (value < 0) return 'text-red';
  return 'text-tg-text';
}

/* ═══════════════════════════════════════════════
   Display name mappings
   ═══════════════════════════════════════════════ */

const EXCHANGE_DISPLAY = {
  binancepaperexchangelogic: 'Paper',
  binancepaper: 'Paper',
  binance: 'Binance',
  bybit: 'ByBit',
};

const STRATEGY_DISPLAY = {
  dca1logic: 'DCA Long',
  dca1: 'DCA Long',
  dca1ind: 'DCA Long',
  dca2logic: 'DCA Short',
  dca2: 'DCA Short',
  dca2ind: 'DCA Short',
};

/**
 * Map raw exchange name to short display name (case-insensitive)
 */
export function displayExchange(raw) {
  if (!raw) return raw;
  return EXCHANGE_DISPLAY[raw.toLowerCase()] || raw;
}

/**
 * Map raw strategy name to user-friendly display name (case-insensitive)
 */
export function displayStrategy(raw) {
  if (!raw) return raw;
  return STRATEGY_DISPLAY[raw.toLowerCase()] || raw;
}

/**
 * Get exchange brand color by raw name
 */
const EXCHANGE_COLOR_MAP = {
  binance: '#3b82f6',
  binancepaper: '#3b82f6',
  binancepaperexchangelogic: '#3b82f6',
  bybit: '#8b5cf6',
};

export function exchangeColor(raw) {
  if (!raw) return '#999999';
  return EXCHANGE_COLOR_MAP[raw.toLowerCase()] || '#999999';
}

/* ═══════════════════════════════════════════════
   Signal-specific formatters
   ═══════════════════════════════════════════════ */

/**
 * Format signal ID: "SIG-2847" → "#SIG-2847"
 */
export function formatSignalId(id) {
  if (!id) return '';
  const cleaned = String(id).replace(/^#/, '');
  if (cleaned.toUpperCase().startsWith('SIG-')) {
    return '#' + cleaned.toUpperCase();
  }
  return '#SIG-' + cleaned;
}

/**
 * Format win rate (0-1) to percentage: 0.725 → "72.5%"
 */
export function formatWinRate(rate) {
  if (rate == null) return '--';
  return (rate * 100).toFixed(1) + '%';
}

/**
 * Format risk:reward ratio: formatRiskReward(1, 2.3) → "1:2.3"
 */
export function formatRiskReward(risk, reward) {
  if (risk == null || reward == null) return '--';
  const ratio = reward / risk;
  return '1:' + ratio.toFixed(1);
}

/**
 * Format trade direction with proper casing: "LONG" → "Long", "short" → "Short"
 */
export function formatDirection(dir) {
  if (!dir) return '';
  const lower = String(dir).toLowerCase();
  if (lower === 'long') return 'Long';
  if (lower === 'short') return 'Short';
  return dir.charAt(0).toUpperCase() + dir.slice(1).toLowerCase();
}

/**
 * Format crypto price with appropriate decimal places
 * BTC: 2 decimals, ETH: 2 decimals, small coins: up to 4 decimals
 */
export function formatCryptoPrice(price) {
  if (price == null) return '--';
  if (price >= 1000) {
    return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (price >= 1) {
    return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  }
  return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 });
}

/**
 * Format signal status for display
 */
const SIGNAL_STATUS_DISPLAY = {
  ACTIVE: 'Active',
  UPDATED: 'Updated',
  TRIGGERED: 'Triggered',
  HIT_TP: 'Hit TP',
  HIT_SL: 'Hit SL',
  EXPIRED: 'Expired',
};

export function formatSignalStatus(status) {
  if (!status) return '';
  return SIGNAL_STATUS_DISPLAY[status.toUpperCase()] || status;
}

/**
 * Color class for signal status
 */
export function signalStatusColorClass(status) {
  if (!status) return 'text-tg-hint';
  const upper = status.toUpperCase();
  if (upper === 'ACTIVE' || upper === 'TRIGGERED') return 'text-blue';
  if (upper === 'UPDATED') return 'text-yellow';
  if (upper === 'HIT_TP') return 'text-green';
  if (upper === 'HIT_SL') return 'text-red';
  if (upper === 'EXPIRED') return 'text-tg-hint';
  return 'text-tg-text';
}
