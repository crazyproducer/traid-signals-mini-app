import FeatureRow from './FeatureRow';

export default function PlanCard({ plan, isCurrentPlan, isSelected, onSelect, annual }) {
  const isPopular = plan.value === 'basic';
  const isFree = plan.price_monthly === 0;

  const price = isFree ? '$0' : annual ? `$${Math.round(plan.price_yearly / 12)}` : `$${plan.price_monthly}`;
  const period = '/mo';
  const savePct = !isFree && annual ? Math.round((1 - plan.price_yearly / (plan.price_monthly * 12)) * 100) : 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(plan)}
      className={`card pressable relative text-left transition-all duration-200 w-full ${
        isSelected ? 'ring-2 ring-tg-button' : ''
      } ${isPopular ? 'border-l-[3px] border-l-tg-button' : ''}`}
      style={{ padding: '0', display: 'flex', alignItems: 'stretch' }}
    >
      {isPopular && (
        <div style={{ position: 'absolute', top: '-10px', right: '14px' }}>
          <span className="bg-tg-button text-tg-button-text text-[9px] font-bold uppercase tracking-wide" style={{ padding: '3px 10px', borderRadius: '10px' }}>
            Popular
          </span>
        </div>
      )}

      {/* Left: radio + name + features */}
      <div style={{ flex: 1, padding: '14px 0 14px 16px' }}>
        <div className="flex items-center" style={{ gap: '10px', marginBottom: '8px' }}>
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
          <span className="text-[16px] font-bold text-tg-text">{plan.label}</span>
        </div>

        {/* Features */}
        <div style={{ paddingLeft: '30px' }}>
          {plan.features.map((feature) => (
            <FeatureRow key={feature} text={feature} included={true} />
          ))}
        </div>
      </div>

      {/* Right: price container — full height, centered */}
      <div className="flex flex-col items-center justify-center flex-shrink-0" style={{ padding: '14px 16px', minWidth: '90px', borderLeft: '1px solid rgba(128,128,128,0.1)' }}>
        {!isFree ? (
          <>
            <div className="flex items-baseline" style={{ gap: '2px' }}>
              <span className="text-[22px] font-bold font-mono text-tg-text" style={{ fontVariantNumeric: 'tabular-nums' }}>{price}</span>
              <span className="text-[11px] text-tg-hint">{period}</span>
            </div>
            {annual ? (
              <span className="text-[10px] text-green font-semibold" style={{ marginTop: '2px' }}>
                ${plan.price_yearly}/yr · save {savePct}%
              </span>
            ) : (
              <span className="text-[10px] text-tg-hint/50" style={{ marginTop: '2px' }}>
                ${plan.price_monthly * 12}/yr
              </span>
            )}
          </>
        ) : (
          <span className="text-[13px] font-semibold text-tg-hint">Free</span>
        )}
      </div>
    </button>
  );
}
