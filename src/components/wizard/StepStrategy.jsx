import { Target } from 'lucide-react';
import OptionCard from './OptionCard';
import { STRATEGIES } from '../../utils/constants';

export default function StepStrategy({ value, onChange }) {
  const pullback = STRATEGIES[0];

  return (
    <div className="flex flex-col gap-4">
      <OptionCard
        icon={Target}
        title={pullback.label}
        description={pullback.description}
        selected={value === pullback.value}
        onClick={() => onChange(pullback.value)}
        color="blue"
      />

      {/* Coming soon note */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-[4px] bg-tg-secondary/30">
        <div className="w-1.5 h-1.5 rounded-full bg-tg-hint/40" />
        <span className="text-[12px] text-tg-hint">
          More strategies coming soon
        </span>
      </div>
    </div>
  );
}
