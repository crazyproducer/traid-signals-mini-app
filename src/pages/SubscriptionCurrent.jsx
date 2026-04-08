import { useNavigate } from 'react-router-dom';
import { Crown, ArrowRight } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../utils/constants';
import { mockSubscription } from '../api/mock-data';
import PageHeader from '../components/shared/PageHeader';

export default function SubscriptionCurrent() {
  const navigate = useNavigate();
  const plan = SUBSCRIPTION_PLANS.find((p) => p.value === mockSubscription.plan);

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-[16px] font-semibold text-tg-text">No active subscription</p>
      </div>
    );
  }

  const priceDisplay = plan.price_monthly === 0 ? 'Free' : `$${plan.price_monthly}/mo`;

  return (
    <div className="page-padding" style={{ paddingTop: '0px', paddingBottom: '96px' }}>
      <PageHeader title="Account" showBack />
      <div style={{ height: '16px' }} />

      {/* Current plan card */}
      <div className="card-elevated" style={{ padding: '20px', marginBottom: '16px' }}>
        <div className="flex items-center" style={{ gap: '14px' }}>
          <div className="icon-gradient-violet flex items-center justify-center flex-shrink-0" style={{ width: '48px', height: '48px', borderRadius: '5px' }}>
            <Crown size={24} strokeWidth={2} className="text-white" />
          </div>
          <div style={{ flex: 1 }}>
            <span className="text-[18px] font-bold text-tg-text" style={{ letterSpacing: '-0.02em' }}>
              {plan.label}
            </span>
            <div className="flex items-center" style={{ gap: '8px', marginTop: '2px' }}>
              <span className="text-[14px] font-mono font-semibold text-tg-accent" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {priceDisplay}
              </span>
              <span className="inline-flex items-center bg-green/8 text-green text-[10px] font-bold rounded-full uppercase tracking-wide" style={{ padding: '2px 10px' }}>
                Active
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/account/plans')}
            className="pressable flex items-center" style={{ gap: '4px', padding: '8px 14px', borderRadius: '6px', background: 'var(--tg-theme-button-color)', color: 'var(--tg-theme-button-text-color)', fontSize: '13px', fontWeight: 600 }}
          >
            Upgrade
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Usage */}
      <div className="card" style={{ padding: '16px', marginBottom: '24px' }}>
        <span className="text-[12px] uppercase font-medium text-tg-hint block" style={{ letterSpacing: '0.06em', marginBottom: '12px' }}>
          Usage
        </span>
        <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
          <span className="text-[13px] text-tg-hint">Signal subscriptions</span>
          <span className="text-[13px] font-mono font-medium text-tg-text" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {mockSubscription.signals_used} / {mockSubscription.signals_limit}
          </span>
        </div>
        {/* Progress bar */}
        <div className="bg-tg-secondary/40 rounded-full overflow-hidden" style={{ height: '8px' }}>
          <div
            className="bg-tg-button rounded-full transition-all duration-300"
            style={{
              height: '100%',
              width: `${Math.min((mockSubscription.signals_used / mockSubscription.signals_limit) * 100, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <button
        type="button"
        onClick={() => navigate('/learn')}
        className="w-full card pressable flex items-center justify-between" style={{ padding: '16px', marginBottom: '12px' }}
      >
        <span className="text-[14px] font-semibold text-tg-text">Learn</span>
        <ArrowRight size={18} className="text-tg-hint/40" />
      </button>

      <button
        type="button"
        className="btn w-full text-tg-destructive/70 pressable" style={{ backgroundColor: 'transparent' }}
      >
        Cancel Subscription
      </button>
    </div>
  );
}
