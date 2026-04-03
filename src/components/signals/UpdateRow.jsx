import { Clock, ArrowUpRight, ArrowDownRight, RefreshCw, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

function getUpdateIcon(field) {
  switch (field) {
    case 'created':
      return <RefreshCw size={14} strokeWidth={2} className="text-blue" />;
    case 'entry_price':
      return <ArrowUpRight size={14} strokeWidth={2} className="text-yellow" />;
    case 'stop_loss':
      return <ArrowDownRight size={14} strokeWidth={2} className="text-red" />;
    case 'take_profit':
      return <ArrowUpRight size={14} strokeWidth={2} className="text-green" />;
    case 'status':
      return <AlertCircle size={14} strokeWidth={2} className="text-blue" />;
    default:
      return <RefreshCw size={14} strokeWidth={2} className="text-tg-hint" />;
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
    <div className="flex items-start gap-3 py-3 border-b border-tg-secondary/60 last:border-b-0">
      {/* Timeline dot + icon */}
      <div className="w-7 h-7 rounded-full bg-tg-secondary/50 flex items-center justify-center flex-shrink-0 mt-0.5">
        {getUpdateIcon(update.field)}
      </div>

      {/* Content */}
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-[13px] text-tg-text leading-snug">
          {update.message}
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Clock size={10} className="text-tg-hint/50" />
          <span className="text-[11px] text-tg-hint/60">
            {formatTimestamp(update.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
}
