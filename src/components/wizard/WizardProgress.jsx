const STEP_LABELS = [
  'Strategy',
  'Risk',
  'Confidence',
  'Direction',
  'Symbols',
  'Frequency',
  'Filters',
  'Review',
];

export default function WizardProgress({ step, totalSteps, subtitle }) {
  const pct = ((step + 1) / totalSteps) * 100;

  return (
    <div>
      {/* Progress bar */}
      <div style={{ height: '2px', borderRadius: '1px', backgroundColor: 'rgba(128,128,128,0.12)', overflow: 'hidden' }}>
        <div
          className="bg-tg-button"
          style={{ height: '100%', borderRadius: '1px', width: `${pct}%`, transition: 'width 500ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        />
      </div>

      {/* Step name + counter */}
      <div className="flex items-baseline justify-between" style={{ marginTop: '10px' }}>
        <span className="text-[18px] font-bold text-tg-text" style={{ letterSpacing: '-0.02em' }}>
          {STEP_LABELS[step]}
        </span>
        <span className="text-[11px] font-mono text-tg-hint/35" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {step + 1} of {totalSteps}
        </span>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-[13px] text-tg-hint" style={{ marginTop: '2px' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
