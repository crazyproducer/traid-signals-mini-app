import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import SignalCard from '../components/signals/SignalCard';
import PerformanceChart from '../components/signals/PerformanceChart';
import StatCard from '../components/shared/StatCard';
import {
  getActiveSignalsCount,
  getNewSignalsCount,
  getRecentSignals,
  mockPerformance,
  mockEquityCurve,
  mockSignalSubscriptions,
} from '../api/mock-data';
import { formatWinRate, formatPct } from '../utils/formatters';

const PERIODS = ['30D', '90D', 'ALL'];

export default function MainMenu() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('90D');

  const activeCount = getActiveSignalsCount();
  const newCount = getNewSignalsCount();
  const recentSignals = getRecentSignals(3);
  const stats = mockPerformance;
  const chartData = mockEquityCurve[period] || [];
  const totalReturn = formatPct(stats.total_return_pct);

  return (
    <div className="px-5 pt-8 pb-28 animate-fade-in">
      {/* Header */}
      <h1 className="text-[28px] font-bold text-tg-text mb-6" style={{ letterSpacing: '-0.03em' }}>
        TRAID Signals
      </h1>

      {/* Hero — Total Return as key indicator */}
      <div className="flex items-stretch gap-3 mb-5">
        {/* Return — hero number */}
        <div className="flex flex-col items-center justify-center card px-5 py-4 flex-1">
          <span className="text-[11px] uppercase font-medium text-tg-hint mb-1" style={{ letterSpacing: '0.06em' }}>
            Total return
          </span>
          <span
            className={`text-[36px] font-mono font-bold leading-none ${
              totalReturn.isPositive ? 'text-green' : totalReturn.isNegative ? 'text-red' : 'text-tg-text'
            }`}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {totalReturn.text}
          </span>
          <span className="text-[11px] text-tg-hint mt-1">
            WR {formatWinRate(stats.win_rate)}
          </span>
        </div>

        {/* Stats column: New + Active + Win/Loss */}
        <div className="flex flex-col gap-2 min-w-[110px]">
          <div className="card px-4 py-2.5 flex-1">
            <StatCard label="New" value={newCount} colorClass="text-violet" />
          </div>
          <div className="card px-4 py-2.5 flex-1">
            <StatCard label="Active" value={activeCount} colorClass="text-green" />
          </div>
          <div className="card px-4 py-2.5 flex-1">
            <StatCard label="W / L" value={`${stats.wins} / ${stats.losses}`} />
          </div>
        </div>
      </div>

      {/* Equity curve */}
      <div className="card p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-semibold text-tg-text">Equity curve</span>
          <div className="flex items-center gap-0.5 bg-tg-secondary/40 rounded-lg p-0.5">
            {PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all duration-200 ${
                  period === p
                    ? 'bg-tg-section text-tg-text shadow-sm'
                    : 'text-tg-hint'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <PerformanceChart data={chartData} loading={false} />
      </div>

      {/* Recent signals */}
      {recentSignals.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] uppercase font-medium text-tg-hint" style={{ letterSpacing: '0.06em' }}>
              Recent signals
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
              const sub = mockSignalSubscriptions.find((s) => s.id === signal.subscription_id);
              return (
                <SignalCard
                  key={signal.id}
                  signal={signal}
                  subscription={sub}
                  onClick={() => navigate(`/signals/${signal.id}`)}
                />
              );
            })}
          </div>
        </>
      )}

      {/* FAB — Create new signal */}
      <button
        type="button"
        onClick={() => navigate('/new-signal')}
        className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full icon-gradient-green flex items-center justify-center pressable"
      >
        <Plus size={28} strokeWidth={2.5} className="text-white" />
      </button>
    </div>
  );
}
