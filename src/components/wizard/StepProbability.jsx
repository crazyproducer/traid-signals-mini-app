import { BarChart3 } from 'lucide-react';
import OptionCard from './OptionCard';
import { PROBABILITY_LEVELS } from '../../utils/constants';

const PROBABILITY_META = {
  0.66: {
    title: '66% Standard',
    description: 'Historical win rate above 2/3. Good signal volume with solid edge.',
    color: 'green',
  },
  0.75: {
    title: '75% High',
    description: 'Only trades that won 3 out of 4 times historically. Fewer but stronger.',
    color: 'blue',
  },
  0.90: {
    title: '90% Very High',
    description: 'Elite setups only. Rare signals with exceptional historical performance.',
    color: 'violet',
  },
};

export default function StepProbability({ value, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      {PROBABILITY_LEVELS.map((level) => {
        const meta = PROBABILITY_META[level.value];

        return (
          <OptionCard
            key={level.value}
            icon={BarChart3}
            title={meta.title}
            description={meta.description}
            selected={value === level.value}
            onClick={() => onChange(level.value)}
            color={meta.color}
          />
        );
      })}
    </div>
  );
}
