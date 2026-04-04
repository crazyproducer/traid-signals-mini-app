const GRADIENT_MAP = {
  green: 'icon-gradient-green',
  red: 'icon-gradient-red',
  blue: 'icon-gradient-blue',
  violet: 'icon-gradient-violet',
  yellow: 'icon-gradient-yellow',
  neutral: 'icon-gradient-neutral',
};

function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

export default function OptionCard({ icon: Icon, title, description, count, selected, onClick, color = 'blue' }) {
  const gradientClass = GRADIENT_MAP[color] || GRADIENT_MAP.blue;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`pressable w-full text-left rounded-2xl p-4 flex items-center gap-3.5 transition-all duration-200 ${
        selected
          ? 'option-selected'
          : 'card-premium-sm'
      }`}
    >
      {/* Gradient icon */}
      <div
        className={`${gradientClass} w-10 h-10 rounded-[14px] flex items-center justify-center flex-shrink-0`}
      >
        <Icon size={20} strokeWidth={2} className="text-white" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-[15px] font-semibold text-tg-text leading-tight">
            {title}
          </span>
          {count != null && (
            <span className="text-[11px] font-mono text-tg-hint/50" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {formatCount(count)}
            </span>
          )}
        </div>
        {description && (
          <span className="text-[12px] text-tg-hint leading-snug mt-0.5 block">
            {description}
          </span>
        )}
      </div>

      {/* Selection indicator */}
      <div className="flex-shrink-0 ml-1">
        <div
          className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            selected
              ? 'border-tg-button bg-tg-button'
              : 'border-tg-hint/25'
          }`}
        >
          {selected && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="text-tg-button-text">
              <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}
