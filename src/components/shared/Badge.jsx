const VARIANTS = {
  long: 'bg-green/10 text-green',
  short: 'bg-red/10 text-red',
  active: 'bg-green/10 text-green',
  paused: 'bg-yellow/10 text-yellow',
  triggered: 'bg-blue/10 text-blue',
  expired: 'bg-tg-secondary/80 text-tg-hint',
  win: 'bg-green/10 text-green',
  loss: 'bg-red/10 text-red',
  pullback: 'bg-blue/10 text-blue',
};

export default function Badge({ children, variant }) {
  return (
    <span
      className={`inline-flex items-center text-[10px] rounded-full px-2 py-0.5 font-semibold tracking-wider uppercase flex-shrink-0 ${VARIANTS[variant] || VARIANTS.expired}`}
    >
      {children}
    </span>
  );
}
