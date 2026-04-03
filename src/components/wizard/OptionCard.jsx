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
          ? 'option-selected scale-[1.01]'
          : 'card-premium-sm border-2 border-transparent'
      }`}
    >
      {/* Gradient icon circle */}
      <div
        className={`${gradientClass} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}
      >
        <Icon size={20} strokeWidth={2} className="text-white" />
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <span className="text-[15px] font-semibold text-tg-text leading-tight block">
          {title}
        </span>
        {description && (
          <span className="text-[12px] text-tg-hint leading-snug mt-0.5 block">
            {description}
          </span>
        )}
      </div>

      {/* Right side: count + selection indicator */}
      <div className="flex items-center gap-2.5 flex-shrink-0 ml-1">
        {count != null && (
          <span className="text-[11px] font-mono text-tg-hint/60 tabular-nums">
            {formatCount(count)}
          </span>
        )}
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            selected
              ? 'border-tg-button bg-tg-button'
              : 'border-tg-hint/30 bg-transparent'
          }`}
        >
          {selected && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="text-tg-button-text">
              <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}
