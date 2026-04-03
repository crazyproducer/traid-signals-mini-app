import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Target, Shield, BarChart3, Trash2, AlertTriangle } from 'lucide-react';
import SignalStatusBadge from '../components/signals/SignalStatusBadge';
import UpdateRow from '../components/signals/UpdateRow';
import Badge from '../components/shared/Badge';
import {
  formatCryptoPrice,
  formatWinRate,
  formatRiskReward,
  formatDirection,
  formatSignalId,
  formatRelativeTime,
} from '../utils/formatters';
import { SYMBOLS } from '../utils/constants';
import { mockSignals } from '../api/mock-data';

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
        <p className="text-[15px] font-semibold text-tg-text mb-2">Signal Not Found</p>
        <p className="text-[13px] text-tg-hint mb-5">The signal {id} could not be found.</p>
        <button
          type="button"
          onClick={() => navigate('/signals')}
          className="bg-tg-button text-tg-button-text text-[14px] font-semibold rounded-2xl px-6 py-3 pressable"
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
    <div className="px-5 pt-6 pb-8 animate-fade-in">
      {/* Hero */}
      <div className="flex items-center gap-3.5 mb-6">
        <div
          className={`${gradientClass} w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0`}
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

      {/* Price card — vertical, ordered by price level */}
      <div className="card-premium p-5 mb-4">
        {[
          isLong
            ? [
                { label: 'Take Profit', price: signal.take_profit, color: 'text-green', pct: `+${signal.reward_pct}%` },
                { label: 'Entry', price: signal.entry_price, color: 'text-tg-text', pct: null },
                { label: 'Stop Loss', price: signal.stop_loss, color: 'text-red', pct: `-${signal.risk_pct}%` },
              ]
            : [
                { label: 'Stop Loss', price: signal.stop_loss, color: 'text-red', pct: `-${signal.risk_pct}%` },
                { label: 'Entry', price: signal.entry_price, color: 'text-tg-text', pct: null },
                { label: 'Take Profit', price: signal.take_profit, color: 'text-green', pct: `+${signal.reward_pct}%` },
              ],
        ][0].map((row, i, arr) => (
          <div key={row.label}>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${row.color === 'text-green' ? 'bg-green' : row.color === 'text-red' ? 'bg-red' : 'bg-tg-text'}`} />
                <span className="text-[12px] uppercase tracking-wider text-tg-hint font-medium">{row.label}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-[17px] font-mono font-bold ${row.color}`}
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {formatCryptoPrice(row.price)}
                </span>
                {row.pct && (
                  <span className={`text-[11px] font-mono font-medium ${row.color}/70`}>
                    {row.pct}
                  </span>
                )}
              </div>
            </div>
            {i < arr.length - 1 && <div className="border-b border-tg-secondary/15" />}
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div className="card-premium-sm p-4 mb-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 mb-1">
              <Target size={12} className="text-green" />
              <span className="text-[10px] uppercase tracking-wider text-tg-hint">Win Rate</span>
            </div>
            <span className="text-[16px] font-mono font-bold text-green" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {formatWinRate(signal.win_rate)}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 mb-1">
              <BarChart3 size={12} className="text-blue" />
              <span className="text-[10px] uppercase tracking-wider text-tg-hint">Trades</span>
            </div>
            <span className="text-[16px] font-mono font-bold text-tg-text" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {signal.matching_trades}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 mb-1">
              <Shield size={12} className="text-violet" />
              <span className="text-[10px] uppercase tracking-wider text-tg-hint">R:R</span>
            </div>
            <span className="text-[16px] font-mono font-bold text-tg-text" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {formatRiskReward(signal.risk_pct, signal.reward_pct)}
            </span>
          </div>
        </div>
      </div>

      {/* Update history */}
      <div className="mb-6">
        <h3 className="text-[14px] font-semibold text-tg-text mb-3">Update History</h3>
        <div className="card-premium-sm px-4">
          {(signal.updates || []).map((update, i) => (
            <UpdateRow key={i} update={update} signal={signal} />
          ))}
        </div>
      </div>

      {/* Delete button */}
      <div className="relative">
        {!showConfirm ? (
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="w-full py-3 rounded-2xl text-[14px] font-semibold text-tg-destructive bg-tg-destructive/8 pressable"
          >
            <span className="flex items-center justify-center gap-2">
              <Trash2 size={16} strokeWidth={2} />
              Delete Signal
            </span>
          </button>
        ) : (
          <div className="card-premium p-5 animate-slide-down">
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
                className="flex-1 py-3 rounded-2xl text-[14px] font-semibold bg-tg-secondary/60 text-tg-text pressable"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirm(false);
                  navigate('/signals');
                }}
                className="flex-1 py-3 rounded-2xl text-[14px] font-semibold bg-tg-destructive text-white pressable"
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
