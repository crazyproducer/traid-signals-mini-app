import { useNavigate } from 'react-router-dom';
import PlanCard from '../components/subscription/PlanCard';
import { SUBSCRIPTION_PLANS } from '../utils/constants';
import { mockSubscription } from '../api/mock-data';

export default function SubscriptionPlans() {
  const navigate = useNavigate();

  function handleSelectPlan(plan) {
    // Mock: just navigate to current subscription page
    navigate('/subscription/current');
  }

  return (
    <div className="px-5 pt-6 pb-8 animate-fade-in">
      {/* Header */}
      <h1 className="text-[28px] font-bold text-tg-text mb-2" style={{ letterSpacing: '-0.03em' }}>
        Choose Your Plan
      </h1>
      <p className="text-[14px] text-tg-hint mb-6">
        Select the plan that best fits your trading needs
      </p>

      {/* Plans */}
      <div className="flex flex-col gap-5">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <PlanCard
            key={plan.value}
            plan={plan}
            isCurrentPlan={plan.value === mockSubscription.plan}
            onSelect={handleSelectPlan}
          />
        ))}
      </div>
    </div>
  );
}
