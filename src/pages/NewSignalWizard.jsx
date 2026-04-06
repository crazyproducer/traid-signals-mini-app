import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CheckCircle2, BarChart3, Gauge, Target, Trophy,
  TrendingUp, TrendingDown, Coins, Clock, SlidersHorizontal, Rocket, Pencil, Lock,
} from 'lucide-react';
import useWizard from '../hooks/useWizard';
import WizardProgress from '../components/wizard/WizardProgress';
import OptionCard from '../components/wizard/OptionCard';
import PaywallSheet from '../components/shared/PaywallSheet';
import {
  STRATEGIES, RISK_LEVELS, CONFIDENCE_LEVELS, DIRECTIONS,
  SYMBOLS, FREQUENCIES, EMA_FILTERS, RECORD_COUNTS,
} from '../utils/constants';
import { mockSubscription } from '../api/mock-data';

/* ═══════════════════════════════════════════════
   Step titles & subtitles
   ═══════════════════════════════════════════════ */
const STEP_TITLES = [
  'Strategy',
  'Risk level',
  'Confidence',
  'Direction',
  'Symbols',
  'Frequency',
  'Filters',
  'Review',
];

const STEP_SUBTITLES = [
  'Choose a signal strategy',
  'Set stop-loss distance',
  'Set statistical significance threshold',
  'Choose trade direction',
  'Select trading pairs',
  'How often you receive signals and updates',
  'Optional EMA trend filters',
  'Review your signal configuration',
];

/* ═══════════════════════════════════════════════
   Hero record count estimator
   ═══════════════════════════════════════════════ */
function getEstimatedCount(step, data) {
  const R = RECORD_COUNTS;
  let base = 125847;
  if (step >= 1 && data.strategy) base = R.strategy[data.strategy] || base;
  if (step >= 2 && data.risk_level) base = R.risk[data.risk_level] || base;
  if (step >= 3 && data.confidence) base = R.confidence[data.confidence] || base;
  if (step >= 4 && data.directions.length > 0) {
    base = data.directions.reduce((s, d) => s + (R.direction[d] || 0), 0);
  }
  if (step >= 5 && data.symbols.length > 0) {
    base = data.symbols.reduce((s, sym) => s + (R.symbol[sym] || 0), 0);
  }
  if (step >= 6 && data.frequency) base = R.frequency[data.frequency] || base;
  if (step >= 7 && data.ema_filters.length > 0) {
    base = data.ema_filters.reduce((s, f) => s + (R.ema[f] || 0), 0);
  }
  return base;
}

/* ═══════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════ */
function fmtCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

/* ═══════════════════════════════════════════════
   Step 0 — Strategy (single select)
   ═══════════════════════════════════════════════ */
