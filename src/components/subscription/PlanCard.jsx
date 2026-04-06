import FeatureRow from './FeatureRow';

export default function PlanCard({ plan, isCurrentPlan, isSelected, onSelect, annual }) {
  const isPopular = plan.value === 'basic';
  const isFree = plan.price_monthly === 0;

  const price = isFree ? '$0' : annual ? `$${plan.price_yearly}` : `$${plan.price_monthly}`;
  const period = isFree ? '' : annual ? '/yr' : '/mo';

  return (
    <button
      type="button"
      onClick={() => onSelect(plan)}
      className={`card pressable relative text-left transition-all duration-200 w-full ${
        isSelected ? 'ring-2 ring-tg-button' : ''
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

      {/* Header: radio + name + price */}
      <div className="flex items-center" style={{ gap: '12px', marginBottom: '8px' }}>
        {/* Radio */}
        <div
          className={`flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
            isSelected ? 'bg-tg-button' : 'border-2 border-tg-hint/20'
          }`}
          style={{ width: '20px', height: '20px', borderRadius: '10px' }}
        >
          {isSelected && (
            <div style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: 'var(--tg-theme-button-text-color, #fff)' }} />
          )}
        </div>

        <span className="text-[17px] font-bold text-tg-text" style={{ flex: 1 }}>{plan.label}</span>

        <div className="flex items-baseline" style={{ gap: '3px' }}>
          {!isFree && (
            <>
              <span className="text-[20px] font-bold font-mono text-tg-text" style={{ fontVariantNumeric: 'tabular-nums' }}>{price}</span>
              <span className="text-[11px] text-tg-hint">{period}</span>
            </>
          )}
          {isFree && <span className="text-[13px] font-medium text-tg-hint">Free forever</span>}
        </div>
      </div>

      {/* Features — compact, indented past radio */}
      <div style={{ paddingLeft: '32px' }}>
        {plan.features.map((feature) => (
          <FeatureRow key={feature} text={feature} included={true} />
        ))}
      </div>
    </button>
  );
}
