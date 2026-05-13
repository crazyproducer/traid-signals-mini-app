/* Progress bar + step title / subtitle / counter.
 *
 * Title comes in as a prop now (was hardcoded against an 8-item list,
 * which silently corrupted the 10-step wizard — every step from #4
 * onwards displayed the wrong name, and #9/#10 were undefined).
 */
export default function WizardProgress({ step, totalSteps, title, subtitle }) {
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
          {title || `Step ${step + 1}`}
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
