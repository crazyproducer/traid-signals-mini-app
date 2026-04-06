import { useNavigate } from 'react-router-dom';
import { Lock, X, Check } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../../utils/constants';

export default function PaywallSheet({ reason, onClose }) {
  const navigate = useNavigate();

  const plans = SUBSCRIPTION_PLANS.filter((p) => p.value !== 'free');

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 100 }}
      />

      {/* Sheet */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 101, backgroundColor: 'var(--tg-theme-bg-color, #fff)', borderRadius: '16px 16px 0 0', padding: '24px 20px', paddingBottom: '40px', maxHeight: '80vh', overflowY: 'auto' }}>
        {/* Close */}
        <button type="button" onClick={onClose} className="pressable" style={{ position: 'absolute', top: '16px', right: '16px' }}>
          <X size={20} className="text-tg-hint" />
        </button>

        {/* Header */}
        <div className="flex items-center" style={{ gap: '10px', marginBottom: '16px' }}>
          <div className="icon-gradient-blue" style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-[17px] font-bold text-tg-text" style={{ letterSpacing: '-0.02em' }}>Upgrade your plan</h3>
            <p className="text-[12px] text-tg-hint">{reason}</p>
          </div>
        </div>

        {/* Plans */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {plans.map((plan) => (
            <button
              key={plan.value}
              type="button"
              onClick={() => { onClose(); navigate('/account/plans'); }}
              className="card pressable text-left"
              style={{ padding: '14px' }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
                <span className="text-[15px] font-semibold text-tg-text">{plan.label}</span>
                <span className="text-[14px] font-mono font-bold text-tg-text" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  ${plan.price_monthly}/mo
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {plan.features.slice(0, 3).map((f) => (
                  <div key={f} className="flex items-center" style={{ gap: '6px' }}>
                    <Check size={12} className="text-green" style={{ flexShrink: 0 }} />
                    <span className="text-[11px] text-tg-hint">{f}</span>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>

        <p className="text-[11px] text-tg-hint/50 text-center">
          Cancel anytime. Annual plans save up to 17%.
        </p>
      </div>
    </>
  );
}
