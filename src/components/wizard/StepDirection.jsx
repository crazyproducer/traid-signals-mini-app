import { TrendingUp, TrendingDown } from 'lucide-react';
import OptionCard from './OptionCard';

export default function StepDirection({ value, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      <OptionCard
        icon={TrendingUp}
        title="Long"
        description="Profit when price goes up"
        selected={value === 'LONG'}
        onClick={() => onChange('LONG')}
        color="green"
      />
      <OptionCard
        icon={TrendingDown}
        title="Short"
        description="Profit when price goes down"
        selected={value === 'SHORT'}
        onClick={() => onChange('SHORT')}
        color="red"
      />
    </div>
  );
}
