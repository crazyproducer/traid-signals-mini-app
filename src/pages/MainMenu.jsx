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
    <div className="page-padding animate-fade-in" style={{ paddingTop: '32px', paddingBottom: '96px' }}>
      {/* Header */}
      <h1 className="text-[28px] font-bold text-tg-text mb-6" style={{ letterSpacing: '-0.03em' }}>
        TRAID Signals
      </h1>

      {/* Metrics row — 4 equal cards, top-aligned */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', marginBottom: '24px' }}>
        <div className="card flex flex-col items-center text-center" style={{ padding: '10px 4px' }}>
          <span className="text-[9px] uppercase font-medium text-tg-hint" style={{ letterSpacing: '0.04em' }}>Return</span>
          <span
            className={`text-[18px] font-mono font-bold leading-none ${
              totalReturn.isPositive ? 'text-green' : totalReturn.isNegative ? 'text-red' : 'text-tg-text'
            }`}
            style={{ fontVariantNumeric: 'tabular-nums', marginTop: '2px' }}
          >
            {totalReturn.text}
          </span>
        </div>
        <div className="card flex flex-col items-center text-center" style={{ padding: '10px 4px' }}>
          <span className="text-[9px] uppercase font-medium text-tg-hint" style={{ letterSpacing: '0.04em' }}>Win rate</span>
          <span className="text-[18px] font-mono font-bold text-green leading-none" style={{ fontVariantNumeric: 'tabular-nums', marginTop: '2px' }}>
            {formatWinRate(stats.win_rate)}
          </span>
          <span className="text-[9px] text-tg-hint/50 font-mono leading-none" style={{ fontVariantNumeric: 'tabular-nums', marginTop: '1px' }}>({stats.triggered})</span>
        </div>
        <div className="card flex flex-col items-center text-center" style={{ padding: '10px 4px' }}>
          <span className="text-[9px] uppercase font-medium text-tg-hint" style={{ letterSpacing: '0.04em' }}>New</span>
          <span className="text-[18px] font-mono font-bold text-violet leading-none" style={{ fontVariantNumeric: 'tabular-nums', marginTop: '2px' }}>{newCount}</span>
        </div>
        <div className="card flex flex-col items-center text-center" style={{ padding: '10px 4px' }}>
          <span className="text-[9px] uppercase font-medium text-tg-hint" style={{ letterSpacing: '0.04em' }}>Active</span>
          <span className="text-[18px] font-mono font-bold text-green leading-none" style={{ fontVariantNumeric: 'tabular-nums', marginTop: '2px' }}>{activeCount}</span>
        </div>
      </div>

      {/* Equity curve */}
      <div style={{ marginBottom: '24px' }}>
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
