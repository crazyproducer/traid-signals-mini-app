const STEP_LABELS = [
  'Strategy',
  'Risk',
  'Confidence',
  'Direction',
  'Symbols',
  'Timeframe',
  'Filters',
  'Review',
];

export default function WizardProgress({ step, totalSteps }) {
  return (
    <div>
      {/* Segmented bar — taller, smoother */}
      <div className="flex items-center gap-1">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-[3px] flex-1 rounded-full transition-all duration-400 ${
              i < step
                ? 'bg-tg-button'
                : i === step
                  ? 'bg-tg-button'
                  : 'bg-tg-secondary/30'
            }`}
          />
        ))}
      </div>

      {/* Step counter — minimal */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-tg-hint/70 tracking-wide">
          {STEP_LABELS[step] || `Step ${step + 1}`}
        </span>
        <span className="text-[11px] font-mono text-tg-hint/40" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {step + 1} of {totalSteps}
        </span>
      </div>
    </div>
  );
}
