import FeatureRow from './FeatureRow';

export default function PlanCard({ plan, isCurrentPlan, onSelect }) {
  const isPopular = plan.value === 'basic';
  const priceDisplay = plan.price_monthly === 0 ? 'Free' : `$${plan.price_monthly}`;
  const periodDisplay = plan.price_monthly > 0 ? '/mo' : '';

  return (
    <div
      className={`card p-5 relative transition-all duration-200 ${
        isCurrentPlan ? 'ring-2 ring-tg-button' : ''
      } ${isPopular ? 'border-l-[3px] border-l-tg-button' : ''}`}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-2.5 right-4">
          <span className="bg-tg-button text-tg-button-text text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full">
            Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-[20px] font-bold text-tg-text">{plan.label}</span>
        <div className="flex items-baseline gap-0.5 ml-auto">
          <span className="text-[24px] font-bold font-mono text-tg-text" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {priceDisplay}
          </span>
          {periodDisplay && (
            <span className="text-[13px] text-tg-hint">{periodDisplay}</span>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="mb-5">
        {plan.features.map((feature) => (
          <FeatureRow key={feature} text={feature} included={true} />
        ))}
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={() => !isCurrentPlan && onSelect?.(plan)}
        disabled={isCurrentPlan}
        className={`w-full py-3 rounded-[5px] text-[14px] font-semibold transition-all duration-200 ${
          isCurrentPlan
            ? 'bg-tg-secondary/60 text-tg-hint cursor-default'
            : 'bg-tg-button text-tg-button-text pressable shadow-sm'
        }`}
      >
        {isCurrentPlan ? 'Current Plan' : 'Choose Plan'}
      </button>
    </div>
  );
}
