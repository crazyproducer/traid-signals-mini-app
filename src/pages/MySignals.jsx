import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Radio, History, Clock, Settings } from 'lucide-react';
import { NewSignalCard, ActiveSignalCard, HistorySignalCard, ExpiredSignalCard } from '../components/signals/SignalCard';
import EmptyState from '../components/shared/EmptyState';
import { getFeed } from '../api/signals';
import PageHeader from '../components/shared/PageHeader';

const TABS = [
  { key: 'new', label: 'New' },
  { key: 'active', label: 'Active' },
  { key: 'history', label: 'History' },
  { key: 'expired', label: 'Expired' },
];

export default function MySignals() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'new';
  const setTab = (t) => setSearchParams({ tab: t }, { replace: true });

  // Per-tab fetched list. We fetch the active tab eagerly + the other 3
  // in parallel so the underline-tab counts are accurate without a per-tab
  // round-trip when the user switches.
  const [signalsByTab, setSignalsByTab] = useState({ new: [], active: [], history: [], expired: [] });

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled(TABS.map((t) => getFeed({ tab: t.key, limit: 100 })))
      .then((results) => {
        if (cancelled) return;
        const map = {};
        results.forEach((r, i) => {
          map[TABS[i].key] = r.status === 'fulfilled' ? (r.value.items || []) : [];
        });
        setSignalsByTab(map);
      });
    return () => { cancelled = true; };
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
    <div className="page-padding" style={{ paddingTop: '0px', paddingBottom: '96px' }}>
      <PageHeader
        title="Signals"
        showBack
        rightElement={
          <button type="button" onClick={() => navigate('/configurations')} className="pressable text-tg-hint">
            <Settings size={20} strokeWidth={1.8} />
          </button>
        }
      />
      <div style={{ height: '12px' }} />

      {/* 4 underline tabs */}
      <div className="flex items-center border-b border-tg-secondary/30" style={{ marginBottom: '20px', paddingTop: '4px' }}>
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
