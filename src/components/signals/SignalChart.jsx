import { formatCryptoPrice } from '../../utils/formatters';

const H = 180;
const PAD_L = 16;
const PAD_R = 120;
const PAD_T = 24;
const PAD_B = 24;
const CHART_H = H - PAD_T - PAD_B;

export default function SignalChart({ signal }) {
  const isLong = signal.direction === 'LONG';
  const status = signal.status;

  // Y levels: Long → TP top, Entry 70%, SL bottom. Short → SL top, Entry 30%, TP bottom.
  const yTP = isLong ? PAD_T : PAD_T + CHART_H;
  const yEntry = PAD_T + CHART_H * (isLong ? 0.7 : 0.3);
  const ySL = isLong ? PAD_T + CHART_H : PAD_T;
  const yStart = isLong ? yEntry - CHART_H * 0.15 : yEntry + CHART_H * 0.15;

  // X positions: 3 key points on timeline
  const chartW = 400 - PAD_L - PAD_R - 8;
  const x0 = PAD_L;             // point 0 — start
  const x1 = PAD_L + chartW * 0.35; // point 1 — entry at 35%
  const x2 = 480 - PAD_R - 8;  // point 2 — TP/SL endpoints
  const xLabel = 480 - PAD_R + 8; // labels right of chart

  const isPending = status === 'PENDING' || status === 'ACTIVE' || status === 'UPDATED';
  const isTriggered = status === 'TRIGGERED';
  const isHitTP = status === 'HIT_TP';
  const isHitSL = status === 'HIT_SL';
  const isExpired = status === 'EXPIRED';

  // Current price dot position
  let dotX, dotY;
  if (isPending) {
    // Midpoint of segment 0→1
    dotX = (x0 + x1) / 2;
    dotY = (yStart + yEntry) / 2;
  } else if (isTriggered) {
    // Midpoint of segment 1→2a or 1→2b depending on current price vs entry
    const currentPrice = signal.current_price || signal.entry_price;
    const inProfit = isLong ? currentPrice >= signal.entry_price : currentPrice <= signal.entry_price;
    const targetY = inProfit ? yTP : ySL;
    dotX = (x1 + x2) / 2;
    dotY = (yEntry + targetY) / 2;
  } else if (isHitTP) {
    dotX = x2;
    dotY = yTP;
  } else if (isHitSL) {
    dotX = x2;
    dotY = ySL;
  }

  const green = '#059669';
  const red = '#dc2626';
  const hint = 'var(--tg-theme-hint-color, #999)';
  const text = 'var(--tg-theme-text-color, #1a1a1a)';

  const showDot = !isExpired;
  const dotColor = isHitSL ? red : isHitTP ? green : text;
  const muted = isExpired ? 0.2 : 1;

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden', height: '100%' }}>
      <svg viewBox={`0 0 480 ${H}`} style={{ width: '100%', height: '100%', display: 'block' }}>

        {/* Background zones: green between entry and TP, red between entry and SL */}
        {/* Green zone (profit) */}
        <rect x={PAD_L} y={Math.min(yEntry, yTP)} width={x2 + 8 - PAD_L} height={Math.abs(yEntry - yTP)}
          fill={green} opacity="0.04" />
        {/* Red zone (risk) */}
        <rect x={PAD_L} y={Math.min(yEntry, ySL)} width={x2 + 8 - PAD_L} height={Math.abs(yEntry - ySL)}
          fill={red} opacity="0.04" />

        {/* Horizontal level lines */}
        <line x1={PAD_L} y1={yTP} x2={x2 + 8} y2={yTP} stroke={green} strokeWidth="1" opacity={0.4 * muted} />
        <line x1={PAD_L} y1={yEntry} x2={x2 + 8} y2={yEntry} stroke={text} strokeWidth="1" opacity={0.2 * muted} />
        <line x1={PAD_L} y1={ySL} x2={x2 + 8} y2={ySL} stroke={red} strokeWidth="1" opacity={0.4 * muted} />

        {/* Labels — right side, larger */}
        <text x={xLabel} y={yTP - 10} textAnchor="start" fill={green} fontSize="10" fontWeight="700" fontFamily="DM Sans" opacity={0.7 * muted}>TP</text>
        <text x={xLabel} y={yTP + 4} textAnchor="start" fill={green} fontSize="13" fontWeight="600" fontFamily="DM Mono" opacity={0.9 * muted} dominantBaseline="middle">
          {formatCryptoPrice(signal.take_profit)}
        </text>

        <text x={xLabel} y={yEntry - 10} textAnchor="start" fill={hint} fontSize="10" fontWeight="700" fontFamily="DM Sans" opacity={0.7 * muted}>ENTRY</text>
        <text x={xLabel} y={yEntry + 4} textAnchor="start" fill={text} fontSize="13" fontWeight="600" fontFamily="DM Mono" opacity={0.9 * muted} dominantBaseline="middle">
          {formatCryptoPrice(signal.entry_price)}
        </text>

        <text x={xLabel} y={ySL - 10} textAnchor="start" fill={red} fontSize="10" fontWeight="700" fontFamily="DM Sans" opacity={0.7 * muted}>SL</text>
        <text x={xLabel} y={ySL + 4} textAnchor="start" fill={red} fontSize="13" fontWeight="600" fontFamily="DM Mono" opacity={0.9 * muted} dominantBaseline="middle">
          {formatCryptoPrice(signal.stop_loss)}
        </text>

        {/* ═══ Lines ═══ */}

        {/* Segment 0→1: solid line from start to entry */}
        {!isExpired && (
          <>
            {/* Solid if price has passed this segment, otherwise solid up to dot */}
            {isPending ? (
              <>
                <line x1={x0} y1={yStart} x2={dotX} y2={dotY} stroke={text} strokeWidth="2" opacity={muted} />
                <line x1={dotX} y1={dotY} x2={x1} y2={yEntry} stroke={hint} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
              </>
            ) : (
              <line x1={x0} y1={yStart} x2={x1} y2={yEntry} stroke={text} strokeWidth="2" opacity={muted} />
            )}
          </>
        )}

        {/* Entry marker (circle at point 1) */}
        {!isExpired && !isPending && (
          <circle cx={x1} cy={yEntry} r="3" fill={text} opacity={muted} />
        )}
        {isPending && (
          <circle cx={x1} cy={yEntry} r="3" fill="none" stroke={hint} strokeWidth="1.5" opacity="0.4" />
        )}

        {/* Segment 1→2a (TP): green */}
        {!isExpired && (
          isHitTP ? (
            <line x1={x1} y1={yEntry} x2={x2} y2={yTP} stroke={green} strokeWidth="2.5" />
          ) : (
            <line x1={x1} y1={yEntry} x2={x2} y2={yTP} stroke={green} strokeWidth="1.5" strokeDasharray="4 3" opacity={isHitSL ? 0.15 : 0.5} />
          )
        )}

        {/* Segment 1→2b (SL): red */}
        {!isExpired && (
          isHitSL ? (
            <line x1={x1} y1={yEntry} x2={x2} y2={ySL} stroke={red} strokeWidth="2.5" />
          ) : (
            <line x1={x1} y1={yEntry} x2={x2} y2={ySL} stroke={red} strokeWidth="1.5" strokeDasharray="4 3" opacity={isHitTP ? 0.15 : 0.5} />
          )
        )}

        {/* Expired: just a muted dashed line */}
        {isExpired && (
          <>
            <line x1={x0} y1={yStart} x2={x2} y2={yEntry} stroke={hint} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.25" />
            <text x={(x0 + x2) / 2} y={yEntry - 14} fill={hint} fontSize="10" fontFamily="DM Sans" opacity="0.35" textAnchor="middle">
              entry not reached
            </text>
          </>
        )}

        {/* Current price dot */}
        {showDot && dotX && dotY && (
          <>
            <circle cx={dotX} cy={dotY} r="5" fill={dotColor} />
            {(isPending || isTriggered) && (
              <circle cx={dotX} cy={dotY} r="9" fill={dotColor} opacity="0.12" className="live-dot" />
            )}
            {/* Price label */}
            {(isPending || isTriggered) && (
              <text x={dotX} y={dotY - 12} fill={text} fontSize="9" fontFamily="DM Mono" fontWeight="700" opacity="0.7" textAnchor="middle">
                {formatCryptoPrice(signal.current_price || signal.entry_price)}
              </text>
            )}
          </>
        )}

      </svg>
    </div>
  );
}
