import { useParams, useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Target, Shield, BarChart3 } from 'lucide-react';
import SignalStatusBadge from '../components/signals/SignalStatusBadge';
import UpdateRow from '../components/signals/UpdateRow';
import StatCard from '../components/shared/StatCard';
import Badge from '../components/shared/Badge';
import {
  formatCryptoPrice,
  formatWinRate,
  formatRiskReward,
  formatSignalId,
  formatPct,
  pnlColorClass,
} from '../utils/formatters';
import { SYMBOLS } from '../utils/constants';
import { getSignal } from '../api/signals';
import PageHeader from '../components/shared/PageHeader';
import SignalChart from '../components/signals/SignalChart';
import Skeleton from '../components/shared/Skeleton';
import SkeletonChart from '../components/shared/SkeletonChart';
import useFetchWithCache from '../hooks/useFetchWithCache';

function symbolLabel(raw) {
  const found = SYMBOLS.find((s) => s.value === raw);
  return found ? found.label : raw;
}

export default function SignalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: signal, loading, isStale, error } = useFetchWithCache(
    `signal:${id}`,
    () => getSignal(id),
  );

  // Stale cache that returned null/empty (e.g. signal got revoked, or
  // the user clicks an item they navigated back to) — treat as loading
  // until the fresh fetch resolves.
  const isLoading = loading || (isStale && !signal);

  // Skeleton placeholder while cold-starting. Mirrors the real layout
  // so the page doesn't jump when data arrives.
  if (isLoading) {
    return (
      <div className="page-padding" style={{ paddingTop: '0px', paddingBottom: '96px' }}>
        <PageHeader title="Signal detail" showBack />
        <div className="flex items-center" style={{ gap: '14px', marginTop: '16px', marginBottom: '16px' }}>
          <Skeleton style={{ width: '56px', height: '56px' }} />
          <div className="flex flex-col" style={{ flex: 1, gap: '6px' }}>
            <Skeleton style={{ width: '50%', height: '22px' }} />
            <Skeleton style={{ width: '35%', height: '14px' }} />
          </div>
          <Skeleton style={{ width: '70px', height: '28px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="card flex flex-col items-center" style={{ padding: '10px 4px', gap: '4px' }}>
              <Skeleton style={{ width: '60%', height: '10px' }} />
              <Skeleton style={{ width: '70%', height: '18px' }} />
            </div>
          ))}
        </div>
        <SkeletonChart height={200} />
      </div>
    );
  }

  if (!signal) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-[16px] font-semibold text-tg-text mb-2">Signal Not Found</p>
        <p className="text-[13px] text-tg-hint mb-5">{error?.message || `The signal ${id} could not be found.`}</p>
        <button
          type="button"
          onClick={() => navigate('/signals')}
          className="btn bg-tg-button text-tg-button-text pressable"
        >
          Back to Signals
        </button>
      </div>
    );
  }

  const isLong = signal.direction === 'LONG';
  const DirectionIcon = isLong ? TrendingUp : TrendingDown;
  const gradientClass = isLong ? 'icon-gradient-green' : 'icon-gradient-red';

  const isTriggered = signal.status === 'TRIGGERED';
  const isHitTP = signal.status === 'HIT_TP';
  const isHitSL = signal.status === 'HIT_SL';
  const isResolved = isHitTP || isHitSL;

  // PnL calculation
  let pnlPct = null;
  let pnlLabel = null;
  if (isTriggered && signal.current_price) {
    pnlPct = isLong
      ? ((signal.current_price - signal.entry_price) / signal.entry_price) * 100
      : ((signal.entry_price - signal.current_price) / signal.entry_price) * 100;
    pnlLabel = 'Unrealized';
  } else if (isResolved) {
    pnlPct = isHitTP ? signal.reward_pct : -signal.risk_pct;
    pnlLabel = 'Realized';
  }

  return (
    <div className="page-padding" style={{ paddingTop: '0px', paddingBottom: '96px' }}>
      <PageHeader title="Signal detail" showBack />
      {/* Hero */}
      <div className="flex items-center gap-3.5" style={{ marginTop: '16px', marginBottom: '16px' }}>
        <div
          className={`${gradientClass} w-14 h-14 rounded-[5px] flex items-center justify-center flex-shrink-0`}
        >
          <DirectionIcon size={28} strokeWidth={2} className="text-white" />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[20px] font-bold text-tg-text">
              {symbolLabel(signal.symbol)}
            </span>
            <span className="text-[12px] text-tg-hint">Pull Back</span>
          </div>
          <div className="flex items-center gap-2" style={{ marginTop: '2px' }}>
            <span className="text-[12px] font-mono text-tg-hint">{formatSignalId(signal.id)}</span>
            <SignalStatusBadge status={signal.status} />
          </div>
        </div>
        {/* PnL — right side */}
        {pnlPct !== null && (
          <div className="flex flex-col items-end flex-shrink-0">
            <span
              className={`text-[22px] font-mono font-bold leading-none ${pnlColorClass(pnlPct)}`}
              style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}
            >
              {formatPct(pnlPct).text}
            </span>
            <span className="text-[10px] text-tg-hint" style={{ marginTop: '2px' }}>{pnlLabel}</span>
          </div>
        )}
      </div>

      {/* Stats + Chart — responsive layout */}
      <div className="signal-stats-chart" style={{ marginBottom: '16px' }}>
        <div className="stats-row">
          <div className="card stat-item flex flex-col items-center justify-center text-center" style={{ padding: '10px 4px' }}>
            <span className="text-[9px] uppercase font-medium text-tg-hint" style={{ letterSpacing: '0.04em' }}>Win Rate</span>
            <span className="text-[16px] font-mono font-bold text-green leading-none" style={{ fontVariantNumeric: 'tabular-nums', marginTop: '2px' }}>
              {formatWinRate(signal.win_rate)}
            </span>
          </div>
          <div className="card stat-item flex flex-col items-center justify-center text-center" style={{ padding: '10px 4px' }}>
            <span className="text-[9px] uppercase font-medium text-tg-hint" style={{ letterSpacing: '0.04em' }}>Trades</span>
            <span className="text-[16px] font-mono font-bold text-tg-text leading-none" style={{ fontVariantNumeric: 'tabular-nums', marginTop: '2px' }}>
              {signal.matching_trades}
            </span>
          </div>
          <div className="card stat-item flex flex-col items-center justify-center text-center" style={{ padding: '10px 4px' }}>
            <span className="text-[9px] uppercase font-medium text-tg-hint" style={{ letterSpacing: '0.04em' }}>R:R</span>
            <span className="text-[16px] font-mono font-bold text-tg-text leading-none" style={{ fontVariantNumeric: 'tabular-nums', marginTop: '2px' }}>
              {formatRiskReward(signal.risk_pct, signal.reward_pct)}
            </span>
          </div>
        </div>
        <div className="chart-container">
          <SignalChart signal={signal} />
        </div>
      </div>

      {/* Update history */}
      {(signal.updates || []).length > 0 && (
        <div>
          <span className="text-[12px] uppercase font-medium text-tg-hint block" style={{ letterSpacing: '0.06em', marginBottom: '10px' }}>
            Update History
          </span>
          <div className="card" style={{ padding: '12px 16px' }}>
            {(signal.updates || []).map((update, i) => (
              <UpdateRow key={i} update={update} signal={signal} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
