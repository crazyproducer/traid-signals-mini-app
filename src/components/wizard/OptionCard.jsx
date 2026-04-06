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
      className={`pressable w-full text-left transition-all duration-200 ${selected ? 'card-selected' : 'card'}`}
      style={{ padding: '16px', borderRadius: '7px' }}
    >
      {/* Row: icon + content + check */}
      <div className="flex items-center" style={{ gap: '14px' }}>
        <div className={`${grad} flex items-center justify-center flex-shrink-0`} style={{ width: '40px', height: '40px', borderRadius: '4px' }}>
          <Icon size={18} strokeWidth={1.8} className="text-white" />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="flex items-baseline" style={{ gap: '8px' }}>
            <span className="text-[15px] font-semibold text-tg-text leading-tight" style={{ letterSpacing: '-0.01em' }}>
              {title}
            </span>
            {count != null && (
              <span className="text-[11px] font-mono text-tg-hint/40" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {fmtCount(count)}
              </span>
            )}
          </div>
          {description && (
            <span className="text-[12px] text-tg-hint leading-snug block" style={{ marginTop: '2px' }}>
              {description}
            </span>
          )}
        </div>

        <div style={{ flexShrink: 0 }}>
          <div
            className={`flex items-center justify-center transition-all duration-200 ${
              selected ? 'bg-tg-button' : 'border-2 border-tg-hint/15'
            }`}
            style={{ width: '22px', height: '22px', borderRadius: '11px' }}
          >
            {selected && <Check size={13} strokeWidth={3} className="text-tg-button-text" />}
          </div>
        </div>
      </div>
    </button>
  );
}
