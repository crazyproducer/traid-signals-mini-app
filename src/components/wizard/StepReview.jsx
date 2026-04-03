import { SYMBOLS, STRATEGIES, EMA_FILTERS, CONFIDENCE_LEVELS, PROBABILITY_LEVELS } from '../../utils/constants';
import { Rocket } from 'lucide-react';

function getSymbolLabels(values) {
  return values
    .map((v) => SYMBOLS.find((s) => s.value === v)?.base || v)
    .join(', ');
}

function getStrategyLabel(value) {
  return STRATEGIES.find((s) => s.value === value)?.label || value;
}

function getEmaLabel(value) {
  return EMA_FILTERS.find((f) => f.value === value)?.label || 'None';
}

function getConfidenceLabel(value) {
  return CONFIDENCE_LEVELS.find((c) => c.value === value)?.label || String(value);
}

function getProbabilityLabel(value) {
  return PROBABILITY_LEVELS.find((p) => p.value === value)?.label || String(value);
}

const REVIEW_ROWS = [
  { label: 'Symbols', key: 'symbols', format: (v) => getSymbolLabels(v) },
  { label: 'Direction', key: 'direction', format: (v) => v },
  { label: 'Frequency', key: 'frequency', format: (v) => (v === '4h' ? 'Every 4 hours' : 'Every 24 hours') },
  { label: 'Strategy', key: 'strategy', format: (v) => getStrategyLabel(v) },
  { label: 'EMA Filter', key: 'ema_filter', format: (v) => getEmaLabel(v) },
  { label: 'Risk Level', key: 'risk_level', format: (v) => `${v}%` },
  { label: 'Confidence', key: 'confidence', format: (v) => getConfidenceLabel(v) },
  { label: 'Probability', key: 'min_probability', format: (v) => getProbabilityLabel(v) },
];

export default function StepReview({ data }) {
  return (
    <div>
      {/* Summary card */}
      <div className="card-premium p-5">
        <div className="flex flex-col divide-y divide-tg-secondary/60">
          {REVIEW_ROWS.map((row) => {
            const value = data[row.key];
            if (value === null || value === undefined) return null;

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
    </div>
  );
}
