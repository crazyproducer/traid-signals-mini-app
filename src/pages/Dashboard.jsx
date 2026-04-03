import { useNavigate } from 'react-router-dom';
import { Plus, Radio, TrendingUp, ChevronRight } from 'lucide-react';
import SignalCard from '../components/signals/SignalCard';
import {
  getActiveSignalsCount,
  getRecentSignals,
  mockPerformance,
  mockSignalSubscriptions,
} from '../api/mock-data';
import { formatWinRate, formatPct } from '../utils/formatters';

export default function Dashboard() {
  const navigate = useNavigate();
  const activeCount = getActiveSignalsCount();
  const recentSignals = getRecentSignals(3);
  const totalReturn = formatPct(mockPerformance.total_return_pct);

  return (
    <div className="px-5 pt-8 pb-8 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[24px] font-bold text-tg-text leading-tight">
          TRAID Signals
        </h1>
        <p className="text-[14px] text-tg-hint mt-1">
          Automated trading signals
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card-premium-sm px-4 py-4 flex flex-col items-center">
          <div className="flex items-center gap-1 mb-1.5">
            <Radio size={12} className="text-blue" />
            <span className="text-[10px] uppercase tracking-wider text-tg-hint">Active</span>
          </div>
          <span
            className="text-[22px] font-mono font-bold text-tg-text leading-none"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {activeCount}
          </span>
        </div>

        <div className="card-premium-sm px-4 py-4 flex flex-col items-center">
          <div className="flex items-center gap-1 mb-1.5">
            <TrendingUp size={12} className="text-green" />
            <span className="text-[10px] uppercase tracking-wider text-tg-hint">Win Rate</span>
          </div>
          <span
            className="text-[22px] font-mono font-bold text-green leading-none"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {formatWinRate(mockPerformance.win_rate)}
          </span>
        </div>

        <div className="card-premium-sm px-4 py-4 flex flex-col items-center">
          <div className="flex items-center gap-1 mb-1.5">
            <TrendingUp size={12} className={totalReturn.isPositive ? 'text-green' : totalReturn.isNegative ? 'text-red' : 'text-tg-hint'} />
            <span className="text-[10px] uppercase tracking-wider text-tg-hint">Return</span>
          </div>
          <span
            className={`text-[22px] font-mono font-bold leading-none ${
              totalReturn.isPositive ? 'text-green' : totalReturn.isNegative ? 'text-red' : 'text-tg-text'
            }`}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {totalReturn.text}
          </span>
        </div>
      </div>

      {/* Quick action: Create Signal */}
      <button
        type="button"
        onClick={() => navigate('/new-signal')}
        className="w-full mb-6 pressable"
      >
        <div className="icon-gradient-green rounded-2xl px-5 py-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Plus size={24} strokeWidth={2.5} className="text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[16px] font-bold text-white leading-tight">
              Create Signal
            </span>
            <span className="text-[13px] text-white/70 mt-0.5">
              Configure and launch a new signal
            </span>
          </div>
          <ChevronRight size={20} className="text-white/50 flex-shrink-0 ml-auto" />
        </div>
      </button>

      {/* Recent signals */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-semibold text-tg-text">Recent Signals</h2>
          <button
            type="button"
            onClick={() => navigate('/signals')}
            className="flex items-center gap-1 text-[13px] font-medium text-tg-accent pressable"
          >
            View All
            <ChevronRight size={14} />
          </button>
        </div>

        {recentSignals.length > 0 ? (
          <div className="flex flex-col gap-3 animate-fade-in-children">
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
        ) : (
          <div className="card-premium-sm px-4 py-8 flex flex-col items-center text-center">
            <Radio size={24} className="text-tg-hint/40 mb-2" />
            <p className="text-[14px] font-medium text-tg-hint">No signals yet</p>
            <p className="text-[12px] text-tg-hint/60 mt-0.5">Create a signal subscription to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
