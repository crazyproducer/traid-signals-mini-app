import { formatPnlUsd, formatPct, pnlColorClass } from '../../utils/formatters';

export default function PnlValue({ value, type = 'usd', className = '' }) {
  const formatted = type === 'pct' ? formatPct(value) : formatPnlUsd(value);
  const colorClass = pnlColorClass(value);
  return (
    <span
      className={`font-mono font-semibold ${colorClass} ${className}`}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {formatted.text}
    </span>
  );
}
