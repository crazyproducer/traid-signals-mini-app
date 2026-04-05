export default function Skeleton({ className = '', style }) {
  return <div className={`skeleton-shimmer rounded-[5px] ${className}`} style={style} />;
}
