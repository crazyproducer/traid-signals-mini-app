import Skeleton from './Skeleton';

/**
 * Generic skeleton for list rows used in Configurations + Account
 * (subscription/keys). Compact, two-line layout: title bar on top,
 * subtitle below.
 */
export default function SkeletonListRow() {
  return (
    <div
      className="bg-tg-section rounded-[5px] flex flex-col"
      style={{ padding: '14px', gap: '8px' }}
    >
      <Skeleton style={{ width: '55%', height: '15px' }} />
      <Skeleton style={{ width: '35%', height: '12px' }} />
    </div>
  );
}
