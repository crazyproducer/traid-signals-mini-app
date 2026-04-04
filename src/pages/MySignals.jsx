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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[28px] font-bold text-tg-text" style={{ letterSpacing: '-0.03em' }}>
          Signals
        </h1>
        <button
          type="button"
          onClick={() => navigate('/performance')}
          className="flex items-center gap-1.5 text-[13px] font-medium text-tg-accent pressable"
        >
          <BarChart3 size={14} strokeWidth={2} />
          Performance
        </button>
      </div>

      {/* Underline tabs */}
      <div className="flex items-center border-b border-tg-secondary/30 mb-5">
        {TABS.map((t) => {
          const count = signalsByTab[t.key]?.length || 0;
          const isActive = tab === t.key;

          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 pb-3 text-[13px] font-semibold transition-all duration-200 relative ${
                isActive
                  ? 'text-tg-text'
                  : 'text-tg-hint'
              }`}
            >
              {t.label}
              {count > 0 && (
                <span
                  className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${
                    isActive ? 'bg-tg-button/10 text-tg-button' : 'bg-tg-secondary/60 text-tg-hint'
                  }`}
                >
                  {count}
                </span>
              )}
              {/* Active underline */}
              {isActive && (
                <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-tg-button rounded-full" />
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
