import { Clock, Calendar } from 'lucide-react';
import OptionCard from './OptionCard';
import { MOCK_RECORD_COUNTS } from '../../utils/constants';

export default function StepFrequency({ value, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      <OptionCard
        icon={Clock}
        title="Every 4 hours"
        description="More signals, faster updates"
        count={MOCK_RECORD_COUNTS.frequency['4h']}
        selected={value === '4h'}
        onClick={() => onChange('4h')}
        color="blue"
      />
      <OptionCard
        icon={Calendar}
        title="Every 24 hours"
        description="Fewer signals, daily analysis"
        count={MOCK_RECORD_COUNTS.frequency['24h']}
        selected={value === '24h'}
        onClick={() => onChange('24h')}
        color="violet"
      />
    </div>
  );
}
