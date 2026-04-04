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
  const pct = ((step + 1) / totalSteps) * 100;

  return (
    <div>
      {/* Continuous progress bar — thin, precise */}
      <div className="h-[2px] rounded-full bg-tg-secondary/30 overflow-hidden">
        <div
          className="h-full rounded-full bg-tg-button transition-all duration-500"
          style={{ width: `${pct}%`, transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        />
      </div>

      {/* Step name + counter */}
      <div className="mt-2.5 flex items-center justify-between">
        <span
          className="text-[12px] font-semibold text-tg-hint/50 uppercase"
          style={{ letterSpacing: '0.08em' }}
        >
          {STEP_LABELS[step]}
        </span>
        <span
          className="text-[12px] font-mono text-tg-hint/35"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {step + 1} of {totalSteps}
        </span>
      </div>
    </div>
  );
}
