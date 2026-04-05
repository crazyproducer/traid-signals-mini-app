import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, TrendingUp, BarChart3, Shield, Target, Clock } from 'lucide-react';

const TOPICS = [
  {
    icon: TrendingUp,
    color: 'icon-gradient-green',
    title: 'What are trading signals?',
    body: 'Trading signals are actionable notifications that tell you when to place a trade. Each signal includes an entry price (where to buy or sell), a stop-loss (where to exit if the trade goes wrong), and a take-profit (where to take your gains). You place a limit order at the entry price and wait for the market to come to you.',
  },
  {
    icon: BarChart3,
    color: 'icon-gradient-violet',
    title: 'Pull Back strategy',
    body: 'The Pull Back strategy identifies moments when the price temporarily moves against the trend, creating potential entry points at better prices. The algorithm analyzes local extremes across multiple configurations and calculates retracement levels. When the price pulls back to one of these levels, a signal is generated.',
  },
  {
    icon: Target,
    color: 'icon-gradient-blue',
    title: 'Win rate and confidence',
    body: 'Win rate shows the percentage of signals that historically reached their take-profit before hitting the stop-loss. A 70% win rate means 7 out of 10 signals were profitable. Confidence measures statistical significance — how reliable the win rate is based on the number of historical trades. Higher confidence means more data supports the result.',
  },
  {
    icon: Shield,
    color: 'icon-gradient-red',
    title: 'Risk level and stop-loss',
    body: 'The risk level determines how far the stop-loss is from the entry price. A 1% risk means the stop-loss is 1% below (for Long) or above (for Short) the entry. Lower risk means tighter stops — you lose less per trade but may get stopped out more often. Higher risk gives the trade more room to move but increases potential loss.',
  },
  {
    icon: Clock,
    color: 'icon-gradient-yellow',
    title: 'Timeframes: 4h vs 24h',
    body: 'The timeframe controls how often signals are recalculated. The 4-hour timeframe generates more signals and updates faster, suitable for active traders. The 24-hour (daily) timeframe produces fewer, more deliberate signals based on daily price action — better for a hands-off approach.',
  },
  {
    icon: BarChart3,
    color: 'icon-gradient-blue',
    title: 'EMA filters',
    body: 'EMA (Exponential Moving Average) filters add a trend condition to your signals. EMA 20 tracks short-term momentum, EMA 50 medium-term, EMA 100 and 200 long-term trends. When enabled, signals are only generated when the price aligns with the trend on that timeframe. Using no filter means all price conditions are considered.',
  },
  {
    icon: TrendingUp,
    color: 'icon-gradient-green',
    title: 'Long vs Short',
    body: 'A Long signal profits when the price goes up — you buy at the entry and sell at a higher take-profit. A Short signal profits when the price goes down — you sell at the entry and buy back at a lower take-profit. You can subscribe to both directions to capture moves in either direction.',
  },
  {
    icon: BookOpen,
    color: 'icon-gradient-neutral',
    title: 'Record counts in the wizard',
    body: 'As you configure your signal, the number at the top shows how many historical trades match your current settings. More records means more statistical data backing your configuration. If the number gets very low, the signals may be less reliable. The count decreases with each filter you apply because each setting narrows the dataset.',
  },
];

function TopicCard({ topic, isOpen, onToggle }) {
  const Icon = topic.icon;

  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="pressable w-full text-left p-4 flex items-center gap-3.5"
      >
        <div className={`${topic.color} w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0`}>
          <Icon size={18} strokeWidth={1.8} className="text-white" />
        </div>
        <span className="flex-1 text-[15px] font-semibold text-tg-text" style={{ letterSpacing: '-0.01em' }}>
          {topic.title}
        </span>
        <div className="flex-shrink-0 text-tg-hint/40">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-0 animate-slide-down">
          <p className="text-[14px] text-tg-hint leading-relaxed pl-[54px]">
            {topic.body}
          </p>
        </div>
      )}
    </div>
  );
}

export default function Learn() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="px-5 pt-8 pb-24 animate-fade-in">
      <h1 className="text-[28px] font-bold text-tg-text mb-2" style={{ letterSpacing: '-0.03em' }}>
        Learn
      </h1>
      <p className="text-[14px] text-tg-hint mb-6 leading-relaxed">
        Everything you need to know about trading signals
      </p>

      <div className="flex flex-col gap-3">
        {TOPICS.map((topic, i) => (
          <TopicCard
            key={i}
            topic={topic}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </div>
  );
}
