import { useState, useCallback } from 'react';
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
   Step titles
   ═══════════════════════════════════════════════ */
const STEP_TITLES = [
  'Strategy',
  'Risk Level',
  'Confidence',
  'Direction',
  'Symbols',
  'Timeframe',
  'Filters',
  'Review & Launch',
];

const STEP_SUBTITLES = [
  'Select a signal strategy',
  'Stop-loss distance from entry price',
  'Minimum statistical significance',
  'Select one or both directions',
  'Choose trading pairs',
  'Signal update frequency',
  'Optional EMA trend filters',
  'Review your configuration',
];

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
    <div className="space-y-2">
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
      <p className="text-[11px] text-tg-hint/50 text-center pt-2">More strategies coming soon</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Step 1 — Risk Level (single select)
   ═══════════════════════════════════════════════ */
function StepRisk({ data, setField }) {
  return (
    <div className="space-y-2">
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
    <div className="space-y-2">
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
  const total = selected.reduce((sum, d) => sum + (RECORD_COUNTS.direction[d] || 0), 0);

  return (
    <div className="space-y-2">
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
      {selected.length > 0 && (
        <p className="text-[12px] text-tg-hint text-center pt-1 font-mono">
          {fmtCount(total)} records selected
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Step 4 — Symbols (multi-select)
   ═══════════════════════════════════════════════ */
function StepSymbol({ data, toggleArray }) {
  const selected = data.symbols || [];
  const total = selected.reduce((sum, s) => sum + (RECORD_COUNTS.symbol[s] || 0), 0);

  return (
    <div className="space-y-2">
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
      {selected.length > 0 && (
        <p className="text-[12px] text-tg-hint text-center pt-1 font-mono">
          {selected.length} symbol{selected.length > 1 ? 's' : ''} · {fmtCount(total)} records
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Step 5 — Timeframe (single select)
   ═══════════════════════════════════════════════ */
function StepFrequency({ data, setField }) {
  return (
    <div className="space-y-2">
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
  const total = selected.reduce((sum, v) => sum + (RECORD_COUNTS.ema[v] || 0), 0);

  return (
    <div className="space-y-2">
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
      <p className="text-[11px] text-tg-hint/50 text-center pt-1">
        {selected.length === 0
          ? 'No filter selected — all records included'
          : `${selected.length} filter${selected.length > 1 ? 's' : ''} · ${fmtCount(total)} records`}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Step 7 — Review & Launch
   ═══════════════════════════════════════════════ */
function StepReview({ data }) {
  const dirLabels = (data.directions || []).join(' & ') || '—';
  const symLabels = SYMBOLS.filter((s) => (data.symbols || []).includes(s.value)).map((s) => s.base).join(', ') || '—';
  const stratLabel = STRATEGIES.find((s) => s.value === data.strategy)?.label || '—';
  const freqLabel = FREQUENCIES.find((f) => f.value === data.frequency)?.label || '—';
  const confLabel = CONFIDENCE_LEVELS.find((c) => c.value === data.confidence)?.label || '—';
  const emaLabels = (data.ema_filters || []).length > 0
    ? data.ema_filters.map((v) => `EMA ${v}`).join(', ')
    : 'None';

  const rows = [
    { label: 'Strategy', value: stratLabel },
    { label: 'Risk Level', value: data.risk_level != null ? `${data.risk_level}%` : '—' },
    { label: 'Confidence', value: confLabel },
    { label: 'Direction', value: dirLabels },
    { label: 'Symbols', value: symLabels },
    { label: 'Timeframe', value: freqLabel },
    { label: 'Filters', value: emaLabels },
  ];

  return (
    <div>
      <div className="card-premium p-4">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between py-2.5 ${
              i < rows.length - 1 ? 'border-b border-tg-secondary/15' : ''
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
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in px-5">
      <div className="icon-gradient-green w-16 h-16 rounded-full flex items-center justify-center mb-5">
        <CheckCircle2 size={32} strokeWidth={2} className="text-white" />
      </div>
      <h2 className="text-[20px] font-bold text-tg-text mb-2">Signal Launched!</h2>
      <p className="text-[14px] text-tg-hint mb-8 max-w-[260px] leading-relaxed">
        Your signal subscription is now active. You'll receive notifications when signals are generated.
      </p>
      <button
        type="button"
        onClick={onDone}
        className="bg-tg-button text-tg-button-text text-[14px] font-semibold rounded-2xl px-8 py-3 pressable shadow-sm"
      >
        View My Signals
      </button>
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

  if (launched) {
    return <SuccessState onDone={() => navigate('/signals')} />;
  }

  /* Map step index → component */
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress bar */}
      <div className="px-5 pt-4 pb-2">
        <WizardProgress step={w.step} totalSteps={w.totalSteps} />
      </div>

      {/* Title + subtitle — unified for all steps */}
      <div className="px-5 pb-3">
        <h2 className="text-[18px] font-bold text-tg-text">{STEP_TITLES[w.step]}</h2>
        <p className="text-[13px] text-tg-hint mt-0.5">{STEP_SUBTITLES[w.step]}</p>
      </div>

      {/* Step content — unified container */}
      <div className="flex-1 px-5 pb-28 overflow-y-auto" key={w.step}>
        <div className={animClass}>
          {renderStep()}
        </div>
      </div>

      {/* Bottom nav — unified for all steps */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-tg-bg via-tg-bg to-transparent pt-8">
        <div className="flex items-center gap-3">
          {w.step > 0 && (
            <button
              type="button"
              onClick={w.prevStep}
              className="flex-1 py-3.5 rounded-2xl text-[14px] font-semibold bg-tg-secondary/60 text-tg-text pressable"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={w.isLastStep ? handleLaunch : w.nextStep}
            disabled={!w.canProceed}
            className={`flex-1 py-3.5 rounded-2xl text-[14px] font-semibold pressable shadow-sm transition-opacity duration-200 ${
              w.canProceed
                ? w.isLastStep
                  ? 'icon-gradient-green text-white'
                  : 'bg-tg-button text-tg-button-text'
                : 'bg-tg-button/40 text-tg-button-text/60 cursor-not-allowed'
            }`}
          >
            {w.isLastStep ? 'Launch Signal' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
