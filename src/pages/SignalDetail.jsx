import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Target, Shield, BarChart3, Trash2, AlertTriangle } from 'lucide-react';
import SignalStatusBadge from '../components/signals/SignalStatusBadge';
import UpdateRow from '../components/signals/UpdateRow';
import StatCard from '../components/shared/StatCard';
import Badge from '../components/shared/Badge';
import {
  formatCryptoPrice,
  formatWinRate,
  formatRiskReward,
  formatDirection,
  formatSignalId,
} from '../utils/formatters';
import { SYMBOLS } from '../utils/constants';
import { mockSignals } from '../api/mock-data';
import PageHeader from '../components/shared/PageHeader';
import SignalChart from '../components/signals/SignalChart';

function symbolLabel(raw) {
  const found = SYMBOLS.find((s) => s.value === raw);
  return found ? found.label : raw;
}

export default function SignalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const signal = mockSignals.find((s) => s.id === id);

  if (!signal) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-[16px] font-semibold text-tg-text mb-2">Signal Not Found</p>
        <p className="text-[13px] text-tg-hint mb-5">The signal {id} could not be found.</p>
        <button
          type="button"
          onClick={() => navigate('/signals')}
          className="bg-tg-button text-tg-button-text text-[14px] font-semibold rounded-[5px] px-6 py-3 pressable"
        >
          Back to Signals
        </button>
      </div>
    );
  }

  const isLong = signal.direction === 'LONG';
  const DirectionIcon = isLong ? TrendingUp : TrendingDown;
  const gradientClass = isLong ? 'icon-gradient-green' : 'icon-gradient-red';
  const directionVariant = isLong ? 'long' : 'short';

  return (
    <div className="page-padding" style={{ paddingTop: '0px', paddingBottom: '96px' }}>
      <PageHeader title="Signal detail" showBack />
      {/* Hero */}
      <div className="flex items-center gap-3.5 mb-6">
        <div
          className={`${gradientClass} w-14 h-14 rounded-[5px] flex items-center justify-center flex-shrink-0`}
        >
          <DirectionIcon size={28} strokeWidth={2} className="text-white" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[20px] font-bold text-tg-text">
              {symbolLabel(signal.symbol)}
            </span>
            <Badge variant={directionVariant}>{formatDirection(signal.direction)}</Badge>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[12px] font-mono text-tg-hint">{formatSignalId(signal.id)}</span>
            <SignalStatusBadge status={signal.status} />
          </div>
        </div>
      </div>

      {/* Stats (30%) + Chart (70%) — same height row */}
      <div style={{ display: 'flex', alignItems: 'stretch', gap: '8px', marginBottom: '16px' }}>
        {/* Stats column — 3 separate cards */}
        <div style={{ width: '30%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div className="card flex flex-col items-center justify-center text-center" style={{ padding: '8px 4px', flex: 1 }}>
            <span className="text-[9px] uppercase font-medium text-tg-hint" style={{ letterSpacing: '0.04em' }}>Win Rate</span>
            <span className="text-[16px] font-mono font-bold text-green leading-none" style={{ fontVariantNumeric: 'tabular-nums', marginTop: '2px' }}>
              {formatWinRate(signal.win_rate)}
            </span>
          </div>
          <div className="card flex flex-col items-center justify-center text-center" style={{ padding: '8px 4px', flex: 1 }}>
            <span className="text-[9px] uppercase font-medium text-tg-hint" style={{ letterSpacing: '0.04em' }}>Trades</span>
            <span className="text-[16px] font-mono font-bold text-tg-text leading-none" style={{ fontVariantNumeric: 'tabular-nums', marginTop: '2px' }}>
              {signal.matching_trades}
            </span>
          </div>
          <div className="card flex flex-col items-center justify-center text-center" style={{ padding: '8px 4px', flex: 1 }}>
            <span className="text-[9px] uppercase font-medium text-tg-hint" style={{ letterSpacing: '0.04em' }}>R:R</span>
            <span className="text-[16px] font-mono font-bold text-tg-text leading-none" style={{ fontVariantNumeric: 'tabular-nums', marginTop: '2px' }}>
              {formatRiskReward(signal.risk_pct, signal.reward_pct)}
            </span>
          </div>
        </div>
        {/* Chart — 70% */}
        <div style={{ width: '60%' }}>
          <SignalChart signal={signal} />
        </div>
      </div>

      {/* Update history */}
      {(signal.updates || []).length > 0 && (
        <div className="mb-6">
          <span className="text-[12px] uppercase font-medium text-tg-hint mb-3 block" style={{ letterSpacing: '0.06em' }}>
            Update History
          </span>
          <div className="card px-4">
            {(signal.updates || []).map((update, i) => (
              <UpdateRow key={i} update={update} signal={signal} />
            ))}
          </div>
        </div>
      )}

      {/* Delete button */}
      <div className="relative">
        {!showConfirm ? (
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="w-full py-3 rounded-[5px] text-[14px] font-semibold text-tg-destructive bg-tg-destructive/8 pressable"
          >
            <span className="flex items-center justify-center gap-2">
              <Trash2 size={16} strokeWidth={2} />
              Delete Signal
            </span>
          </button>
        ) : (
          <div className="card p-5 animate-slide-down">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-gradient-red w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} strokeWidth={2} className="text-white" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-tg-text">Delete this signal?</p>
                <p className="text-[12px] text-tg-hint">This action cannot be undone</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-[5px] text-[14px] font-semibold bg-tg-secondary/60 text-tg-text pressable"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirm(false);
                  navigate('/signals');
                }}
                className="flex-1 py-3 rounded-[5px] text-[14px] font-semibold bg-tg-destructive text-white pressable"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
