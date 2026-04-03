import { ShieldCheck } from 'lucide-react';
import OptionCard from './OptionCard';
import { CONFIDENCE_LEVELS, MOCK_RECORD_COUNTS } from '../../utils/constants';

const CONFIDENCE_META = {
  0.5: {
    title: '50%+ Relaxed',
    description: 'Accept all signals above random chance. More signals, wider net.',
    color: 'green',
  },
  0.6: {
    title: '60%+ Moderate',
    description: 'Balanced threshold. Filters out weaker setups while keeping volume.',
    color: 'blue',
  },
  0.7: {
    title: '70%+ Strict',
    description: 'High statistical significance only. Fewer but higher-quality signals.',
    color: 'violet',
  },
};

export default function StepConfidence({ value, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      {CONFIDENCE_LEVELS.map((level) => {
        const meta = CONFIDENCE_META[level.value];
        const count = MOCK_RECORD_COUNTS.confidence[level.value];

        return (
          <OptionCard
            key={level.value}
            icon={ShieldCheck}
            title={meta.title}
            description={meta.description}
            count={count}
            selected={value === level.value}
            onClick={() => onChange(level.value)}
            color={meta.color}
          />
        );
      })}
    </div>
  );
}
