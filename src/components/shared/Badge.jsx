const VARIANTS = {
  pending: 'bg-violet/8 text-violet',
  long: 'bg-green/8 text-green',
  short: 'bg-red/8 text-red',
  active: 'bg-green/8 text-green',
  paused: 'bg-yellow/8 text-yellow',
  triggered: 'bg-blue/8 text-blue',
  expired: 'bg-tg-hint/8 text-tg-hint',
  win: 'bg-green/8 text-green',
  loss: 'bg-red/8 text-red',
  pullback: 'bg-blue/8 text-blue',
};

export default function Badge({ children, variant }) {
  return (
    <span
      className={`inline-flex items-center text-[10px] rounded-full px-2.5 py-0.5 font-bold tracking-wide uppercase flex-shrink-0 ${VARIANTS[variant] || VARIANTS.expired}`}
      style={{ letterSpacing: '0.04em' }}
    >
      {children}
    </span>
  );
}
