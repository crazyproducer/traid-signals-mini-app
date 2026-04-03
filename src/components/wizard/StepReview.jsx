import { SYMBOLS, STRATEGIES, EMA_FILTERS, CONFIDENCE_LEVELS, MOCK_RECORD_COUNTS } from '../../utils/constants';
import { Rocket } from 'lucide-react';

function getSymbolLabels(values) {
  return values
    .map((v) => SYMBOLS.find((s) => s.value === v)?.base || v)
    .join(', ');
}

function getStrategyLabel(value) {
  return STRATEGIES.find((s) => s.value === value)?.label || value;
}

function getEmaLabels(values) {
  if (!values || values.length === 0) return 'None';
  return values
    .sort((a, b) => a - b)
    .map((v) => EMA_FILTERS.find((f) => f.value === v)?.label || `EMA ${v}`)
    .join(', ');
}

function getConfidenceLabel(value) {
  return CONFIDENCE_LEVELS.find((c) => c.value === value)?.label || String(value);
}

function getDirectionLabels(values) {
  if (!values || values.length === 0) return '--';
  return values.join(' + ');
}

/**
 * Estimate final record count based on all selections (mock).
 * This is a rough heuristic combining the mock counts.
 */
function estimateFinalCount(data) {
  // Start from confidence count (after strategy + risk + confidence narrowing)
  let base = MOCK_RECORD_COUNTS.confidence[data.confidence] || 0;

  // Direction filter: ratio of selected directions
  const totalDirectionRecords = MOCK_RECORD_COUNTS.direction.LONG + MOCK_RECORD_COUNTS.direction.SHORT;
  let directionRecords = 0;
  if (data.directions.includes('LONG')) directionRecords += MOCK_RECORD_COUNTS.direction.LONG;
  if (data.directions.includes('SHORT')) directionRecords += MOCK_RECORD_COUNTS.direction.SHORT;
  if (totalDirectionRecords > 0) {
    base = Math.round(base * (directionRecords / totalDirectionRecords));
  }

  // Symbols filter: ratio of selected symbols to all symbols
  const allSymbolRecords = Object.values(MOCK_RECORD_COUNTS.symbols).reduce((a, b) => a + b, 0);
  const selectedSymbolRecords = data.symbols.reduce((sum, sym) => sum + (MOCK_RECORD_COUNTS.symbols[sym] || 0), 0);
  if (allSymbolRecords > 0) {
    base = Math.round(base * (selectedSymbolRecords / allSymbolRecords));
  }

  // Frequency filter
  const totalFreqRecords = MOCK_RECORD_COUNTS.frequency['4h'] + MOCK_RECORD_COUNTS.frequency['24h'];
  const selectedFreq = MOCK_RECORD_COUNTS.frequency[data.frequency] || 0;
  if (totalFreqRecords > 0) {
    base = Math.round(base * (selectedFreq / totalFreqRecords));
  }

  // EMA filters reduce somewhat (more filters = slightly less overlap)
  if (data.ema_filters.length > 0) {
    const reductionFactor = Math.max(0.4, 1 - data.ema_filters.length * 0.12);
    base = Math.round(base * reductionFactor);
  }

  return Math.max(1, base);
}

const REVIEW_ROWS = [
  { label: 'Strategy', key: 'strategy', format: (v) => getStrategyLabel(v) },
  { label: 'Risk Level', key: 'risk_level', format: (v) => `${v}%` },
  { label: 'Confidence', key: 'confidence', format: (v) => getConfidenceLabel(v) },
  { label: 'Direction', key: 'directions', format: (v) => getDirectionLabels(v) },
  { label: 'Symbols', key: 'symbols', format: (v) => getSymbolLabels(v) },
  { label: 'Timeframe', key: 'frequency', format: (v) => (v === '4h' ? 'Every 4 hours' : 'Every 24 hours') },
  { label: 'EMA Filters', key: 'ema_filters', format: (v) => getEmaLabels(v) },
];

export default function StepReview({ data }) {
  const finalCount = estimateFinalCount(data);

  return (
    <div>
      {/* Hero record count */}
      <div className="text-center mb-5">
        <span
          className="text-[42px] font-bold text-tg-text font-mono leading-none"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {finalCount.toLocaleString()}
        </span>
        <p className="text-[13px] text-tg-hint mt-1">
          estimated matching records
        </p>
      </div>

      {/* Summary card */}
      <div className="card-premium p-5">
        <div className="flex flex-col divide-y divide-tg-secondary/60">
          {REVIEW_ROWS.map((row) => {
            const value = data[row.key];
            if (value === null || value === undefined) return null;
            // Skip empty arrays
            if (Array.isArray(value) && value.length === 0 && row.key !== 'ema_filters') return null;

            return (
              <div
                key={row.key}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <span className="text-[13px] text-tg-hint">{row.label}</span>
                <span className="text-[14px] font-semibold text-tg-text text-right max-w-[60%] truncate">
                  {row.format(value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Launch context */}
      <div className="mt-5 flex flex-col items-center gap-2 px-4">
        <div className="icon-gradient-green w-12 h-12 rounded-full flex items-center justify-center">
          <Rocket size={22} strokeWidth={2} className="text-white" />
        </div>
        <p className="text-[14px] font-semibold text-tg-text text-center">
          Ready to launch your signal
        </p>
        <p className="text-[12px] text-tg-hint text-center leading-relaxed max-w-[280px]">
          You will start receiving trading signals based on your configuration. You can pause or edit anytime.
        </p>
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-tg-hint/60 text-center mt-4 px-2 leading-relaxed">
        Based on historical backtests. Past performance does not guarantee future results.
      </p>
    </div>
  );
}
