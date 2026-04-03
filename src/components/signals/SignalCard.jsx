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

const ACTIVE_STATUSES = ['ACTIVE', 'UPDATED', 'TRIGGERED'];

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

  const isActive = ACTIVE_STATUSES.includes(signal.status);
  const hasCurrentPrice = isActive && signal.current_price != null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="card-premium-sm pressable w-full text-left px-4 py-4 flex items-center gap-3.5"
    >
      {/* Gradient icon */}
      <div
        className={`${gradientClass} w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0`}
      >
        <DirectionIcon size={20} strokeWidth={2} className="text-white" />
      </div>

      {/* Main content */}
      <div className="flex flex-col min-w-0 flex-1">
        {/* Top row: symbol + direction badge */}
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-semibold text-tg-text truncate">
            {symbolLabel(signal.symbol)}
          </span>
          <Badge variant={directionVariant}>{formatDirection(signal.direction)}</Badge>
        </div>

        {/* Price row */}
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[12px] text-tg-hint">
            Entry {formatCryptoPrice(signal.entry_price)}
          </span>
          <span className="text-[12px] text-tg-hint">
            SL {formatCryptoPrice(signal.stop_loss)}
          </span>
          <span className="text-[12px] text-tg-hint">
            TP {formatCryptoPrice(signal.take_profit)}
          </span>
        </div>

        {/* Bottom row: current price or win rate + time */}
        <div className="flex items-center gap-3 mt-1">
          {hasCurrentPrice ? (
            <span className="text-[11px] text-tg-accent font-medium">
              Now {formatCryptoPrice(signal.current_price)}
            </span>
          ) : (
            <span className="text-[11px] text-green font-medium">
              WR {formatWinRate(signal.win_rate)}
            </span>
          )}
          <span className="text-[11px] text-tg-hint/60">
            {formatRelativeTime(signal.created_at)}
          </span>
        </div>
      </div>

      {/* Right side: PnL or status */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {isResolved && pnlPct !== null ? (
          <>
            <span
              className={`text-[15px] font-mono font-bold ${pnlColorClass(pnlPct)}`}
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatPct(pnlPct).text}
            </span>
            <SignalStatusBadge status={signal.status} />
          </>
        ) : (
          <>
            <SignalStatusBadge status={signal.status} />
            <ChevronRight size={16} className="text-tg-hint/40" />
          </>
        )}
      </div>
    </button>
  );
}
