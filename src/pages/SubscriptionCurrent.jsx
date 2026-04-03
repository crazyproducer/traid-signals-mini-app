import { useNavigate } from 'react-router-dom';
import { Crown, Calendar, CreditCard, ArrowRight, User } from 'lucide-react';
import FeatureRow from '../components/subscription/FeatureRow';
import { SUBSCRIPTION_PLANS } from '../utils/constants';
import { mockSubscription, mockUser } from '../api/mock-data';

export default function SubscriptionCurrent() {
  const navigate = useNavigate();
  const plan = SUBSCRIPTION_PLANS.find((p) => p.value === mockSubscription.plan);

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-5">
        <p className="text-[15px] font-semibold text-tg-text">No active subscription</p>
      </div>
    );
  }

  const priceDisplay = plan.price_monthly === 0 ? 'Free' : `$${plan.price_monthly}/mo`;

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  return (
    <div className="px-5 pt-6 pb-8 animate-fade-in">
      {/* Header */}
      <h1 className="text-[20px] font-bold text-tg-text mb-5">Account</h1>

      {/* User info card */}
      <div className="card-premium p-5 mb-4">
        <div className="flex items-center gap-3.5">
          <div className="icon-gradient-blue w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={24} strokeWidth={2} className="text-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[17px] font-bold text-tg-text">
              {mockUser.first_name}
            </span>
            <span className="text-[13px] text-tg-hint">
              @{mockUser.username}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-green/10 text-green text-[10px] font-bold rounded-full px-2 py-0.5 uppercase tracking-wider">
                {mockSubscription.status === 'active' ? 'Active' : mockSubscription.status}
              </span>
              <span className="text-[12px] font-medium text-tg-accent">
                {plan.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Current plan card */}
      <div className="card-premium p-5 mb-4">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="icon-gradient-violet w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Crown size={24} strokeWidth={2} className="text-white" />
          </div>
          <div>
            <span className="text-[18px] font-bold text-tg-text">{plan.label}</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[14px] font-mono font-semibold text-tg-accent" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {priceDisplay}
              </span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="border-t border-tg-secondary/40 pt-3">
          {plan.features.map((feature) => (
            <FeatureRow key={feature} text={feature} included={true} />
          ))}
        </div>
      </div>

      {/* Billing info */}
      <div className="card-premium-sm px-4 py-4 mb-4">
        <h3 className="text-[14px] font-semibold text-tg-text mb-3">Billing</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-tg-secondary/50 flex items-center justify-center flex-shrink-0">
              <Calendar size={14} className="text-tg-hint" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-tg-hint">Next billing date</span>
              <span className="text-[13px] font-medium text-tg-text">
                {formatDate(mockSubscription.next_billing)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-tg-secondary/50 flex items-center justify-center flex-shrink-0">
              <CreditCard size={14} className="text-tg-hint" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-tg-hint">Started</span>
              <span className="text-[13px] font-medium text-tg-text">
                {formatDate(mockSubscription.started_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage */}
      <div className="card-premium-sm px-4 py-4 mb-6">
        <h3 className="text-[14px] font-semibold text-tg-text mb-3">Usage</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] text-tg-hint">Signal subscriptions</span>
          <span className="text-[13px] font-mono font-medium text-tg-text" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {mockSubscription.signals_used} / {mockSubscription.signals_limit}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-2 bg-tg-secondary/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-tg-button rounded-full transition-all duration-300"
            style={{
              width: `${Math.min((mockSubscription.signals_used / mockSubscription.signals_limit) * 100, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <button
        type="button"
        onClick={() => navigate('/account/plans')}
        className="w-full card-premium-sm px-4 py-4 pressable flex items-center justify-between mb-3"
      >
        <span className="text-[14px] font-semibold text-tg-text">Change Plan</span>
        <ArrowRight size={18} className="text-tg-hint/40" />
      </button>

      <button
        type="button"
        className="w-full py-3 text-center text-[13px] text-tg-destructive/70 pressable"
      >
        Cancel Subscription
      </button>
    </div>
  );
}
