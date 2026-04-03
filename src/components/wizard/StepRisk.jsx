import { RISK_LEVELS, MOCK_RECORD_COUNTS } from '../../utils/constants';

export default function StepRisk({ value, onChange }) {
  return (
    <div>
      {/* Explanation */}
      <p className="text-[13px] text-tg-hint mb-4 px-1 leading-relaxed">
        Stop-loss distance from entry price. Lower values mean tighter stops and less risk per trade.
      </p>

      {/* Horizontal pills with counts */}
      <div className="flex items-center gap-2 flex-wrap">
        {RISK_LEVELS.map((level) => {
          const isSelected = value === level;
          const count = MOCK_RECORD_COUNTS.risk[level];

          return (
            <button
              key={level}
              type="button"
              onClick={() => onChange(level)}
              className={`pressable flex flex-col items-center px-5 py-2.5 rounded-2xl text-center transition-all duration-200 ${
                isSelected
                  ? 'bg-tg-text text-tg-bg shadow-md scale-105'
                  : 'bg-tg-secondary/50 text-tg-text hover:bg-tg-secondary/70'
              }`}
            >
              <span className="text-[15px] font-semibold">{level}%</span>
              <span
                className={`text-[10px] font-mono tabular-nums mt-0.5 ${
                  isSelected ? 'text-tg-bg/70' : 'text-tg-hint/70'
                }`}
              >
                {count.toLocaleString()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected description */}
      {value !== null && (
        <div className="mt-4 px-1 animate-fade-in">
          <div className="card-premium-sm p-3.5 flex items-start gap-3">
            <div className="icon-gradient-blue w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[11px] font-bold text-white">{value}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-tg-text">
                {value <= 1
                  ? 'Ultra-tight stop'
                  : value <= 5
                    ? 'Tight stop'
                    : value <= 10
                      ? 'Moderate stop'
                      : value <= 20
                        ? 'Wide stop'
                        : 'Very wide stop'}
              </span>
              <span className="text-[12px] text-tg-hint mt-0.5 leading-relaxed">
                {value <= 1
                  ? 'Minimal risk per trade. May trigger stop-loss more frequently.'
                  : value <= 5
                    ? 'Controlled risk. Good balance between protection and room to breathe.'
                    : value <= 10
                      ? 'Standard risk level. Gives the trade moderate room to move.'
                      : value <= 20
                        ? 'Higher risk tolerance. More room for volatile price swings.'
                        : 'Maximum risk tolerance. Only for high-conviction trades.'}
              </span>
              <span className="text-[11px] text-tg-hint/60 font-mono mt-1">
                {MOCK_RECORD_COUNTS.risk[value].toLocaleString()} matching records
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
