import { Filter } from 'lucide-react';
import OptionCard from './OptionCard';
import { EMA_FILTERS } from '../../utils/constants';

const FILTER_DESCRIPTIONS = {
  null: 'No trend filtering applied',
  20: 'Fast trend — reacts quickly to price changes',
  50: 'Medium trend — balanced sensitivity',
  100: 'Slow trend — filters out noise',
  200: 'Long-term trend — strongest filter',
};

const FILTER_COLORS = {
  null: 'neutral',
  20: 'green',
  50: 'blue',
  100: 'violet',
  200: 'red',
};

export default function StepFilters({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2.5">
      {EMA_FILTERS.map((filter) => (
        <OptionCard
          key={String(filter.value)}
          icon={Filter}
          title={filter.label}
          description={FILTER_DESCRIPTIONS[filter.value]}
          selected={value === filter.value}
          onClick={() => onChange(filter.value)}
          color={FILTER_COLORS[filter.value] || 'blue'}
        />
      ))}
    </div>
  );
}
