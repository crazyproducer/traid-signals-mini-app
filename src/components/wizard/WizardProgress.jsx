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
      {/* Continuous progress bar with smooth fill */}
      <div className="h-1 rounded-full bg-tg-secondary/30 overflow-hidden">
        <div
          className="h-full rounded-full bg-tg-button transition-all duration-500"
          style={{ width: `${pct}%`, transitionTimingFunction: 'cubic-bezier(0.34, 1.3, 0.64, 1)' }}
        />
      </div>

      {/* Label + counter */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[12px] font-semibold text-tg-hint/60 uppercase" style={{ letterSpacing: '0.06em' }}>
          {STEP_LABELS[step]}
        </span>
        <span className="text-[12px] font-mono text-tg-hint/35" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {step + 1}/{totalSteps}
        </span>
      </div>
    </div>
  );
}
