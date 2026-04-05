import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import Badge from '../shared/Badge';
import {
  formatCryptoPrice,
  formatRelativeTime,
  formatDirection,
  formatPct,
  formatWinRate,
  formatDuration,
  pnlColorClass,
} from '../../utils/formatters';
import { SYMBOLS } from '../../utils/constants';

function sym(raw) {
  return SYMBOLS.find((s) => s.value === raw)?.label || raw;
}

function fmtDt(iso) {
  const d = new Date(iso);
  const yy = String(d.getFullYear()).slice(2);
  const mon = d.toLocaleString('en-US', { month: 'short' }).toLowerCase();
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${dd}-${mon}-${d.getFullYear()} ${hh}:${mm}`;
}

/* ═══════════════════════════════════════════════
   NEW card — PENDING / ACTIVE / UPDATED
   Shows: symbol, direction, strategy, entry, risk, reward, win rate, confidence
   ═══════════════════════════════════════════════ */
export function NewSignalCard({ signal, onClick }) {
  const isLong = signal.direction === 'LONG';
  const Icon = isLong ? TrendingUp : TrendingDown;
  const grad = isLong ? 'icon-gradient-green' : 'icon-gradient-red';
  const rrr = signal.risk_pct > 0 ? (signal.reward_pct / signal.risk_pct).toFixed(1) : '--';
  const isUpdated = signal.status === 'UPDATED' || signal.status === 'ACTIVE';

  return (
    <button type="button" onClick={onClick} className="card pressable w-full text-left p-4">
      {/* Row 1: icon + symbol + strategy + timestamps */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`${grad} w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0`}>
          <Icon size={18} strokeWidth={1.8} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-semibold text-tg-text" style={{ letterSpacing: '-0.01em' }}>
              {sym(signal.symbol)}
            </span>
            <span className="text-[12px] text-tg-hint">Pull Back</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-tg-hint/50 font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
            <span>{fmtDt(signal.created_at)}</span>
            {isUpdated && signal.updates?.length > 1 && (
              <>
                <span>·</span>
                <span>upd {fmtDt(signal.updates[signal.updates.length - 1].timestamp)}</span>
              </>
            )}
          </div>
        </div>
        <ChevronRight size={16} className="text-tg-hint/30 flex-shrink-0" />
      </div>

      {/* Row 2: metrics — left aligned */}
      <div className="flex items-center gap-4 pl-[52px]">
        <div>
          <span className="text-[9px] text-tg-hint/60 uppercase leading-none block" style={{ letterSpacing: '0.04em' }}>Entry</span>
          <span className="text-[13px] font-mono font-semibold text-tg-text leading-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatCryptoPrice(signal.entry_price)}
          </span>
        </div>
        <div>
          <span className="text-[9px] text-tg-hint/60 uppercase leading-none block" style={{ letterSpacing: '0.04em' }}>R:R</span>
          <span className="text-[13px] font-mono font-semibold text-tg-text leading-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
            1:{rrr}
          </span>
        </div>
        <div>
          <span className="text-[9px] text-tg-hint/60 uppercase leading-none block" style={{ letterSpacing: '0.04em' }}>WR</span>
          <span className="text-[13px] font-mono font-semibold text-tg-text leading-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatWinRate(signal.win_rate)}
          </span>
        </div>
        <div>
          <span className="text-[9px] text-tg-hint/60 uppercase leading-none block" style={{ letterSpacing: '0.04em' }}>Conf</span>
          <span className="text-[13px] font-mono font-semibold text-tg-text leading-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {signal.confidence ? Math.round(signal.confidence * 100) + '%' : '60%'}
          </span>
        </div>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════
   ACTIVE card — TRIGGERED
   Shows: symbol, direction, strategy, entry, current price, unrealized PnL
   ═══════════════════════════════════════════════ */
export function ActiveSignalCard({ signal, onClick }) {
  const isLong = signal.direction === 'LONG';
  const Icon = isLong ? TrendingUp : TrendingDown;
  const grad = isLong ? 'icon-gradient-green' : 'icon-gradient-red';

  const currentPrice = signal.current_price || signal.entry_price;
  const unrealizedPct = isLong
    ? ((currentPrice - signal.entry_price) / signal.entry_price) * 100
    : ((signal.entry_price - currentPrice) / signal.entry_price) * 100;

  return (
    <button type="button" onClick={onClick} className="card pressable w-full text-left p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`${grad} w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0`}>
          <Icon size={18} strokeWidth={1.8} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-semibold text-tg-text" style={{ letterSpacing: '-0.01em' }}>
              {sym(signal.symbol)}
            </span>
            <span className="text-[12px] text-tg-hint">Pull Back</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-tg-hint/50 font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
            <span>{fmtDt(signal.created_at)}</span>
            {signal.triggered_at && (
              <><span>·</span><span>trig {fmtDt(signal.triggered_at)}</span></>
            )}
          </div>
        </div>
        <ChevronRight size={16} className="text-tg-hint/30 flex-shrink-0" />
      </div>

      <div className="grid grid-cols-3 gap-1.5 text-center">
        <div>
          <span className="text-[9px] text-tg-hint/60 uppercase leading-none" style={{ letterSpacing: '0.04em' }}>Entry</span>
          <span className="text-[13px] font-mono font-semibold text-tg-text block leading-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatCryptoPrice(signal.entry_price)}
          </span>
        </div>
        <div>
          <span className="text-[9px] text-tg-hint/60 uppercase leading-none" style={{ letterSpacing: '0.04em' }}>Current</span>
          <span className="text-[13px] font-mono font-semibold text-tg-text block leading-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatCryptoPrice(currentPrice)}
          </span>
        </div>
        <div>
          <span className="text-[9px] text-tg-hint/60 uppercase leading-none" style={{ letterSpacing: '0.04em' }}>P&L</span>
          <span
            className={`text-[14px] font-mono font-bold block leading-tight ${pnlColorClass(unrealizedPct)}`}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {formatPct(unrealizedPct).text}
          </span>
        </div>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════
   HISTORY card — HIT_TP / HIT_SL
   Shows: symbol, direction, strategy, entry, result, PnL %, duration
   ═══════════════════════════════════════════════ */
export function HistorySignalCard({ signal, onClick }) {
  const isLong = signal.direction === 'LONG';
  const Icon = isLong ? TrendingUp : TrendingDown;
  const isWin = signal.result === 'WIN';
  const grad = isWin ? 'icon-gradient-green' : 'icon-gradient-red';

  const pnlPct = isWin ? signal.reward_pct : -signal.risk_pct;
  const duration = signal.triggered_at && signal.resolved_at
    ? Math.floor((new Date(signal.resolved_at) - new Date(signal.triggered_at)) / 1000)
    : null;

  return (
    <button type="button" onClick={onClick} className="card pressable w-full text-left p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`${grad} w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0`}>
          <Icon size={18} strokeWidth={1.8} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-semibold text-tg-text" style={{ letterSpacing: '-0.01em' }}>
              {sym(signal.symbol)}
            </span>
            <span className="text-[12px] text-tg-hint">Pull Back</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-tg-hint/50 font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
            <span>{fmtDt(signal.created_at)}</span>
            {signal.resolved_at && (
              <><span>·</span><span>closed {fmtDt(signal.resolved_at)}</span></>
            )}
          </div>
        </div>
        <span
          className={`text-[20px] font-mono font-bold flex-shrink-0 ${pnlColorClass(pnlPct)}`}
          style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}
        >
          {formatPct(pnlPct).text}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1.5 text-center">
        <div>
          <span className="text-[9px] text-tg-hint/60 uppercase leading-none" style={{ letterSpacing: '0.04em' }}>Entry</span>
          <span className="text-[13px] font-mono font-semibold text-tg-text block leading-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatCryptoPrice(signal.entry_price)}
          </span>
        </div>
        <div>
          <span className="text-[9px] text-tg-hint/60 uppercase leading-none" style={{ letterSpacing: '0.04em' }}>Result</span>
          <span className="block leading-tight"><Badge variant={isWin ? 'win' : 'loss'}>{isWin ? 'Win' : 'Loss'}</Badge></span>
        </div>
        <div>
          <span className="text-[9px] text-tg-hint/60 uppercase leading-none" style={{ letterSpacing: '0.04em' }}>Duration</span>
          <span className="text-[13px] font-mono font-semibold text-tg-text block leading-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {duration ? formatDuration(duration) : '--'}
          </span>
        </div>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════
   EXPIRED card
   Shows: symbol, direction, strategy, entry, reason
   ═══════════════════════════════════════════════ */
export function ExpiredSignalCard({ signal, onClick }) {
  const isLong = signal.direction === 'LONG';
  const Icon = isLong ? TrendingUp : TrendingDown;

  return (
    <button type="button" onClick={onClick} className="card pressable w-full text-left p-4 opacity-70">
      <div className="flex items-center gap-3">
        <div className="icon-gradient-neutral w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0">
          <Icon size={18} strokeWidth={1.8} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-semibold text-tg-text" style={{ letterSpacing: '-0.01em' }}>
              {sym(signal.symbol)}
            </span>
            <span className="text-[12px] text-tg-hint">Pull Back</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-tg-hint/50 font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
            <span>{fmtDt(signal.created_at)}</span>
            {signal.resolved_at && (
              <><span>·</span><span>exp {fmtDt(signal.resolved_at)}</span></>
            )}
          </div>
        </div>
        <span className="text-[12px] text-tg-hint/40 flex-shrink-0">
          Entry {formatCryptoPrice(signal.entry_price)}
        </span>
      </div>
    </button>
  );
}

/* Default export for backward compat */
export default function SignalCard({ signal, subscription, onClick }) {
  const status = signal.status;
  if (status === 'PENDING' || status === 'ACTIVE' || status === 'UPDATED') {
    return <NewSignalCard signal={signal} onClick={onClick} />;
  }
  if (status === 'TRIGGERED') {
    return <ActiveSignalCard signal={signal} onClick={onClick} />;
  }
  if (status === 'EXPIRED') {
    return <ExpiredSignalCard signal={signal} onClick={onClick} />;
  }
  return <HistorySignalCard signal={signal} onClick={onClick} />;
}
