import { Check, X } from 'lucide-react';

export default function FeatureRow({ text, included }) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
          included ? 'bg-green/10' : 'bg-tg-secondary/50'
        }`}
      >
        {included ? (
          <Check size={12} strokeWidth={2.5} className="text-green" />
        ) : (
          <X size={12} strokeWidth={2.5} className="text-tg-hint/50" />
        )}
      </div>
      <span
        className={`text-[13px] leading-snug ${
          included ? 'text-tg-text' : 'text-tg-hint/60'
        }`}
      >
        {text}
      </span>
    </div>
  );
}
