import { Check } from 'lucide-react';

const GRADIENT_MAP = {
  green: 'icon-gradient-green',
  red: 'icon-gradient-red',
  blue: 'icon-gradient-blue',
  violet: 'icon-gradient-violet',
  yellow: 'icon-gradient-yellow',
  neutral: 'icon-gradient-neutral',
};

function fmtCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

export default function OptionCard({ icon: Icon, title, description, count, selected, onClick, color = 'blue' }) {
  const grad = GRADIENT_MAP[color] || GRADIENT_MAP.blue;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`pressable w-full text-left rounded-[20px] p-4 flex items-center gap-4 transition-all duration-250 ${
        selected ? 'option-selected' : 'option-unselected'
      }`}
    >
      {/* Icon — squircle with colored glow */}
      <div className={`${grad} w-12 h-12 rounded-[15px] flex items-center justify-center flex-shrink-0`}>
        <Icon size={22} strokeWidth={1.8} className="text-white" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2.5">
          <span className="text-[16px] font-semibold text-tg-text leading-tight" style={{ letterSpacing: '-0.01em' }}>
            {title}
          </span>
          {count != null && (
            <span className="text-[11px] font-mono text-tg-hint/40" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {fmtCount(count)} rec
            </span>
          )}
        </div>
        {description && (
          <span className="text-[13px] text-tg-hint leading-snug mt-1 block">
            {description}
          </span>
        )}
      </div>

      {/* Check indicator — large, confident */}
      <div className="flex-shrink-0">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
            selected
              ? 'bg-tg-button scale-110'
              : 'border-2 border-tg-hint/20'
          }`}
        >
          {selected && <Check size={14} strokeWidth={3} className="text-tg-button-text" />}
        </div>
      </div>
    </button>
  );
}
