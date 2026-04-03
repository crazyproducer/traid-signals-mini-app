import { Target } from 'lucide-react';
import OptionCard from './OptionCard';
import { STRATEGIES, MOCK_RECORD_COUNTS } from '../../utils/constants';

export default function StepStrategy({ value, onChange }) {
  return (
    <div className="flex flex-col gap-4">
      {STRATEGIES.map((strat) => (
        <OptionCard
          key={strat.value}
          icon={Target}
          title={strat.label}
          description={strat.description}
          count={MOCK_RECORD_COUNTS.strategy[strat.value]}
          selected={value === strat.value}
          onClick={() => onChange(strat.value)}
          color="blue"
        />
      ))}

      {/* Coming soon note */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-tg-secondary/30">
        <div className="w-1.5 h-1.5 rounded-full bg-tg-hint/40" />
        <span className="text-[12px] text-tg-hint">
          More strategies coming soon
        </span>
      </div>
    </div>
  );
}
