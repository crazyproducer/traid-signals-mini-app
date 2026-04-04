import { useNavigate } from 'react-router-dom';
import { Plus, Target, TrendingUp, ChevronRight, ArrowRight } from 'lucide-react';
import SignalCard from '../components/signals/SignalCard';
import { getActiveSignalsCount, getRecentSignals, mockPerformance, mockSignalSubscriptions } from '../api/mock-data';
import { formatWinRate, formatPct } from '../utils/formatters';

export default function MainMenu() {
  const navigate = useNavigate();
  const activeCount = getActiveSignalsCount();
  const recentSignals = getRecentSignals(3);
  const stats = mockPerformance;
  const totalReturn = formatPct(stats.total_return_pct);

  const quickStats = [
    { label: 'Active', value: activeCount, colorClass: 'text-green' },
    { label: 'Win Rate', value: formatWinRate(stats.win_rate), colorClass: 'text-green' },
    { label: 'Return', value: totalReturn.text, colorClass: totalReturn.isPositive ? 'text-green' : totalReturn.isNegative ? 'text-red' : 'text-tg-text' },
  ];

  return (
    <div className="px-5 pt-8 pb-8 animate-fade-in">
      {/* Header */}
      <h1 className="text-[28px] font-bold text-tg-text mb-6" style={{ letterSpacing: '-0.03em' }}>
        TRAID Signals
      </h1>

      {/* Quick stats row */}
      <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar">
        {quickStats.map((stat) => (
          <div key={stat.label} className="card px-4 py-3 flex flex-col items-center min-w-[100px] flex-1">
            <span className="text-[11px] uppercase font-medium text-tg-hint" style={{ letterSpacing: '0.06em' }}>
              {stat.label}
            </span>
            <span
              className={`text-[22px] font-mono font-bold ${stat.colorClass}`}
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Create new signal CTA */}
      <button
        type="button"
        onClick={() => navigate('/new-signal')}
        className="card-elevated pressable w-full text-left p-5 flex items-center gap-4 mb-8"
      >
        <div className="icon-gradient-green w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0">
          <Plus size={24} strokeWidth={2} className="text-white" />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[16px] font-semibold text-tg-text" style={{ letterSpacing: '-0.01em' }}>
            Create New Signal
          </span>
          <span className="text-[13px] text-tg-hint mt-0.5">
            Configure and launch a subscription
          </span>
        </div>
        <ArrowRight size={20} className="text-tg-hint/40 flex-shrink-0" />
      </button>

      {/* Recent signals section */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] uppercase font-medium text-tg-hint" style={{ letterSpacing: '0.06em' }}>
          Recent
        </span>
        <button
          type="button"
          onClick={() => navigate('/signals')}
          className="text-[13px] font-medium text-tg-accent pressable"
        >
          View all
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {recentSignals.map((signal) => {
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
    </div>
  );
}
