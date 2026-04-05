import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Radio, History, Clock } from 'lucide-react';
import { NewSignalCard, ActiveSignalCard, HistorySignalCard, ExpiredSignalCard } from '../components/signals/SignalCard';
import EmptyState from '../components/shared/EmptyState';
import { mockSignals } from '../api/mock-data';

const NEW_STATUSES = ['PENDING', 'ACTIVE', 'UPDATED'];
const ACTIVE_STATUSES = ['TRIGGERED'];
const HISTORY_STATUSES = ['HIT_TP', 'HIT_SL'];
const EXPIRED_STATUSES = ['EXPIRED'];

const TABS = [
  { key: 'new', label: 'New', statuses: NEW_STATUSES },
  { key: 'active', label: 'Active', statuses: ACTIVE_STATUSES },
  { key: 'history', label: 'History', statuses: HISTORY_STATUSES },
  { key: 'expired', label: 'Expired', statuses: EXPIRED_STATUSES },
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

  function renderCard(signal) {
    const go = () => navigate(`/signals/${signal.id}`);
    switch (tab) {
      case 'new': return <NewSignalCard key={signal.id} signal={signal} onClick={go} />;
      case 'active': return <ActiveSignalCard key={signal.id} signal={signal} onClick={go} />;
      case 'history': return <HistorySignalCard key={signal.id} signal={signal} onClick={go} />;
      case 'expired': return <ExpiredSignalCard key={signal.id} signal={signal} onClick={go} />;
      default: return null;
    }
  }

  const emptyConfig = {
    new: { icon: Sparkles, title: 'No new signals', subtitle: 'New signals will appear here when generated' },
    active: { icon: Radio, title: 'No active trades', subtitle: 'Signals become active when entry price is hit' },
    history: { icon: History, title: 'No history yet', subtitle: 'Completed trades will appear here' },
    expired: { icon: Clock, title: 'No expired signals', subtitle: 'Signals that expire without triggering appear here' },
  };

  return (
    <div className="px-7 pt-6 pb-24">
      {/* Header */}
      <h1 className="text-[28px] font-bold text-tg-text mb-5" style={{ letterSpacing: '-0.03em' }}>
        Signals
      </h1>

      {/* 4 underline tabs */}
      <div className="flex items-center border-b border-tg-secondary/30 mb-5">
        {TABS.map((t) => {
          const count = signalsByTab[t.key]?.length || 0;
          const isActive = tab === t.key;

          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1 pb-3 text-[12px] font-semibold transition-all duration-200 relative ${
                isActive ? 'text-tg-text' : 'text-tg-hint'
              }`}
            >
              {t.label}
              {count > 0 && (
                <span
                  className={`text-[9px] font-bold rounded-full px-1.5 py-0.5 ${
                    isActive ? 'bg-tg-button/10 text-tg-button' : 'bg-tg-secondary/60 text-tg-hint'
                  }`}
                >
                  {count}
                </span>
              )}
              {isActive && (
                <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-tg-button rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* List */}
      {displayed.length > 0 ? (
        <div className="flex flex-col gap-3 animate-fade-in-children">
          {displayed.map(renderCard)}
        </div>
      ) : (
        <EmptyState
          icon={emptyConfig[tab]?.icon || Sparkles}
          title={emptyConfig[tab]?.title}
          subtitle={emptyConfig[tab]?.subtitle}
        />
      )}
    </div>
  );
}
