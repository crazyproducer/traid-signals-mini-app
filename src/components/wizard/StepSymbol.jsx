import { SYMBOLS } from '../../utils/constants';

const COIN_COLORS = {
  BTC: 'from-amber-400 to-amber-600',
  ETH: 'from-indigo-400 to-indigo-600',
  SOL: 'from-violet-400 to-fuchsia-500',
  BNB: 'from-yellow-400 to-yellow-600',
  XRP: 'from-gray-400 to-gray-600',
  ADA: 'from-blue-400 to-blue-600',
  AVAX: 'from-red-400 to-red-600',
  DOGE: 'from-amber-300 to-amber-500',
  DOT: 'from-pink-400 to-pink-600',
  LINK: 'from-blue-500 to-indigo-600',
};

export default function StepSymbol({ symbols, onToggle, maxSymbols }) {
  const isMaxReached = maxSymbols !== null && symbols.length >= maxSymbols;

  return (
    <div>
      {/* Counter */}
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-[13px] text-tg-hint">
          <span className="font-semibold text-tg-text">{symbols.length}</span>
          {maxSymbols !== null ? ` of ${maxSymbols}` : ''} selected
        </span>
        {isMaxReached && (
          <span className="text-[11px] font-medium text-yellow">Limit reached</span>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {SYMBOLS.map((sym) => {
          const isSelected = symbols.includes(sym.value);
          const isDisabled = !isSelected && isMaxReached;
          const gradient = COIN_COLORS[sym.base] || 'from-gray-400 to-gray-600';

          return (
            <button
              key={sym.value}
              type="button"
              disabled={isDisabled}
              onClick={() => onToggle(sym.value)}
              className={`pressable relative flex items-center gap-2.5 p-3 rounded-2xl text-left transition-all duration-200 ${
                isSelected
                  ? 'option-selected'
                  : isDisabled
                    ? 'card opacity-40 cursor-not-allowed'
                    : 'card border-2 border-transparent'
              }`}
            >
              {/* Coin icon */}
              <div
                className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-[11px] font-bold text-white">
                  {sym.base}
                </span>
              </div>

              {/* Text */}
              <div className="flex flex-col min-w-0">
                <span className="text-[14px] font-semibold text-tg-text leading-tight truncate">
                  {sym.name}
                </span>
                <span className="text-[11px] text-tg-hint leading-snug">
                  {sym.label}
                </span>
              </div>

              {/* Check indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-tg-button flex items-center justify-center">
                  <svg
                    width="8"
                    height="6"
                    viewBox="0 0 10 8"
                    fill="none"
                    className="text-tg-button-text"
                  >
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
