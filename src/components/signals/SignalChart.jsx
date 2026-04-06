import { LineChart, Line, ReferenceLine, ReferenceDot, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { formatCryptoPrice } from '../../utils/formatters';

export default function SignalChart({ signal }) {
  const isLong = signal.direction === 'LONG';
  const status = signal.status;

  const isPending = status === 'PENDING' || status === 'ACTIVE' || status === 'UPDATED';
  const isTriggered = status === 'TRIGGERED';
  const isHitTP = status === 'HIT_TP';
  const isHitSL = status === 'HIT_SL';
  const isExpired = status === 'EXPIRED';

  const entry = signal.entry_price;
  const tp = signal.take_profit;
  const sl = signal.stop_loss;
  const current = signal.current_price || entry;

  // Start price: midpoint between TP and Entry
  const startPrice = (tp + entry) / 2;

  // Build data points: x=0 start, x=1 midpoint, x=2 entry, x=3 mid-fork, x=4 endpoints
  let data;

  if (isPending) {
    // solid from start to current, dashed from current to entry
    const midPrice = (startPrice + entry) / 2;
    data = [
      { x: 0, price: startPrice, price_dash: null, tp_path: null, sl_path: null },
      { x: 1, price: midPrice, price_dash: midPrice, tp_path: null, sl_path: null },
      { x: 2, price: null, price_dash: entry, tp_path: entry, sl_path: entry },
      { x: 3, price: null, price_dash: null, tp_path: tp, sl_path: sl },
    ];
  } else if (isTriggered) {
    // Current is in profit or loss — dot on the active branch
    const inProfit = isLong ? current >= entry : current <= entry;
    const midTP = (entry + tp) / 2;
    const midSL = (entry + sl) / 2;
    // tp_solid/sl_solid = solid segment from entry to dot
    // tp_path/sl_path = dashed segment from dot to endpoint
    data = [
      { x: 0, price: startPrice, tp_solid: null, sl_solid: null, tp_path: null, sl_path: null },
      { x: 1, price: entry, tp_solid: entry, sl_solid: entry, tp_path: null, sl_path: null },
      { x: 1.5, price: null, tp_solid: inProfit ? midTP : null, sl_solid: inProfit ? null : midSL, tp_path: inProfit ? midTP : null, sl_path: inProfit ? null : midSL },
      { x: 2, price: null, tp_solid: null, sl_solid: null, tp_path: tp, sl_path: sl },
    ];
  } else if (isHitTP || isHitSL) {
    data = [
      { x: 0, price: startPrice, tp_solid: null, sl_solid: null, tp_path: null, sl_path: null },
      { x: 1, price: entry, tp_solid: entry, sl_solid: entry, tp_path: null, sl_path: null },
      { x: 2, price: null, tp_solid: isHitTP ? tp : null, sl_solid: isHitSL ? sl : null, tp_path: isHitTP ? null : tp, sl_path: isHitSL ? null : sl },
    ];
  } else {
    // Expired
    data = [
      { x: 0, price: startPrice, tp_path: null, sl_path: null },
      { x: 1, price: entry, tp_path: null, sl_path: null },
    ];
  }

  // Y domain: include all price levels with padding
  const allPrices = [entry, tp, sl, startPrice, current];
  const minY = Math.min(...allPrices);
  const maxY = Math.max(...allPrices);
  const padding = (maxY - minY) * 0.1;

  // Current dot position (adjusted for new x coords)
  let dotX, dotY;
  if (isPending) {
    dotX = 1;
    dotY = (startPrice + entry) / 2;
  } else if (isTriggered) {
    const inProfit = isLong ? current >= entry : current <= entry;
    dotX = 1.5;
    dotY = inProfit ? (entry + tp) / 2 : (entry + sl) / 2;
  } else if (isHitTP) {
    dotX = 2;
    dotY = tp;
  } else if (isHitSL) {
    dotX = 2;
    dotY = sl;
  }

  // Line styles per status
  const priceStroke = isExpired ? 'rgba(128,128,128,0.3)' : 'var(--tg-theme-text-color, #1a1a1a)';
  const priceWidth = 2;
  const tpStroke = '#059669';
  const slStroke = '#dc2626';
  const tpWidth = isHitTP ? 2.5 : 1.5;
  const slWidth = isHitSL ? 2.5 : 1.5;
  const tpDash = isHitTP ? '0' : '5 4';
  const slDash = isHitSL ? '0' : '5 4';
  const tpOpacity = isHitSL ? 0.2 : (isExpired ? 0 : 1);
  const slOpacity = isHitTP ? 0.2 : (isExpired ? 0 : 1);

  const dotColor = isHitSL ? '#dc2626' : isHitTP ? '#059669' : 'var(--tg-theme-text-color, #1a1a1a)';

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%" minHeight={160}>
        <LineChart data={data} margin={{ top: 16, right: 8, bottom: 8, left: 8 }}>
          <XAxis dataKey="x" hide />
          <YAxis
            domain={[minY - padding, maxY + padding]}
            orientation="right"
            axisLine={false}
            tickLine={false}
            ticks={[sl, entry, tp]}
            tick={{ fontSize: 10, fontFamily: 'DM Mono, monospace', fontWeight: 600, fill: 'var(--tg-theme-hint-color, #999)' }}
            tickFormatter={(v) => formatCryptoPrice(v)}
            width={75}
          />

          {/* Reference lines for price levels */}
          <ReferenceLine
            y={tp}
            stroke={tpStroke}
            strokeWidth={0.5}
            strokeOpacity={isExpired ? 0.15 : 0.3}
            label={{ value: 'TP', position: 'insideTopLeft', fill: tpStroke, fontSize: 9, fontFamily: 'DM Sans', fontWeight: 700, opacity: isExpired ? 0.3 : 0.6 }}
          />
          <ReferenceLine
            y={entry}
            stroke="var(--tg-theme-hint-color, #999)"
            strokeWidth={0.5}
            strokeOpacity={isExpired ? 0.15 : 0.2}
            label={{ value: 'ENTRY', position: 'insideTopLeft', fill: 'var(--tg-theme-hint-color, #999)', fontSize: 9, fontFamily: 'DM Sans', fontWeight: 700, opacity: isExpired ? 0.3 : 0.5 }}
          />
          <ReferenceLine
            y={sl}
            stroke={slStroke}
            strokeWidth={0.5}
            strokeOpacity={isExpired ? 0.15 : 0.3}
            label={{ value: 'SL', position: 'insideBottomLeft', fill: slStroke, fontSize: 9, fontFamily: 'DM Sans', fontWeight: 700, opacity: isExpired ? 0.3 : 0.6 }}
          />

          {/* Main price line: solid segment */}
          <Line
            type="linear"
            dataKey="price"
            stroke={priceStroke}
            strokeWidth={priceWidth}
            dot={false}
            connectNulls={false}
            strokeDasharray={isExpired ? '5 4' : '0'}
            animationDuration={isPending ? 300 : 600}
            animationBegin={0}
            animationEasing="ease-out"
          />

          {/* Dashed price line: current → entry (pending only) */}
          {isPending && (
            <Line
              type="linear"
              dataKey="price_dash"
              stroke={priceStroke}
              strokeWidth={priceWidth}
              dot={false}
              connectNulls={false}
              strokeDasharray="5 4"
              strokeOpacity={0.5}
              animationDuration={300}
              animationBegin={300}
              animationEasing="ease-out"
            />
          )}

          {/* TP solid: entry → dot (triggered/hit) */}
          {(isTriggered || isHitTP || isHitSL) && (
            <Line
              type="linear"
              dataKey="tp_solid"
              stroke={tpStroke}
              strokeWidth={isHitTP ? 2.5 : 2}
              strokeOpacity={isHitSL ? 0.2 : 1}
              dot={false}
              connectNulls={false}
              animationDuration={400}
              animationBegin={600}
              animationEasing="ease-out"
            />
          )}

          {/* SL solid: entry → dot (triggered/hit) */}
          {(isTriggered || isHitTP || isHitSL) && (
            <Line
              type="linear"
              dataKey="sl_solid"
              stroke={slStroke}
              strokeWidth={isHitSL ? 2.5 : 2}
              strokeOpacity={isHitTP ? 0.2 : 1}
              dot={false}
              connectNulls={false}
              animationDuration={400}
              animationBegin={600}
              animationEasing="ease-out"
            />
          )}

          {/* TP dashed: dot → TP (pending/triggered) or faded (hit) */}
          {!isExpired && (
            <Line
              type="linear"
              dataKey="tp_path"
              stroke={tpStroke}
              strokeWidth={1.5}
              strokeDasharray="5 4"
              strokeOpacity={isHitSL ? 0.15 : (isHitTP ? 0 : 0.5)}
              dot={false}
              connectNulls={false}
              animationDuration={400}
              animationBegin={isPending ? 600 : 800}
              animationEasing="ease-out"
            />
          )}

          {/* SL dashed: dot → SL (pending/triggered) or faded (hit) */}
          {!isExpired && (
            <Line
              type="linear"
              dataKey="sl_path"
              stroke={slStroke}
              strokeWidth={1.5}
              strokeDasharray="5 4"
              strokeOpacity={isHitTP ? 0.15 : (isHitSL ? 0 : 0.5)}
              dot={false}
              connectNulls={false}
              animationDuration={400}
              animationBegin={isPending ? 600 : 800}
              animationEasing="ease-out"
            />
          )}

          {/* Current price dot */}
          {dotX != null && dotY != null && (
            <ReferenceDot
              x={dotX}
              y={dotY}
              r={5}
              fill={dotColor}
              stroke="var(--tg-theme-bg-color, #fff)"
              strokeWidth={2}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
