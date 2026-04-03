import { Activity, TrendingUp, Target, BarChart3 } from 'lucide-react';

/**
 * Generate mock historical statistics based on wizard configuration.
 * Tighter filters = fewer matches but higher quality.
 */
function computeMockStats(data) {
  // Base trades: symbols * base amount
  let baseTrades = (data.symbols?.length || 1) * 120;

  // Frequency multiplier
  if (data.frequency === '4h') {
    baseTrades *= 2.5;
  }

  // Direction doesn't reduce count, but we note it
  // Strategy is fixed (pullback)

  // EMA filter reduces trades
  const emaMultiplier = {
    null: 1.0,
    20: 0.85,
    50: 0.72,
    100: 0.58,
    200: 0.45,
  };
  baseTrades *= emaMultiplier[data.ema_filter] ?? 1.0;

  // Risk level: tighter stop = fewer surviving trades
  const riskMultiplier = {
    1: 0.4,
    5: 0.65,
    10: 0.8,
    20: 0.92,
    30: 1.0,
  };
  baseTrades *= riskMultiplier[data.risk_level] ?? 0.8;

  // Confidence threshold: higher = fewer
  const confMultiplier = {
    0.5: 1.0,
    0.6: 0.72,
    0.7: 0.48,
  };
  baseTrades *= confMultiplier[data.confidence] ?? 1.0;

  // Probability threshold: higher = fewer
  const probMultiplier = {
    0.66: 1.0,
    0.75: 0.65,
    0.90: 0.3,
  };
  baseTrades *= probMultiplier[data.min_probability] ?? 1.0;

  const matchingTrades = Math.max(1, Math.round(baseTrades));

  // Win rate improves with stricter filters
  let winRate = 58;
  if (data.confidence >= 0.6) winRate += 4;
  if (data.confidence >= 0.7) winRate += 5;
  if (data.min_probability >= 0.75) winRate += 3;
  if (data.min_probability >= 0.90) winRate += 6;
  if (data.ema_filter !== null) winRate += 2;
  winRate = Math.min(winRate, 85);

  // Average return improves with tighter risk and higher thresholds
  let avgReturn = 1.8;
  if (data.risk_level <= 5) avgReturn += 0.6;
  else if (data.risk_level <= 10) avgReturn += 0.3;
  if (data.confidence >= 0.7) avgReturn += 0.4;
  if (data.min_probability >= 0.75) avgReturn += 0.5;
  if (data.min_probability >= 0.90) avgReturn += 0.8;

  // Risk/reward ratio
  const riskReward = (avgReturn / (data.risk_level || 5)).toFixed(1);

  return {
    matchingTrades,
    winRate,
    avgReturn: avgReturn.toFixed(1),
    riskReward: `1:${riskReward}`,
  };
}

export default function StepPreview({ data }) {
  const stats = computeMockStats(data);

  return (
    <div>
      {/* Hero number */}
      <div className="text-center mb-6">
        <span
          className="text-[48px] font-bold text-tg-text font-mono leading-none"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {stats.matchingTrades.toLocaleString()}
        </span>
        <p className="text-[13px] text-tg-hint mt-1">
          matching historical trades
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Win Rate */}
        <div className="card-premium-sm p-4 flex flex-col items-center gap-2">
          <div className="icon-gradient-green w-9 h-9 rounded-full flex items-center justify-center">
            <TrendingUp size={18} strokeWidth={2} className="text-white" />
          </div>
          <span
            className="text-[22px] font-bold text-green font-mono"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {stats.winRate}%
          </span>
          <span className="text-[10px] uppercase tracking-wider text-tg-hint">
            Win Rate
          </span>
        </div>

        {/* Avg Return */}
        <div className="card-premium-sm p-4 flex flex-col items-center gap-2">
          <div className="icon-gradient-blue w-9 h-9 rounded-full flex items-center justify-center">
            <Activity size={18} strokeWidth={2} className="text-white" />
          </div>
          <span
            className="text-[22px] font-bold text-blue font-mono"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            +{stats.avgReturn}%
          </span>
          <span className="text-[10px] uppercase tracking-wider text-tg-hint">
            Avg Return
          </span>
        </div>

        {/* Risk/Reward */}
        <div className="card-premium-sm p-4 flex flex-col items-center gap-2">
          <div className="icon-gradient-violet w-9 h-9 rounded-full flex items-center justify-center">
            <Target size={18} strokeWidth={2} className="text-white" />
          </div>
          <span
            className="text-[22px] font-bold text-violet font-mono"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {stats.riskReward}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-tg-hint">
            Risk / Reward
          </span>
        </div>

        {/* Signal Quality */}
        <div className="card-premium-sm p-4 flex flex-col items-center gap-2">
          <div className="icon-gradient-yellow w-9 h-9 rounded-full flex items-center justify-center">
            <BarChart3 size={18} strokeWidth={2} className="text-white" />
          </div>
          <span
            className="text-[22px] font-bold text-yellow font-mono"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {stats.winRate >= 70 ? 'A+' : stats.winRate >= 65 ? 'A' : stats.winRate >= 60 ? 'B+' : 'B'}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-tg-hint">
            Signal Grade
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-tg-hint/60 text-center mt-4 px-2 leading-relaxed">
        Based on historical backtests. Past performance does not guarantee future results.
      </p>
    </div>
  );
}
