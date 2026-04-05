import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Skeleton from '../shared/Skeleton';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2">
      <p className="text-[11px] text-tg-hint">{label}</p>
      <p className="text-[14px] font-mono font-bold text-green" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {payload[0].value >= 0 ? '+' : ''}{payload[0].value.toFixed(2)}%
      </p>
    </div>
  );
}

export default function PerformanceChart({ data, loading }) {
  if (loading) {
    return <Skeleton className="w-full" style={{ height: 200 }} />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-[13px] text-tg-hint">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full chart-reveal outline-none" style={{ height: 200 }} tabIndex={-1}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'var(--tg-theme-hint-color, #999)' }}
            tickFormatter={(v) => {
              const d = new Date(v);
              return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }}
            interval="preserveStartEnd"
            minTickGap={40}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'var(--tg-theme-hint-color, #999)' }}
            tickFormatter={(v) => v + '%'}
            width={32}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="cumulative_pct"
            stroke="#059669"
            strokeWidth={2}
            fill="url(#equityGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#059669', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
