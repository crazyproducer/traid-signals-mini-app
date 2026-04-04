import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight } from 'lucide-react';
import SignalCard from '../components/signals/SignalCard';
import PerformanceChart from '../components/signals/PerformanceChart';
import StatCard from '../components/shared/StatCard';
import {
  getActiveSignalsCount,
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
  const recentSignals = getRecentSignals(3);
  const stats = mockPerformance;
  const chartData = mockEquityCurve[period] || [];
  const totalReturn = formatPct(stats.total_return_pct);

  return (
    <div className="px-5 pt-8 pb-24 animate-fade-in">
      {/* Header */}
      <h1 className="text-[28px] font-bold text-tg-text mb-6" style={{ letterSpacing: '-0.03em' }}>
        TRAID Signals
      </h1>

      {/* Performance hero — win rate + stats */}
      <div className="flex items-center gap-4 mb-5">
        {/* Win rate — big number */}
        <div className="flex flex-col items-center card px-5 py-4">
          <span className="text-[11px] uppercase font-medium text-tg-hint mb-1" style={{ letterSpacing: '0.06em' }}>
            Win rate
          </span>
          <span
            className="text-[36px] font-mono font-bold text-green leading-none"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {formatWinRate(stats.win_rate)}
          </span>
          <span className="text-[11px] text-tg-hint mt-1">
            {stats.wins}W / {stats.losses}L
          </span>
        </div>

        {/* Stats column */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="card px-4 py-3">
            <StatCard label="Active" value={activeCount} colorClass="text-green" />
          </div>
          <div className="card px-4 py-3">
            <StatCard
              label="Return"
              value={totalReturn.text}
              colorClass={totalReturn.isPositive ? 'text-green' : totalReturn.isNegative ? 'text-red' : 'text-tg-text'}
            />
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
        <div className="flex items-center justify-center mt-3 pt-3 border-t border-tg-secondary/20">
          <span className="text-[12px] text-tg-hint mr-2">Total return</span>
          <span
            className={`text-[16px] font-mono font-bold ${totalReturn.isPositive ? 'text-green' : totalReturn.isNegative ? 'text-red' : 'text-tg-text'}`}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {totalReturn.text}
          </span>
        </div>
      </div>

      {/* Create new signal CTA */}
      <button
        type="button"
        onClick={() => navigate('/new-signal')}
        className="card-elevated pressable w-full text-left p-5 flex items-center gap-4 mb-6"
      >
        <div className="icon-gradient-green w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0">
          <Plus size={24} strokeWidth={2} className="text-white" />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[16px] font-semibold text-tg-text" style={{ letterSpacing: '-0.01em' }}>
            Create new signal
          </span>
          <span className="text-[13px] text-tg-hint mt-0.5">
            Configure and launch a subscription
          </span>
        </div>
        <ArrowRight size={20} className="text-tg-hint/40 flex-shrink-0" />
      </button>

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
    </div>
  );
}
