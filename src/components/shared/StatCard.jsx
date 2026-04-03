export default function StatCard({ label, value, sublabel, colorClass }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-tg-hint">{label}</span>
      <span
        className={`text-[22px] font-bold font-mono ${colorClass || 'text-tg-text'}`}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {value}
      </span>
      {sublabel && (
        <span className="text-[11px] text-tg-hint">{sublabel}</span>
      )}
    </div>
  );
}
