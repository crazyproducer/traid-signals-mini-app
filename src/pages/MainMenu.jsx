import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="page-padding pt-8 pb-28 animate-fade-in">
      {/* Header */}
      <h1 className="text-[28px] font-bold text-tg-text mb-6" style={{ letterSpacing: '-0.03em' }}>
        TRAID Signals
      </h1>

      {/* Hero — Total Return + stats */}
      <div className="flex gap-4" style={{ marginBottom: '24px' }}>
        {/* Return — hero number */}
        <div className="flex flex-col items-center justify-center card px-5 py-5 flex-[3]">
          <span className="text-[11px] uppercase font-medium text-tg-hint mb-1.5" style={{ letterSpacing: '0.06em' }}>
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
          <span className="text-[11px] text-tg-hint mt-1.5">
            WR {formatWinRate(stats.win_rate)}
          </span>
        </div>

        {/* Stats column — 25% width */}
        <div className="flex flex-col gap-2 flex-1">
          <div className="card px-3 py-2.5 text-center flex-1 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-medium text-tg-hint block" style={{ letterSpacing: '0.05em' }}>New</span>
            <span className="text-[18px] font-mono font-bold text-violet block" style={{ fontVariantNumeric: 'tabular-nums' }}>{newCount}</span>
          </div>
          <div className="card px-3 py-2.5 text-center flex-1 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-medium text-tg-hint block" style={{ letterSpacing: '0.05em' }}>Active</span>
            <span className="text-[18px] font-mono font-bold text-green block" style={{ fontVariantNumeric: 'tabular-nums' }}>{activeCount}</span>
          </div>
          <div className="card px-3 py-2.5 text-center flex-1 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-medium text-tg-hint block" style={{ letterSpacing: '0.05em' }}>W / L</span>
            <span className="text-[16px] font-mono font-bold text-tg-text block" style={{ fontVariantNumeric: 'tabular-nums' }}>{stats.wins}/{stats.losses}</span>
          </div>
        </div>
      </div>

      {/* Equity curve */}
      <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[13px] font-semibold text-tg-text">Equity curve</span>
          <div className="flex items-center gap-1.5">
            {PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`min-w-[44px] min-h-[36px] flex items-center justify-center rounded-[4px] text-[12px] font-semibold transition-all duration-200 ${
                  period === p
                    ? 'bg-tg-text/8 text-tg-text'
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
          <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
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
          <div className="flex flex-col" style={{ gap: '16px' }}>
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
