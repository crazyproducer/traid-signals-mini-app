import FeatureRow from './FeatureRow';

export default function PlanCard({ plan, isCurrentPlan, onSelect, annual }) {
  const isPopular = plan.value === 'basic';
  const isFree = plan.price_monthly === 0;

  const price = isFree ? '$0' : annual ? `$${Math.round(plan.price_yearly / 12)}` : `$${plan.price_monthly}`;
  const period = isFree ? '' : '/mo';
  const savings = annual && !isFree ? `$${plan.price_yearly}/yr` : null;

  return (
    <div
      className={`card relative transition-all duration-200 ${
        isCurrentPlan ? 'ring-2 ring-tg-button' : ''
      } ${isPopular ? 'border-l-[3px] border-l-tg-button' : ''}`}
      style={{ padding: '14px 16px' }}
    >
      {isPopular && (
        <div style={{ position: 'absolute', top: '-10px', right: '14px' }}>
          <span className="bg-tg-button text-tg-button-text text-[9px] font-bold uppercase tracking-wide" style={{ padding: '3px 10px', borderRadius: '10px' }}>
            Popular
          </span>
        </div>
      )}

      {/* Header: name + price */}
      <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
        <span className="text-[17px] font-bold text-tg-text">{plan.label}</span>
        <div className="flex items-baseline" style={{ gap: '3px' }}>
          {!isFree && (
            <>
              <span className="text-[20px] font-bold font-mono text-tg-text" style={{ fontVariantNumeric: 'tabular-nums' }}>{price}</span>
              <span className="text-[11px] text-tg-hint">{period}</span>
            </>
          )}
          {isFree && <span className="text-[14px] font-semibold text-tg-hint">Free forever</span>}
        </div>
      </div>

      {savings && (
        <div style={{ marginBottom: '10px' }}>
          <span className="text-[11px] text-green font-semibold">Billed {savings} (save {Math.round((1 - plan.price_yearly / (plan.price_monthly * 12)) * 100)}%)</span>
        </div>
      )}

      {/* Features — compact */}
      <div style={{ marginBottom: '12px' }}>
        {plan.features.map((feature) => (
          <FeatureRow key={feature} text={feature} included={true} />
        ))}
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={() => !isCurrentPlan && onSelect?.(plan)}
        disabled={isCurrentPlan}
        className={`btn w-full transition-all duration-200 ${
          isCurrentPlan
            ? 'bg-tg-secondary/60 text-tg-hint cursor-default'
            : 'bg-tg-button text-tg-button-text pressable shadow-sm'
        }`}
      >
        {isCurrentPlan ? 'Current plan' : 'Choose plan'}
      </button>
    </div>
  );
}
