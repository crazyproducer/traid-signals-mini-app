import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Radio, History, BarChart3 } from 'lucide-react';
import SignalCard from '../components/signals/SignalCard';
import EmptyState from '../components/shared/EmptyState';
import { mockSignals, mockSignalSubscriptions } from '../api/mock-data';

const TABS = [
  { key: 'new', label: 'New', icon: Sparkles, statuses: ['PENDING'] },
  { key: 'active', label: 'Active', icon: Radio, statuses: ['ACTIVE', 'UPDATED', 'TRIGGERED'] },
  { key: 'history', label: 'History', icon: History, statuses: ['HIT_TP', 'HIT_SL', 'EXPIRED'] },
];

export default function MySignals() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('new');

  const signalsByTab = useMemo(() => {
    const result = {};
    for (const t of TABS) {
      result[t.key] = mockSignals.filter((s) => t.statuses.includes(s.status));
    }
    return result;
  }, []);

  const displayed = signalsByTab[tab] || [];
  const currentTab = TABS.find((t) => t.key === tab);

  return (
    <div className="px-5 pt-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[20px] font-bold text-tg-text">My Signals</h1>
        <button
          type="button"
          onClick={() => navigate('/performance')}
          className="flex items-center gap-1.5 text-[13px] font-medium text-tg-accent pressable"
        >
          <BarChart3 size={14} strokeWidth={2} />
          Performance
        </button>
      </div>

      {/* 3-tab switcher */}
      <div className="flex items-center gap-1 bg-tg-secondary/40 rounded-xl p-1 mb-5">
        {TABS.map((t) => {
          const Icon = t.icon;
          const count = signalsByTab[t.key]?.length || 0;
          const isActive = tab === t.key;

          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[12px] font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-tg-section text-tg-text shadow-sm'
                  : 'text-tg-hint'
              }`}
            >
              <Icon size={13} strokeWidth={2} />
              {t.label}
              {count > 0 && (
                <span
                  className={`text-[9px] font-bold rounded-full px-1.5 py-0.5 ${
                    t.key === 'new'
                      ? 'bg-violet/10 text-violet'
                      : t.key === 'active'
                        ? 'bg-green/10 text-green'
                        : 'bg-tg-secondary/80 text-tg-hint'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Signal list */}
      {displayed.length > 0 ? (
        <div className="flex flex-col gap-3 animate-fade-in-children">
          {displayed.map((signal) => {
            const subscription = mockSignalSubscriptions.find(
              (sub) => sub.id === signal.subscription_id,
            );
            return (
              <SignalCard
                key={signal.id}
                signal={signal}
                subscription={subscription}
                onClick={() => navigate(`/signals/${signal.id}`)}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={currentTab?.icon || Radio}
          title={
            tab === 'new' ? 'No New Signals'
              : tab === 'active' ? 'No Active Signals'
                : 'No History Yet'
          }
          subtitle={
            tab === 'new' ? 'New signals will appear here when generated'
              : tab === 'active' ? 'Create a signal subscription to get started'
                : 'Resolved signals will appear here'
          }
          action={
            tab === 'active'
              ? { label: 'New Signal', onClick: () => navigate('/new-signal') }
              : undefined
          }
        />
      )}
    </div>
  );
}
