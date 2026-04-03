import { useNavigate } from 'react-router-dom';
import { Plus, Radio, Crown, ChevronRight } from 'lucide-react';
import { getActiveSignalsCount, mockSubscription } from '../api/mock-data';
import { SUBSCRIPTION_PLANS } from '../utils/constants';

const MENU_ITEMS = [
  {
    key: 'new-signal',
    title: 'New Signal',
    description: 'Configure and launch a new signal',
    icon: Plus,
    gradient: 'icon-gradient-green',
    route: '/new-signal',
    meta: null,
  },
  {
    key: 'signals',
    title: 'My Signals',
    description: 'View and manage your active signals',
    icon: Radio,
    gradient: 'icon-gradient-blue',
    route: '/signals',
    meta: 'activeCount',
  },
  {
    key: 'subscription',
    title: 'My Subscription',
    description: 'Manage your plan and billing',
    icon: Crown,
    gradient: 'icon-gradient-violet',
    route: '/subscription/current',
    meta: 'planName',
  },
];

export default function MainMenu() {
  const navigate = useNavigate();
  const activeCount = getActiveSignalsCount();
  const currentPlan = SUBSCRIPTION_PLANS.find((p) => p.value === mockSubscription.plan);

  function getMetaText(metaKey) {
    if (metaKey === 'activeCount') {
      return activeCount > 0 ? `${activeCount} active` : 'No active signals';
    }
    if (metaKey === 'planName') {
      return currentPlan ? currentPlan.label : 'Free';
    }
    return null;
  }

  return (
    <div className="px-5 pt-8 pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[24px] font-bold text-tg-text leading-tight">
          TRAID Signals
        </h1>
        <p className="text-[14px] text-tg-hint mt-1">
          Automated trading signals
        </p>
      </div>

      {/* Menu cards */}
      <div className="flex flex-col gap-4 animate-fade-in-children">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const metaText = getMetaText(item.meta);

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => navigate(item.route)}
              className="card-premium p-5 pressable w-full text-left flex items-center gap-4"
            >
              {/* Gradient icon */}
              <div
                className={`${item.gradient} w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0`}
              >
                <Icon size={24} strokeWidth={2} className="text-white" />
              </div>

              {/* Text */}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[16px] font-semibold text-tg-text leading-tight">
                  {item.title}
                </span>
                <span className="text-[13px] text-tg-hint mt-0.5 leading-snug">
                  {item.description}
                </span>
                {metaText && (
                  <span className="text-[12px] font-medium text-tg-accent mt-1">
                    {metaText}
                  </span>
                )}
              </div>

              {/* Chevron */}
              <ChevronRight size={20} className="text-tg-hint/40 flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
