import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2, BarChart3, Gauge, Target,
  TrendingUp, TrendingDown, Coins, Clock, SlidersHorizontal, Rocket,
} from 'lucide-react';
import useWizard from '../hooks/useWizard';
import WizardProgress from '../components/wizard/WizardProgress';
import OptionCard from '../components/wizard/OptionCard';
import {
  STRATEGIES, RISK_LEVELS, CONFIDENCE_LEVELS, DIRECTIONS,
  SYMBOLS, FREQUENCIES, EMA_FILTERS, RECORD_COUNTS,
} from '../utils/constants';

/* ═══════════════════════════════════════════════
   Step titles & subtitles
   ═══════════════════════════════════════════════ */
const STEP_TITLES = [
  'Strategy',
  'Risk level',
  'Confidence',
  'Direction',
  'Symbols',
  'Timeframe',
  'Filters',
  'Review',
];

const STEP_SUBTITLES = [
  'Choose a signal strategy',
  'Set stop-loss distance',
  'Set statistical significance threshold',
  'Choose trade direction',
  'Select trading pairs',
  'Signal update frequency',
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
    <div className="space-y-3">
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
    <div className="space-y-3">
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
    <div className="space-y-3">
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

  return (
    <div className="space-y-3">
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
function StepSymbol({ data, toggleArray }) {
  const selected = data.symbols || [];

  return (
    <div className="space-y-3">
      {SYMBOLS.map((sym) => (
        <OptionCard
          key={sym.value}
          icon={Coins}
          title={sym.label}
          description={sym.name}
          count={RECORD_COUNTS.symbol[sym.value]}
          selected={selected.includes(sym.value)}
          onClick={() => toggleArray('symbols', sym.value)}
          color="blue"
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Step 5 — Timeframe (single select)
   ═══════════════════════════════════════════════ */
function StepFrequency({ data, setField }) {
  return (
    <div className="space-y-3">
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

  return (
    <div className="space-y-3">
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
function StepReview({ data }) {
  const dirLabels = (data.directions || []).join(' & ') || '--';
  const symLabels = SYMBOLS.filter((s) => (data.symbols || []).includes(s.value)).map((s) => s.base).join(', ') || '--';
  const stratLabel = STRATEGIES.find((s) => s.value === data.strategy)?.label || '--';
  const freqLabel = FREQUENCIES.find((f) => f.value === data.frequency)?.label || '--';
  const confLabel = CONFIDENCE_LEVELS.find((c) => c.value === data.confidence)?.label || '--';
  const emaLabels = (data.ema_filters || []).length > 0
    ? data.ema_filters.map((v) => `EMA ${v}`).join(', ')
    : 'None';

  const rows = [
    { label: 'Strategy', value: stratLabel },
    { label: 'Risk level', value: data.risk_level != null ? `${data.risk_level}%` : '--' },
    { label: 'Confidence', value: confLabel },
    { label: 'Direction', value: dirLabels },
    { label: 'Symbols', value: symLabels },
    { label: 'Timeframe', value: freqLabel },
    { label: 'Filters', value: emaLabels },
  ];

  return (
    <div>
      <div className="card-elevated p-5">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between py-3 ${
              i < rows.length - 1
                ? 'border-b border-[color-mix(in_srgb,var(--tg-theme-text-color)_6%,transparent)]'
                : ''
            }`}
          >
            <span className="text-[13px] text-tg-hint">{row.label}</span>
            <span className="text-[13px] font-semibold text-tg-text text-right max-w-[60%]">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-5 text-tg-hint">
        <Rocket size={16} />
        <span className="text-[12px] font-medium">Ready to launch your signal</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Success State
   ═══════════════════════════════════════════════ */
function SuccessState({ onDone }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in px-7">
      <div className="icon-gradient-green w-16 h-16 rounded-full flex items-center justify-center mb-5">
        <CheckCircle2 size={32} strokeWidth={2} className="text-white" />
      </div>
      <h2 className="text-[20px] font-bold text-tg-text mb-2" style={{ letterSpacing: '-0.02em' }}>
        Signal launched
      </h2>
      <p className="text-[14px] text-tg-hint mb-8 max-w-[260px] leading-relaxed">
        Your signal subscription is active. You will receive notifications when new signals are generated.
      </p>
      <button
        type="button"
        onClick={onDone}
        className="bg-tg-button text-tg-button-text text-[14px] font-semibold rounded-2xl px-8 py-3.5 pressable"
      >
        View My Signals
      </button>
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
  const w = useWizard();
  const [launched, setLaunched] = useState(false);

  const handleLaunch = useCallback(() => setLaunched(true), []);

  const estimatedCount = useMemo(
    () => getEstimatedCount(w.step, w.data),
    [w.step, w.data],
  );

  if (launched) {
    return <SuccessState onDone={() => navigate('/signals')} />;
  }

  /* Map step index to component */
  function renderStep() {
    switch (w.step) {
      case 0: return <StepStrategy data={w.data} setField={w.setField} />;
      case 1: return <StepRisk data={w.data} setField={w.setField} />;
      case 2: return <StepConfidence data={w.data} setField={w.setField} />;
      case 3: return <StepDirection data={w.data} toggleArray={w.toggleArray} />;
      case 4: return <StepSymbol data={w.data} toggleArray={w.toggleArray} />;
      case 5: return <StepFrequency data={w.data} setField={w.setField} />;
      case 6: return <StepFilters data={w.data} toggleArray={w.toggleArray} />;
      case 7: return <StepReview data={w.data} />;
      default: return null;
    }
  }

  const animClass = w.animDir === 'forward' ? 'wizard-step-forward' : 'wizard-step-backward';
  const isReview = w.step === 7;

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Progress bar */}
      <div className="px-7 pt-4 pb-2">
        <WizardProgress step={w.step} totalSteps={w.totalSteps} />
      </div>

      {/* Title + subtitle */}
      <div className="px-7 pb-4">
        <h2
          className="text-[24px] font-bold text-tg-text leading-tight"
          style={{ letterSpacing: '-0.03em' }}
        >
          {STEP_TITLES[w.step]}
        </h2>
        <p className="text-[14px] text-tg-hint mt-1 leading-relaxed">
          {STEP_SUBTITLES[w.step]}
        </p>
      </div>

      {/* Hero record count — not on Review step */}
      {!isReview && (
        <div className="px-7">
          <HeroCount count={estimatedCount} />
        </div>
      )}

      {/* Step content */}
      <div className="flex-1 px-7 pb-32 overflow-y-auto hide-scrollbar" key={w.step}>
        <div className={animClass}>
          {renderStep()}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 px-7 pb-6 pt-10 bg-gradient-to-t from-tg-bg via-tg-bg/95 to-transparent">
        <div className="flex items-center gap-3">
          {w.step > 0 && (
            <button
              type="button"
              onClick={w.prevStep}
              className="flex-1 py-3.5 rounded-2xl text-[15px] font-semibold bg-tg-secondary/60 text-tg-text pressable"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={w.isLastStep ? handleLaunch : w.nextStep}
            disabled={!w.canProceed}
            className={`flex-1 py-3.5 rounded-2xl text-[15px] font-semibold pressable transition-all duration-200 ${
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
    </div>
  );
}
