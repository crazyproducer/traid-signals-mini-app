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
    <div className="px-1">
      {/* Segmented bar */}
      <div className="flex items-center gap-[2px]">
        {Array.from({ length: totalSteps }, (_, i) => {
          let barClass = 'h-1 flex-1 rounded-full transition-all duration-300 ';

          if (i < step) {
            barClass += 'bg-tg-button';
          } else if (i === step) {
            barClass += 'bg-tg-button animate-pulse';
          } else {
            barClass += 'bg-tg-secondary/40';
          }

          return <div key={i} className={barClass} />;
        })}
      </div>

      {/* Step label */}
      <div className="mt-1.5 flex items-center justify-between">
        <span className="text-[11px] font-medium text-tg-hint">
          {STEP_LABELS[step] || `Step ${step + 1}`}
        </span>
        <span className="text-[11px] text-tg-hint/60">
          {step + 1}/{totalSteps}
        </span>
      </div>
    </div>
  );
}
