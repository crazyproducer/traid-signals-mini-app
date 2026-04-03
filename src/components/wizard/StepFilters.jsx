import { Filter, X } from 'lucide-react';
import OptionCard from './OptionCard';
import { EMA_FILTERS, MOCK_RECORD_COUNTS } from '../../utils/constants';

const FILTER_DESCRIPTIONS = {
  20: 'Fast trend -- reacts quickly to price changes',
  50: 'Medium trend -- balanced sensitivity',
  100: 'Slow trend -- filters out noise',
  200: 'Long-term trend -- strongest filter',
};

const FILTER_COLORS = {
  20: 'green',
  50: 'blue',
  100: 'violet',
  200: 'red',
};

export default function StepFilters({ emaFilters, onToggle }) {
  const hasFilters = emaFilters.length > 0;

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[13px] text-tg-hint mb-1 px-1">
        Select EMA filters to apply (optional, multi-select)
      </p>

      {/* No filter option */}
      <button
        type="button"
        onClick={() => {
          // If user clicks "No filter", clear all EMA selections
          // If already no filters, do nothing
          if (hasFilters) {
            // Clear by toggling each selected filter off
            emaFilters.forEach((f) => onToggle(f));
          }
        }}
        className={`pressable w-full text-left rounded-2xl p-4 flex items-center gap-3.5 transition-all duration-200 ${
          !hasFilters
            ? 'option-selected scale-[1.01]'
            : 'card-premium-sm border-2 border-transparent'
        }`}
      >
        <div className="icon-gradient-neutral w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
          <X size={20} strokeWidth={2} className="text-white" />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[15px] font-semibold text-tg-text leading-tight">
            No EMA filter
          </span>
          <span className="text-[12px] text-tg-hint leading-snug mt-0.5">
            No trend filtering applied
          </span>
        </div>
        <div className="flex-shrink-0">
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              !hasFilters
                ? 'border-tg-button bg-tg-button'
                : 'border-tg-hint/30 bg-transparent'
            }`}
          >
            {!hasFilters && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="text-tg-button-text">
                <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </div>
      </button>

      {/* EMA filter options */}
      {EMA_FILTERS.map((filter) => {
        const count = MOCK_RECORD_COUNTS.ema[filter.value];
        return (
          <OptionCard
            key={filter.value}
            icon={Filter}
            title={filter.label}
            description={FILTER_DESCRIPTIONS[filter.value]}
            count={count}
            selected={emaFilters.includes(filter.value)}
            onClick={() => onToggle(filter.value)}
            color={FILTER_COLORS[filter.value] || 'blue'}
          />
        );
      })}

      {/* Combined count */}
      {hasFilters && (
        <div className="mt-2 px-1 animate-fade-in">
          <div className="card-premium-sm p-3 flex items-center justify-between">
            <span className="text-[13px] text-tg-hint">
              {emaFilters.length} filter{emaFilters.length > 1 ? 's' : ''} selected
            </span>
            <span className="text-[13px] text-tg-hint/70 font-mono">
              EMA {emaFilters.sort((a, b) => a - b).join(', ')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
