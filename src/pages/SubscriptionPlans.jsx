import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlanCard from '../components/subscription/PlanCard';
import { SUBSCRIPTION_PLANS } from '../utils/constants';
import { mockSubscription } from '../api/mock-data';
import PageHeader from '../components/shared/PageHeader';

const PLAN_ORDER = ['free', 'basic', 'premium'];

export default function SubscriptionPlans() {
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(true);
  const [selected, setSelected] = useState(mockSubscription.plan);

  const currentIdx = PLAN_ORDER.indexOf(mockSubscription.plan);
  const selectedIdx = PLAN_ORDER.indexOf(selected);
  const changed = selected !== mockSubscription.plan;
  const isUpgrade = selectedIdx > currentIdx;
  const actionLabel = isUpgrade ? 'Upgrade' : 'Downgrade';

  const toggle = (
    <div className="flex items-center" style={{ backgroundColor: 'rgba(128,128,128,0.08)', borderRadius: '6px', padding: '2px' }}>
      <button
        type="button"
        onClick={() => setAnnual(false)}
        className={`pressable text-[11px] font-semibold ${!annual ? 'text-tg-text' : 'text-tg-hint'}`}
        style={{ padding: '5px 10px', borderRadius: '4px', backgroundColor: !annual ? 'var(--tg-theme-section-bg-color, #fff)' : 'transparent', boxShadow: !annual ? '0 1px 2px rgba(0,0,0,0.06)' : 'none' }}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => setAnnual(true)}
        className={`pressable text-[11px] font-semibold ${annual ? 'text-tg-text' : 'text-tg-hint'}`}
        style={{ padding: '5px 10px', borderRadius: '4px', backgroundColor: annual ? 'var(--tg-theme-section-bg-color, #fff)' : 'transparent', boxShadow: annual ? '0 1px 2px rgba(0,0,0,0.06)' : 'none' }}
      >
        Annual
      </button>
    </div>
  );

  return (
    <div className="page-padding" style={{ paddingTop: '0px', paddingBottom: '96px' }}>
      <PageHeader title="Plans" showBack rightElement={toggle} />
      <div style={{ height: '12px' }} />

      {/* Plans */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {SUBSCRIPTION_PLANS.map((plan) => (
          <PlanCard
            key={plan.value}
            plan={plan}
            isCurrentPlan={plan.value === mockSubscription.plan}
            isSelected={plan.value === selected}
            onSelect={(p) => setSelected(p.value)}
            annual={annual}
          />
        ))}
      </div>

      {/* Upgrade/Downgrade button — only when changed */}
      {changed && (
        <div style={{ marginTop: '16px' }}>
          <button
            type="button"
            onClick={() => navigate('/account')}
            className={`btn w-full pressable ${isUpgrade ? 'icon-gradient-green text-white' : 'bg-tg-secondary/60 text-tg-text'}`}
          >
            {actionLabel} to {SUBSCRIPTION_PLANS.find((p) => p.value === selected)?.label}
          </button>
        </div>
      )}
    </div>
  );
}
