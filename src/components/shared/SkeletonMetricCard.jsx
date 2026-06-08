import Skeleton from './Skeleton';

/**
 * Skeleton placeholder for the 4 metric cards on Home (Return, Win Rate,
 * New, Active). Shape matches the real <StatCard>: small label on top,
 * large value below. Renders the same height so layout doesn't shift
 * when real data arrives.
 */
export default function SkeletonMetricCard() {
  return (
    <div
      className="bg-tg-section rounded-[5px] flex flex-col justify-between"
      style={{ padding: '14px', height: '92px' }}
    >
      <Skeleton style={{ width: '60%', height: '11px' }} />
      <Skeleton style={{ width: '75%', height: '24px' }} />
    </div>
  );
}
