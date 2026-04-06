import { formatCryptoPrice } from '../../utils/formatters';

/*
  Schematic signal chart showing price levels and event timeline.

  Layout (Long example):

  TP ─────────────────────── green label
       line development
  Entry ─────────────────── neutral label
       line development
  SL ─────────────────────── red label

  Fixed scale — distances between levels are always equal.
  Lines: solid = happened, dashed = future/didn't happen.
*/

const H = 180;       // total height
const W_PCT = 100;   // width in %
const PAD_L = 80;    // left padding for labels
const PAD_R = 16;    // right padding
const PAD_T = 24;    // top padding
const PAD_B = 24;    // bottom padding
const CHART_H = H - PAD_T - PAD_B;

// Y positions (fixed, evenly spaced)
const Y_TOP = PAD_T;
const Y_MID = PAD_T + CHART_H / 2;
const Y_BOT = PAD_T + CHART_H;

export default function SignalChart({ signal }) {
  const isLong = signal.direction === 'LONG';
  const status = signal.status;

  // For Long: top=TP, mid=Entry, bot=SL
  // For Short: top=SL, mid=Entry, bot=TP
  const yTP = isLong ? Y_TOP : Y_BOT;
  const yEntry = Y_MID;
  const ySL = isLong ? Y_BOT : Y_TOP;

  // Current price Y position (between entry and TP/SL based on actual values)
  const currentPrice = signal.current_price || signal.entry_price;
  let yCurrent = Y_MID;
  if (status === 'TRIGGERED' || status === 'PENDING' || status === 'ACTIVE' || status === 'UPDATED') {
    // Map current between entry and TP/SL
    if (isLong) {
      if (currentPrice >= signal.entry_price) {
        const pct = Math.min((currentPrice - signal.entry_price) / (signal.take_profit - signal.entry_price), 1);
        yCurrent = yEntry - pct * (yEntry - yTP);
      } else {
        const pct = Math.min((signal.entry_price - currentPrice) / (signal.entry_price - signal.stop_loss), 1);
        yCurrent = yEntry + pct * (ySL - yEntry);
      }
    } else {
      if (currentPrice <= signal.entry_price) {
        const pct = Math.min((signal.entry_price - currentPrice) / (signal.entry_price - signal.take_profit), 1);
        yCurrent = yEntry + pct * (yTP - yEntry);
      } else {
        const pct = Math.min((currentPrice - signal.entry_price) / (signal.stop_loss - signal.entry_price), 1);
        yCurrent = yEntry - pct * (yEntry - ySL);
      }
    }
  }

  // Timeline X positions
  const xStart = PAD_L;
  const xEnd = 360;
  const xEntry = xStart + (xEnd - xStart) * 0.3;
  const xCurrent = xStart + (xEnd - xStart) * 0.6;
  const xResult = xEnd;

  const isPending = status === 'PENDING' || status === 'ACTIVE' || status === 'UPDATED';
  const isTriggered = status === 'TRIGGERED';
  const isHitTP = status === 'HIT_TP';
  const isHitSL = status === 'HIT_SL';
  const isExpired = status === 'EXPIRED';
  const showCurrent = isPending || isTriggered;

  const green = '#059669';
  const red = '#dc2626';
  const hint = 'var(--tg-theme-hint-color, #999)';
  const text = 'var(--tg-theme-text-color, #1a1a1a)';
  const muted = 'rgba(128,128,128,0.25)';

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '16px' }}>
      <svg viewBox={`0 0 400 ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <pattern id="dash" patternUnits="userSpaceOnUse" width="8" height="1">
            <line x1="0" y1="0" x2="4" y2="0" stroke="currentColor" strokeWidth="1.5" />
          </pattern>
        </defs>

        {/* Background zones */}
        <rect x={PAD_L} y={isLong ? Y_TOP : Y_MID} width={xEnd - PAD_L} height={CHART_H / 2}
          fill={green} opacity="0.04" />
        <rect x={PAD_L} y={isLong ? Y_MID : Y_TOP} width={xEnd - PAD_L} height={CHART_H / 2}
          fill={red} opacity="0.04" />

        {/* Horizontal level lines */}
        <line x1={PAD_L} y1={yTP} x2={xEnd} y2={yTP} stroke={green} strokeWidth="1" opacity={isExpired ? 0.2 : 0.4} />
        <line x1={PAD_L} y1={yEntry} x2={xEnd} y2={yEntry} stroke={text} strokeWidth="1" opacity={isExpired ? 0.15 : 0.25} />
        <line x1={PAD_L} y1={ySL} x2={xEnd} y2={ySL} stroke={red} strokeWidth="1" opacity={isExpired ? 0.2 : 0.4} />

        {/* Level labels (left side) */}
        <text x={PAD_L - 8} y={yTP + 1} textAnchor="end" fill={green} fontSize="10" fontFamily="DM Mono, monospace" opacity={isExpired ? 0.3 : 0.8} dominantBaseline="middle">
          {formatCryptoPrice(signal.take_profit)}
        </text>
        <text x={PAD_L - 8} y={yTP - 10} textAnchor="end" fill={green} fontSize="8" fontFamily="DM Sans, sans-serif" fontWeight="600" opacity={isExpired ? 0.3 : 0.6} dominantBaseline="middle">
          TP
        </text>

        <text x={PAD_L - 8} y={yEntry + 1} textAnchor="end" fill={text} fontSize="10" fontFamily="DM Mono, monospace" opacity={isExpired ? 0.3 : 0.8} dominantBaseline="middle">
          {formatCryptoPrice(signal.entry_price)}
        </text>
        <text x={PAD_L - 8} y={yEntry - 10} textAnchor="end" fill={hint} fontSize="8" fontFamily="DM Sans, sans-serif" fontWeight="600" opacity={isExpired ? 0.3 : 0.6} dominantBaseline="middle">
          ENTRY
        </text>

        <text x={PAD_L - 8} y={ySL + 1} textAnchor="end" fill={red} fontSize="10" fontFamily="DM Mono, monospace" opacity={isExpired ? 0.3 : 0.8} dominantBaseline="middle">
          {formatCryptoPrice(signal.stop_loss)}
        </text>
        <text x={PAD_L - 8} y={ySL - 10} textAnchor="end" fill={red} fontSize="8" fontFamily="DM Sans, sans-serif" fontWeight="600" opacity={isExpired ? 0.3 : 0.6} dominantBaseline="middle">
          SL
        </text>

        {/* ═══ Event lines ═══ */}

        {isPending && (
          <>
            {/* Solid: start → current */}
            <line x1={xStart} y1={yCurrent} x2={xCurrent} y2={yCurrent} stroke={text} strokeWidth="2" />
            {/* Current dot */}
            <circle cx={xCurrent} cy={yCurrent} r="4" fill={text} />
            <circle cx={xCurrent} cy={yCurrent} r="7" fill={text} opacity="0.15" className="live-dot" />
            {/* Dashed: current → entry */}
            <line x1={xCurrent} y1={yCurrent} x2={xEntry + 40} y2={yEntry} stroke={hint} strokeWidth="1.5" strokeDasharray="4 3" />
            {/* Dashed fork: entry → TP */}
            <line x1={xEntry + 40} y1={yEntry} x2={xResult} y2={yTP} stroke={green} strokeWidth="1.5" strokeDasharray="4 3" />
            {/* Dashed fork: entry → SL */}
            <line x1={xEntry + 40} y1={yEntry} x2={xResult} y2={ySL} stroke={red} strokeWidth="1.5" strokeDasharray="4 3" />
            {/* Entry marker */}
            <circle cx={xEntry + 40} cy={yEntry} r="3" fill="none" stroke={hint} strokeWidth="1.5" />
          </>
        )}

        {isTriggered && (
          <>
            {/* Solid: start → entry */}
            <line x1={xStart} y1={yEntry + 15} x2={xEntry} y2={yEntry} stroke={text} strokeWidth="2" />
            {/* Entry marker */}
            <circle cx={xEntry} cy={yEntry} r="3.5" fill={text} />
            {/* Solid: entry → current */}
            <line x1={xEntry} y1={yEntry} x2={xCurrent} y2={yCurrent} stroke={text} strokeWidth="2" />
            {/* Current dot (pulsing) */}
            <circle cx={xCurrent} cy={yCurrent} r="4.5" fill={isLong ? (currentPrice >= signal.entry_price ? green : red) : (currentPrice <= signal.entry_price ? green : red)} />
            <circle cx={xCurrent} cy={yCurrent} r="8" fill={isLong ? (currentPrice >= signal.entry_price ? green : red) : (currentPrice <= signal.entry_price ? green : red)} opacity="0.15" className="live-dot" />
            {/* Dashed: current → TP */}
            <line x1={xCurrent} y1={yCurrent} x2={xResult} y2={yTP} stroke={green} strokeWidth="1.5" strokeDasharray="4 3" />
            {/* Dashed: current → SL */}
            <line x1={xCurrent} y1={yCurrent} x2={xResult} y2={ySL} stroke={red} strokeWidth="1.5" strokeDasharray="4 3" />
          </>
        )}

        {isHitTP && (
          <>
            {/* Solid: start → entry */}
            <line x1={xStart} y1={yEntry + 15} x2={xEntry} y2={yEntry} stroke={text} strokeWidth="2" />
            <circle cx={xEntry} cy={yEntry} r="3" fill={text} />
            {/* Solid: entry → TP */}
            <line x1={xEntry} y1={yEntry} x2={xResult} y2={yTP} stroke={green} strokeWidth="2.5" />
            <circle cx={xResult} cy={yTP} r="5" fill={green} />
            {/* Dashed: entry → SL (didn't happen) */}
            <line x1={xEntry} y1={yEntry} x2={xResult} y2={ySL} stroke={red} strokeWidth="1" strokeDasharray="4 3" opacity="0.3" />
          </>
        )}

        {isHitSL && (
          <>
            {/* Solid: start → entry */}
            <line x1={xStart} y1={yEntry - 15} x2={xEntry} y2={yEntry} stroke={text} strokeWidth="2" />
            <circle cx={xEntry} cy={yEntry} r="3" fill={text} />
            {/* Solid: entry → SL */}
            <line x1={xEntry} y1={yEntry} x2={xResult} y2={ySL} stroke={red} strokeWidth="2.5" />
            <circle cx={xResult} cy={ySL} r="5" fill={red} />
            {/* Dashed: entry → TP (didn't happen) */}
            <line x1={xEntry} y1={yEntry} x2={xResult} y2={yTP} stroke={green} strokeWidth="1" strokeDasharray="4 3" opacity="0.3" />
          </>
        )}

        {isExpired && (
          <>
            {/* Muted horizontal line */}
            <line x1={xStart} y1={yEntry} x2={xResult} y2={yEntry} stroke={hint} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" />
            <circle cx={xResult} cy={yEntry} r="4" fill="none" stroke={hint} strokeWidth="1.5" opacity="0.3" />
            <text x={xResult - 40} y={yEntry - 12} fill={hint} fontSize="9" fontFamily="DM Sans, sans-serif" opacity="0.4" textAnchor="middle">
              expired
            </text>
          </>
        )}

        {/* Current price label (for pending/triggered) */}
        {showCurrent && (
          <text x={xCurrent + 8} y={yCurrent - 8} fill={text} fontSize="9" fontFamily="DM Mono, monospace" fontWeight="700" opacity="0.7">
            {formatCryptoPrice(currentPrice)}
          </text>
        )}
      </svg>
    </div>
  );
}
