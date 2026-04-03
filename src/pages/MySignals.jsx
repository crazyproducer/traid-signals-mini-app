import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, BarChart3, History } from 'lucide-react';
import SignalCard from '../components/signals/SignalCard';
import EmptyState from '../components/shared/EmptyState';
import { mockSignals, mockSignalSubscriptions } from '../api/mock-data';

const ACTIVE_STATUSES = ['ACTIVE', 'UPDATED', 'TRIGGERED'];

export default function MySignals() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('active');

  const activeSignals = useMemo(
    () => mockSignals.filter((s) => ACTIVE_STATUSES.includes(s.status)),
    [],
  );

  const historySignals = useMemo(
    () => mockSignals.filter((s) => !ACTIVE_STATUSES.includes(s.status)),
    [],
  );

  const displayedSignals = tab === 'active' ? activeSignals : historySignals;

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

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-tg-secondary/40 rounded-xl p-1 mb-5">
        <button
          type="button"
          onClick={() => setTab('active')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
            tab === 'active'
              ? 'bg-tg-section text-tg-text shadow-sm'
              : 'text-tg-hint'
          }`}
        >
          <Radio size={14} strokeWidth={2} />
          Active
          {activeSignals.length > 0 && (
            <span className="bg-green/10 text-green text-[10px] font-bold rounded-full px-1.5 py-0.5">
              {activeSignals.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setTab('history')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
            tab === 'history'
              ? 'bg-tg-section text-tg-text shadow-sm'
              : 'text-tg-hint'
          }`}
        >
          <History size={14} strokeWidth={2} />
          History
          {historySignals.length > 0 && (
            <span className="bg-tg-secondary/80 text-tg-hint text-[10px] font-bold rounded-full px-1.5 py-0.5">
              {historySignals.length}
            </span>
          )}
        </button>
      </div>

      {/* Signal list */}
      {displayedSignals.length > 0 ? (
        <div className="flex flex-col gap-3 animate-fade-in-children">
          {displayedSignals.map((signal) => {
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
          icon={tab === 'active' ? Radio : History}
          title={tab === 'active' ? 'No Active Signals' : 'No History Yet'}
          subtitle={
            tab === 'active'
              ? 'Create a new signal subscription to get started'
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
