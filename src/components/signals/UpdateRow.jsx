import { ArrowUpRight, ArrowDownRight, RefreshCw, AlertCircle } from 'lucide-react';

function getDotColor(field) {
  switch (field) {
    case 'created':
      return 'bg-blue';
    case 'entry_price':
      return 'bg-yellow';
    case 'stop_loss':
      return 'bg-red';
    case 'take_profit':
      return 'bg-green';
    case 'status':
      return 'bg-blue';
    default:
      return 'bg-tg-hint';
  }
}

function formatTimestamp(ts) {
  const d = new Date(ts);
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const day = d.getDate();
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${month} ${day}, ${time}`;
}

export default function UpdateRow({ update, signal }) {
  return (
    <div className="flex items-start gap-3 py-3">
      {/* Timeline dot + vertical line */}
      <div className="flex flex-col items-center flex-shrink-0 pt-1.5">
        <div className={`w-2 h-2 rounded-full ${getDotColor(update.field)}`} />
        <div className="w-px flex-1 bg-tg-secondary/40 mt-1" />
      </div>

      {/* Content */}
      <div className="flex flex-col min-w-0 flex-1 pb-1">
        <span className="text-[13px] text-tg-text leading-snug">
          {update.message}
        </span>
        <span className="text-[11px] text-tg-hint/50 mt-0.5">
          {formatTimestamp(update.timestamp)}
        </span>
      </div>
    </div>
  );
}
