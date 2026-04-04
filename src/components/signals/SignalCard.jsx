import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import SignalStatusBadge from './SignalStatusBadge';
import Badge from '../shared/Badge';
import {
  formatCryptoPrice,
  formatWinRate,
  formatRelativeTime,
  formatDirection,
  formatPct,
  pnlColorClass,
} from '../../utils/formatters';
import { SYMBOLS } from '../../utils/constants';

function symbolLabel(raw) {
  const found = SYMBOLS.find((s) => s.value === raw);
  return found ? found.label : raw;
}

export default function SignalCard({ signal, subscription, onClick }) {
  const isLong = signal.direction === 'LONG';
  const DirectionIcon = isLong ? TrendingUp : TrendingDown;
  const gradientClass = isLong ? 'icon-gradient-green' : 'icon-gradient-red';
  const directionVariant = isLong ? 'long' : 'short';

  const isResolved = signal.result === 'WIN' || signal.result === 'LOSS';
  const pnlPct = isResolved
    ? signal.result === 'WIN'
      ? signal.reward_pct
      : -signal.risk_pct
    : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="card-premium-sm pressable w-full text-left p-4 flex items-center gap-4"
    >
      {/* Direction icon — squircle */}
      <div className={`${gradientClass} w-12 h-12 rounded-[15px] flex items-center justify-center flex-shrink-0`}>
        <DirectionIcon size={22} strokeWidth={1.8} className="text-white" />
      </div>

      {/* Content */}
      <div className="flex flex-col min-w-0 flex-1 gap-1">
        {/* Symbol + direction */}
        <div className="flex items-center gap-2">
          <span className="text-[16px] font-semibold text-tg-text truncate" style={{ letterSpacing: '-0.01em' }}>
            {symbolLabel(signal.symbol)}
          </span>
          <Badge variant={directionVariant}>{formatDirection(signal.direction)}</Badge>
        </div>

        {/* Price row */}
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-mono text-tg-hint" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatCryptoPrice(signal.entry_price)}
          </span>
          <span className="text-[11px] text-tg-hint/40">
            {formatRelativeTime(signal.created_at)}
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        {isResolved && pnlPct !== null ? (
          <>
            <span
              className={`text-[17px] font-mono font-bold ${pnlColorClass(pnlPct)}`}
              style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}
            >
              {formatPct(pnlPct).text}
            </span>
            <SignalStatusBadge status={signal.status} />
          </>
        ) : (
          <>
            <SignalStatusBadge status={signal.status} />
            <ChevronRight size={16} className="text-tg-hint/30" />
          </>
        )}
      </div>
    </button>
  );
}
