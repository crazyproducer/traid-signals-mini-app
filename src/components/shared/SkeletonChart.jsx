import Skeleton from './Skeleton';

/**
 * Skeleton placeholder for the equity curve on Home and the
 * performance chart elsewhere. Reserves the same height as the real
 * <PerformanceChart> so the page layout doesn't jump.
 *
 * Optional `height` prop lets callers match their chart container; the
 * 160px default mirrors the Home dashboard's equity strip.
 */
export default function SkeletonChart({ height = 160 }) {
  return (
    <div
      className="bg-tg-section rounded-[5px] relative overflow-hidden"
      style={{ height: `${height}px` }}
    >
      <Skeleton
        className="absolute inset-0"
        style={{ borderRadius: 5 }}
      />
    </div>
  );
}
