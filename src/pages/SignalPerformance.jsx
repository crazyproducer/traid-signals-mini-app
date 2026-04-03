import { useState } from 'react';
import { Target, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import PerformanceChart from '../components/signals/PerformanceChart';
import StatCard from '../components/shared/StatCard';
import { mockPerformance, mockEquityCurve } from '../api/mock-data';
import { formatWinRate, formatPct } from '../utils/formatters';

const PERIODS = ['30D', '90D', 'ALL'];

export default function SignalPerformance() {
  const [period, setPeriod] = useState('90D');
  const stats = mockPerformance;
  const chartData = mockEquityCurve[period] || [];

  const totalReturn = formatPct(stats.total_return_pct);

  return (
    <div className="px-5 pt-6 pb-8 animate-fade-in">
      {/* Header */}
      <h1 className="text-[20px] font-bold text-tg-text mb-5">Performance</h1>

      {/* Hero win rate */}
      <div className="flex flex-col items-center mb-6">
        <span className="text-[10px] uppercase tracking-wider text-tg-hint mb-1">Overall Win Rate</span>
        <span
          className="text-[40px] font-mono font-bold text-green leading-none"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {formatWinRate(stats.win_rate)}
        </span>
        <span className="text-[13px] text-tg-hint mt-1">
          {stats.wins}W / {stats.losses}L of {stats.triggered} triggered
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="card-premium-sm p-4 flex items-center gap-3">
          <div className="icon-gradient-blue w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0">
            <Activity size={16} strokeWidth={2} className="text-white" />
          </div>
          <StatCard
            label="Triggered"
            value={stats.triggered}
            sublabel={`of ${stats.total_signals} total`}
          />
        </div>
        <div className="card-premium-sm p-4 flex items-center gap-3">
          <div className="icon-gradient-green w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0">
            <TrendingUp size={16} strokeWidth={2} className="text-white" />
          </div>
          <StatCard
            label="Wins"
            value={stats.wins}
            colorClass="text-green"
          />
        </div>
        <div className="card-premium-sm p-4 flex items-center gap-3">
          <div className="icon-gradient-red w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0">
            <TrendingDown size={16} strokeWidth={2} className="text-white" />
          </div>
          <StatCard
            label="Losses"
            value={stats.losses}
            colorClass="text-red"
          />
        </div>
        <div className="card-premium-sm p-4 flex items-center gap-3">
          <div className="icon-gradient-violet w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0">
            <Target size={16} strokeWidth={2} className="text-white" />
          </div>
          <StatCard
            label="Avg Return"
            value={`+${stats.avg_profit_pct}%`}
            sublabel={`Loss avg ${stats.avg_loss_pct}%`}
            colorClass="text-green"
          />
        </div>
      </div>

      {/* Chart section */}
      <div className="card-premium p-5 mb-4">
        {/* Period selector */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[14px] font-semibold text-tg-text">Equity Curve</span>
          <div className="flex items-center gap-1 bg-tg-secondary/40 rounded-lg p-0.5">
            {PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all duration-200 ${
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

        {/* Chart */}
        <PerformanceChart data={chartData} loading={false} />

        {/* Total return */}
        <div className="flex items-center justify-center mt-4 pt-3 border-t border-tg-secondary/40">
          <span className="text-[12px] text-tg-hint mr-2">Total Return</span>
          <span
            className={`text-[18px] font-mono font-bold ${totalReturn.isPositive ? 'text-green' : totalReturn.isNegative ? 'text-red' : 'text-tg-text'}`}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {totalReturn.text}
          </span>
        </div>
      </div>
    </div>
  );
}
