import Skeleton from './Skeleton';

/**
 * Skeleton for a signal card in the feed list (Signals tab, Home
 * "recent" strip, Active list). Approximates the real <SignalCard>
 * layout: header line with symbol/direction, prices row, footer with
 * stats. Same height so the list doesn't reflow on data arrival.
 */
export default function SkeletonSignalCard() {
  return (
    <div
      className="bg-tg-section rounded-[5px] flex flex-col"
      style={{ padding: '14px', gap: '10px' }}
    >
      <div className="flex items-center justify-between">
        <Skeleton style={{ width: '40%', height: '16px' }} />
        <Skeleton style={{ width: '20%', height: '14px' }} />
      </div>
      <div className="flex items-center justify-between" style={{ gap: '8px' }}>
        <Skeleton style={{ width: '30%', height: '20px' }} />
        <Skeleton style={{ width: '30%', height: '20px' }} />
        <Skeleton style={{ width: '30%', height: '20px' }} />
      </div>
      <Skeleton style={{ width: '50%', height: '12px' }} />
    </div>
  );
}