function StepStrategy({ data, setField }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {STRATEGIES.map((s) => (
        <OptionCard
          key={s.value}
          icon={BarChart3}
          title={s.label}
          description={s.description}
          count={RECORD_COUNTS.strategy[s.value]}
          selected={data.strategy === s.value}
          onClick={() => setField('strategy', s.value)}
          color="violet"
        />
      ))}
      <p className="text-[11px] text-tg-hint/40 text-center pt-2 uppercase tracking-widest font-medium">
        More strategies coming soon
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Step 1 — Risk Level (single select)
   ═══════════════════════════════════════════════ */
function StepRisk({ data, setField }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {RISK_LEVELS.map((r) => (
        <OptionCard
          key={r.value}
          icon={Gauge}
          title={r.label}
          description={r.description}
          count={RECORD_COUNTS.risk[r.value]}
          selected={data.risk_level === r.value}
          onClick={() => setField('risk_level', r.value)}
          color={r.value <= 5 ? 'green' : r.value <= 10 ? 'blue' : r.value <= 20 ? 'yellow' : 'red'}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Step 2 — Confidence (single select)
   ═══════════════════════════════════════════════ */
function StepConfidence({ data, setField }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {CONFIDENCE_LEVELS.map((c) => (
        <OptionCard
          key={c.value}
          icon={Target}
          title={c.label}
          description={c.description}
          count={RECORD_COUNTS.confidence[c.value]}
          selected={data.confidence === c.value}
          onClick={() => setField('confidence', c.value)}
          color="blue"
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Step 3 — Direction (multi-select)
   ═══════════════════════════════════════════════ */
function StepDirection({ data, toggleArray }) {
  const selected = data.directions || [];
  const total = selected.reduce((s, d) => s + (RECORD_COUNTS.direction[d] || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {selected.length > 0 && (
        <p className="text-[11px] font-mono text-tg-hint/50 text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {total.toLocaleString()} records selected
        </p>
      )}
      {DIRECTIONS.map((d) => (
        <OptionCard
          key={d.value}
          icon={d.value === 'LONG' ? TrendingUp : TrendingDown}
          title={d.label}
          description={d.description}
          count={RECORD_COUNTS.direction[d.value]}
          selected={selected.includes(d.value)}
          onClick={() => toggleArray('directions', d.value)}
          color={d.value === 'LONG' ? 'green' : 'red'}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Step 4 — Symbols (multi-select)
   ═══════════════════════════════════════════════ */
function StepSymbol({ data, toggleArray, onPaywall }) {
  const selected = data.symbols || [];
  const total = selected.reduce((s, sym) => s + (RECORD_COUNTS.symbol[sym] || 0), 0);
  const limit = mockSubscription.symbols_limit;
  const atLimit = limit && selected.length >= limit;

  function handleClick(sym) {
    const isSelected = selected.includes(sym);
    if (!isSelected && atLimit) {
      onPaywall();
      return;
    }
    toggleArray('symbols', sym);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {selected.length > 0 && (
        <p className="text-[11px] font-mono text-tg-hint/50 text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {selected.length}{limit ? `/${limit}` : ''} selected · {total.toLocaleString()} records
        </p>
      )}
      {SYMBOLS.map((sym) => {
        const isSelected = selected.includes(sym.value);
        return (
        <OptionCard
          key={sym.value}
          icon={Coins}
          title={sym.label}
          description={sym.name}
          count={RECORD_COUNTS.symbol[sym.value]}
          selected={isSelected}
          onClick={() => handleClick(sym.value)}
          color="blue"
        />
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Step 5 — Timeframe (single select)
   ═══════════════════════════════════════════════ */
function StepFrequency({ data, setField }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {FREQUENCIES.map((f) => (
        <OptionCard
          key={f.value}
          icon={Clock}
          title={f.label}
          description={f.description}
          count={RECORD_COUNTS.frequency[f.value]}
          selected={data.frequency === f.value}
          onClick={() => setField('frequency', f.value)}
          color="blue"
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Step 6 — Filters / EMA (multi-select, optional)
   ═══════════════════════════════════════════════ */
function StepFilters({ data, toggleArray }) {
  const selected = data.ema_filters || [];
  const total = selected.reduce((s, f) => s + (RECORD_COUNTS.ema[f] || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {selected.length > 0 && (
        <p className="text-[11px] font-mono text-tg-hint/50 text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {selected.length} filter{selected.length > 1 ? 's' : ''} · {total.toLocaleString()} records
        </p>
      )}
      {EMA_FILTERS.map((f) => (
        <OptionCard
          key={f.value}
          icon={SlidersHorizontal}
          title={f.label}
          description={f.description}
          count={RECORD_COUNTS.ema[f.value]}
          selected={selected.includes(f.value)}
          onClick={() => toggleArray('ema_filters', f.value)}
          color="yellow"
        />
      ))}
      <p className="text-[11px] text-tg-hint/40 text-center pt-1 uppercase tracking-widest font-medium">
        {selected.length === 0
          ? 'No filter — all records included'
          : `${selected.length} filter${selected.length > 1 ? 's' : ''} active`}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Step 7 — Review
   ═══════════════════════════════════════════════ */
function StepReview({ data, goToStep }) {
  const dirLabels = (data.directions || []).join(' & ') || '--';
  const stratLabel = STRATEGIES.find((s) => s.value === data.strategy)?.label || '--';
  const freqLabel = FREQUENCIES.find((f) => f.value === data.frequency)?.label || '--';
  const confLabel = CONFIDENCE_LEVELS.find((c) => c.value === data.confidence)?.label || '--';

  const MAX_SHOW = 3;
  const selectedSyms = SYMBOLS.filter((s) => (data.symbols || []).includes(s.value)).map((s) => s.base);
  const symLabels = selectedSyms.length === 0 ? '--'
    : selectedSyms.length <= MAX_SHOW ? selectedSyms.join(', ')
    : selectedSyms.slice(0, MAX_SHOW).join(', ') + ` +${selectedSyms.length - MAX_SHOW} more`;

  const selectedEma = data.ema_filters || [];
  const emaLabels = selectedEma.length === 0 ? 'None'
    : selectedEma.length <= MAX_SHOW ? selectedEma.map((v) => `EMA ${v}`).join(', ')
    : selectedEma.slice(0, MAX_SHOW).map((v) => `EMA ${v}`).join(', ') + ` +${selectedEma.length - MAX_SHOW} more`;

  const items = [
    { label: 'Strategy', value: stratLabel, step: 0 },
    { label: 'Risk level', value: data.risk_level != null ? `${data.risk_level}%` : '--', step: 1 },
    { label: 'Confidence', value: confLabel, step: 2 },
    { label: 'Direction', value: dirLabels, step: 3 },
    { label: 'Symbols', value: symLabels, step: 4 },
    { label: 'Timeframe', value: freqLabel, step: 5 },
    { label: 'Filters', value: emaLabels, step: 6 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.map((item) => (
        <div
          key={item.label}
          className="card w-full text-left flex items-center"
          style={{ padding: '14px 16px' }}
        >
          <div style={{ flex: 1 }}>
            <span className="text-[9px] uppercase font-medium text-tg-hint block" style={{ letterSpacing: '0.04em' }}>
              {item.label}
            </span>
            <span className="text-[15px] font-semibold text-tg-text block" style={{ marginTop: '2px' }}>
              {item.value}
            </span>
          </div>
          <button
            type="button"
            onClick={() => goToStep(item.step)}
            className="pressable flex items-center justify-center"
            style={{ flexShrink: 0, padding: '8px', marginRight: '-8px', borderRadius: '6px' }}
          >
            <Pencil size={14} className="text-tg-hint/40" />
          </button>
        </div>
      ))}

      <div className="flex items-center justify-center text-tg-hint" style={{ gap: '8px', marginTop: '8px' }}>
        <Rocket size={16} />
        <span className="text-[12px] font-medium">Ready to launch your signal</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Success State
   ═══════════════════════════════════════════════ */
function SuccessState({ onDone, onUpgrade }) {
  const isFree = mockSubscription.plan === 'free';

  return (
    <div className="flex flex-col items-center justify-center text-center page-padding" style={{ minHeight: '100dvh' }}>
      {/* Animated check */}
      <div style={{ position: 'relative', marginBottom: '28px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px -4px rgba(5, 150, 105, 0.35)' }}>
          <CheckCircle2 size={40} strokeWidth={1.8} className="text-white" />
        </div>
        {/* Subtle ring pulse */}
        <div className="live-dot" style={{ position: 'absolute', inset: '-6px', borderRadius: '46px', border: '2px solid rgba(5, 150, 105, 0.2)' }} />
      </div>

      <h2 className="text-[24px] font-bold text-tg-text" style={{ letterSpacing: '-0.03em', marginBottom: '8px' }}>
        Signal launched
      </h2>
      <p className="text-[14px] text-tg-hint" style={{ marginBottom: '32px', maxWidth: '280px', lineHeight: '1.6' }}>
        Your signal subscription is now active. You will receive notifications when new signals are generated.
      </p>

      {/* Primary CTA */}
      <button
        type="button"
        onClick={onDone}
        className="btn pressable w-full"
        style={{ backgroundColor: 'var(--tg-theme-button-color, #2481cc)', color: 'var(--tg-theme-button-text-color, #fff)', marginBottom: '12px' }}
      >
        View my signals
      </button>

      {/* Upsell for free users */}
      {isFree && (
        <button
          type="button"
          onClick={onUpgrade}
          className="card pressable w-full text-left"
          style={{ padding: '16px', marginTop: '8px', background: 'linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(37,99,235,0.05) 100%)' }}
        >
          <div className="flex items-center" style={{ gap: '12px' }}>
            <div className="icon-gradient-violet flex items-center justify-center flex-shrink-0" style={{ width: '40px', height: '40px', borderRadius: '6px' }}>
              <Trophy size={18} strokeWidth={1.8} className="text-white" />
            </div>
            <div style={{ flex: 1 }}>
              <span className="text-[14px] font-semibold text-tg-text block">Want more signals?</span>
              <span className="text-[12px] text-tg-hint block" style={{ marginTop: '2px', lineHeight: '1.4' }}>
                Subscribe to track more symbols and create multiple configurations
              </span>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Hero Record Count
   ═══════════════════════════════════════════════ */
function HeroCount({ count }) {
  return (
    <div className="text-center mb-6">
      <span
        className="text-[48px] font-mono font-bold text-tg-text leading-none"
        style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.04em' }}
      >
        {count.toLocaleString()}
      </span>
      <p className="text-[12px] text-tg-hint mt-1.5 uppercase tracking-widest font-medium">
        matching records
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Main Wizard
   ═══════════════════════════════════════════════ */
export default function NewSignalWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const w = useWizard();
  const [launched, setLaunched] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  // Load template data if passed via navigation state
  useEffect(() => {
    if (location.state?.template) {
      const t = location.state.template;
      w.loadTemplate({
        strategy: t.strategies?.[0] || 'pullback',
        risk_level: t.risk_level,
        confidence: t.confidence,
        directions: t.directions || [],
        symbols: t.symbols || [],
        frequency: t.frequency,
        ema_filters: t.ema_filters || [],
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLaunch = useCallback(() => setLaunched(true), []);

  const estimatedCount = useMemo(
    () => getEstimatedCount(w.step, w.data),
    [w.step, w.data],
  );

  if (launched) {
    return <SuccessState onDone={() => navigate('/signals')} onUpgrade={() => navigate('/account/plans')} />;
  }

  /* Map step index to component */
  function renderStep() {
    switch (w.step) {
      case 0: return <StepStrategy data={w.data} setField={w.setField} />;
      case 1: return <StepRisk data={w.data} setField={w.setField} />;
      case 2: return <StepConfidence data={w.data} setField={w.setField} />;
      case 3: return <StepDirection data={w.data} toggleArray={w.toggleArray} />;
      case 4: return <StepSymbol data={w.data} toggleArray={w.toggleArray} onPaywall={() => setShowPaywall(true)} />;
      case 5: return <StepFrequency data={w.data} setField={w.setField} />;
      case 6: return <StepFilters data={w.data} toggleArray={w.toggleArray} />;
      case 7: return <StepReview data={w.data} goToStep={w.goToStep} />;
      default: return null;
    }
  }

  const animClass = w.animDir === 'forward' ? 'wizard-step-forward' : 'wizard-step-backward';
  const isReview = w.step === 7;

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Progress bar + step info */}
      <div className="page-padding" style={{ paddingTop: '16px', paddingBottom: '12px' }}>
        <WizardProgress step={w.step} totalSteps={w.totalSteps} subtitle={STEP_SUBTITLES[w.step]} />
      </div>

      {/* Step content */}
      <div className="flex-1 page-padding overflow-y-auto hide-scrollbar" style={{ paddingBottom: '120px' }} key={w.step}>
        <div className={animClass}>
          {renderStep()}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="page-padding" style={{ position: 'fixed', bottom: '70px', left: 0, right: 0, paddingBottom: '16px', paddingTop: '16px', background: 'linear-gradient(to top, var(--tg-theme-bg-color, #fff) 60%, transparent)' }}>
        <div className="flex items-center gap-3">
          {w.step > 0 && (
            <button
              type="button"
              onClick={w.prevStep}
              className="btn flex-1 bg-tg-secondary/60 text-tg-text pressable"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={w.isLastStep ? handleLaunch : w.nextStep}
            disabled={!w.canProceed}
            className={`btn flex-1 pressable transition-all duration-200 ${
              w.canProceed
                ? w.isLastStep
                  ? 'icon-gradient-green text-white'
                  : 'bg-tg-button text-tg-button-text shadow-[0_4px_14px_-2px] shadow-tg-button/30'
                : 'bg-tg-secondary/40 text-tg-hint/50 cursor-not-allowed'
            }`}
          >
            {w.isLastStep ? 'Launch signal' : 'Continue'}
          </button>
        </div>
      </div>

      {/* Paywall */}
      {showPaywall && (
        <PaywallSheet
          reason="Free plan allows 1 symbol. Upgrade for more."
          onClose={() => setShowPaywall(false)}
        />
      )}
    </div>
  );
}
