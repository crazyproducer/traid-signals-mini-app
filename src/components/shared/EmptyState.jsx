export default function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="w-[72px] h-[72px] rounded-full bg-tg-secondary/40 flex items-center justify-center mb-5">
        <Icon size={32} className="text-tg-hint/60" strokeWidth={1.5} />
      </div>
      <p className="text-[16px] font-semibold text-tg-text mb-1.5">{title}</p>
      {subtitle && (
        <p className="text-[13px] text-tg-hint mb-6 max-w-[240px] leading-relaxed">{subtitle}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="bg-tg-button text-tg-button-text text-[14px] font-semibold rounded-2xl px-6 py-3 pressable shadow-sm"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
