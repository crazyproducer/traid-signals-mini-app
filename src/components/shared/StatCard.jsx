export default function StatCard({ label, value, sublabel, colorClass }) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] uppercase font-medium text-tg-hint" style={{ letterSpacing: '0.06em' }}>
        {label}
      </span>
      <span
        className={`text-[24px] font-bold font-mono ${colorClass || 'text-tg-text'}`}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {value}
      </span>
      {sublabel && (
        <span className="text-[12px] text-tg-hint">{sublabel}</span>
      )}
    </div>
  );
}
