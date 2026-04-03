import { TrendingUp, TrendingDown } from 'lucide-react';
import OptionCard from './OptionCard';
import { MOCK_RECORD_COUNTS } from '../../utils/constants';

export default function StepDirection({ directions, onToggle }) {
  const longCount = MOCK_RECORD_COUNTS.direction.LONG;
  const shortCount = MOCK_RECORD_COUNTS.direction.SHORT;

  const selectedLong = directions.includes('LONG');
  const selectedShort = directions.includes('SHORT');

  // Calculate total from selected directions
  let totalCount = 0;
  if (selectedLong) totalCount += longCount;
  if (selectedShort) totalCount += shortCount;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] text-tg-hint mb-1 px-1">
        Select one or both directions
      </p>

      <OptionCard
        icon={TrendingUp}
        title="Long"
        description="Profit when price goes up"
        count={longCount}
        selected={selectedLong}
        onClick={() => onToggle('LONG')}
        color="green"
      />
      <OptionCard
        icon={TrendingDown}
        title="Short"
        description="Profit when price goes down"
        count={shortCount}
        selected={selectedShort}
        onClick={() => onToggle('SHORT')}
        color="red"
      />

      {/* Selected total */}
      {directions.length > 0 && (
        <div className="mt-2 px-1 animate-fade-in">
          <div className="card-premium-sm p-3 flex items-center justify-between">
            <span className="text-[13px] text-tg-hint">Selected records</span>
            <div className="flex items-center gap-2">
              {selectedLong && selectedShort ? (
                <span className="text-[12px] text-tg-hint/70 font-mono">
                  {longCount.toLocaleString()} + {shortCount.toLocaleString()} =
                </span>
              ) : null}
              <span className="text-[14px] font-bold text-tg-text font-mono tabular-nums">
                {totalCount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
