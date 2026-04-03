import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Coins, TrendingUp, TrendingDown, Clock, BarChart3, SlidersHorizontal, Gauge, Target, Eye, Rocket } from 'lucide-react';
import useWizard from '../hooks/useWizard';
import WizardProgress from '../components/wizard/WizardProgress';
import OptionCard from '../components/wizard/OptionCard';
import {
  SYMBOLS,
  DIRECTIONS,
  FREQUENCIES,
  STRATEGIES,
  EMA_FILTERS,
  RISK_LEVELS,
  CONFIDENCE_LEVELS,
  PROBABILITY_LEVELS,
} from '../utils/constants';

const STEP_TITLES = [
  'Select Symbols',
  'Choose Direction',
  'Update Frequency',
  'Strategy',
  'Filters',
  'Risk Level',
  'Confidence',
  'Min Probability',
  'Review & Launch',
];

/* ─── Step: Symbols (multi-select) ─── */
function StepSymbol({ data, setField }) {
  function toggleSymbol(val) {
    const current = data.symbols || [];
    if (current.includes(val)) {
      setField('symbols', current.filter((s) => s !== val));
    } else {
      setField('symbols', [...current, val]);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-[13px] text-tg-hint mb-3">Choose one or more trading pairs</p>
      {SYMBOLS.map((sym) => (
        <OptionCard
          key={sym.value}
          icon={Coins}
          title={sym.label}
          description={sym.name}
          selected={(data.symbols || []).includes(sym.value)}
          onClick={() => toggleSymbol(sym.value)}
          color="blue"
        />
      ))}
    </div>
  );
}

/* ─── Step: Direction ─── */
function StepDirection({ data, setField }) {
  return (
    <div className="space-y-2">
      <p className="text-[13px] text-tg-hint mb-3">Select your trade direction</p>
      {DIRECTIONS.map((dir) => (
        <OptionCard
          key={dir.value}
          icon={dir.value === 'LONG' ? TrendingUp : TrendingDown}
          title={dir.label}
          description={dir.description}
          selected={data.direction === dir.value}
          onClick={() => setField('direction', dir.value)}
          color={dir.value === 'LONG' ? 'green' : 'red'}
        />
      ))}
    </div>
  );
}

/* ─── Step: Frequency ─── */
function StepFrequency({ data, setField }) {
  return (
    <div className="space-y-2">
      <p className="text-[13px] text-tg-hint mb-3">How often should signals be generated?</p>
      {FREQUENCIES.map((freq) => (
        <OptionCard
          key={freq.value}
          icon={Clock}
          title={freq.label}
          selected={data.frequency === freq.value}
          onClick={() => setField('frequency', freq.value)}
          color="blue"
        />
      ))}
    </div>
  );
}

/* ─── Step: Strategy ─── */
function StepStrategy({ data, setField }) {
  return (
    <div className="space-y-2">
      <p className="text-[13px] text-tg-hint mb-3">Select a signal strategy</p>
      {STRATEGIES.map((strat) => (
        <OptionCard
          key={strat.value}
          icon={BarChart3}
          title={strat.label}
          description={strat.description}
          selected={data.strategy === strat.value}
          onClick={() => setField('strategy', strat.value)}
          color="violet"
        />
      ))}
    </div>
  );
}

/* ─── Step: Filters (EMA) ─── */
function StepFilters({ data, setField }) {
  return (
    <div className="space-y-2">
      <p className="text-[13px] text-tg-hint mb-3">Optional trend filter (EMA period)</p>
      {EMA_FILTERS.map((ema) => (
        <OptionCard
          key={String(ema.value)}
          icon={SlidersHorizontal}
          title={ema.label}
          selected={data.ema_filter === ema.value}
          onClick={() => setField('ema_filter', ema.value)}
          color="yellow"
        />
      ))}
    </div>
  );
}

/* ─── Step: Risk Level ─── */
function StepRisk({ data, setField }) {
  return (
    <div className="space-y-2">
      <p className="text-[13px] text-tg-hint mb-3">Maximum risk per trade (%)</p>
      {RISK_LEVELS.map((level) => (
        <OptionCard
          key={level}
          icon={Gauge}
          title={`${level}%`}
          description={level <= 5 ? 'Conservative' : level <= 15 ? 'Moderate' : 'Aggressive'}
          selected={data.risk_level === level}
          onClick={() => setField('risk_level', level)}
          color={level <= 5 ? 'green' : level <= 15 ? 'yellow' : 'red'}
        />
      ))}
    </div>
  );
}

/* ─── Step: Confidence ─── */
function StepConfidence({ data, setField }) {
  return (
    <div className="space-y-2">
      <p className="text-[13px] text-tg-hint mb-3">Minimum confidence threshold for signals</p>
      {CONFIDENCE_LEVELS.map((conf) => (
        <OptionCard
          key={conf.value}
          icon={Target}
          title={conf.label}
          description={conf.value >= 0.7 ? 'Higher quality, fewer signals' : conf.value >= 0.6 ? 'Balanced quality and volume' : 'More signals, lower threshold'}
          selected={data.confidence === conf.value}
          onClick={() => setField('confidence', conf.value)}
          color="blue"
        />
      ))}
    </div>
  );
}

/* ─── Step: Probability ─── */
function StepProbability({ data, setField }) {
  return (
    <div className="space-y-2">
      <p className="text-[13px] text-tg-hint mb-3">Minimum trade probability from historical matching</p>
      {PROBABILITY_LEVELS.map((prob) => (
        <OptionCard
          key={prob.value}
          icon={Target}
          title={prob.label}
          description={prob.value >= 0.9 ? 'Very selective, fewest signals' : prob.value >= 0.75 ? 'Good balance of quality and frequency' : 'More signals generated'}
          selected={data.min_probability === prob.value}
          onClick={() => setField('min_probability', prob.value)}
          color="violet"
        />
      ))}
    </div>
  );
}

/* ─── Step: Review ─── */
function StepReview({ data }) {
  const selectedSymbols = SYMBOLS.filter((s) => (data.symbols || []).includes(s.value));
  const direction = DIRECTIONS.find((d) => d.value === data.direction);
  const frequency = FREQUENCIES.find((f) => f.value === data.frequency);
  const strategy = STRATEGIES.find((s) => s.value === data.strategy);
  const emaFilter = EMA_FILTERS.find((e) => e.value === data.ema_filter);
  const confidence = CONFIDENCE_LEVELS.find((c) => c.value === data.confidence);
  const probability = PROBABILITY_LEVELS.find((p) => p.value === data.min_probability);

  const rows = [
    { label: 'Symbols', value: selectedSymbols.map((s) => s.label).join(', ') || '--' },
    { label: 'Direction', value: direction?.label || '--' },
    { label: 'Frequency', value: frequency?.label || '--' },
    { label: 'Strategy', value: strategy?.label || '--' },
    { label: 'EMA Filter', value: emaFilter?.label || 'None' },
    { label: 'Risk Level', value: data.risk_level != null ? `${data.risk_level}%` : '--' },
    { label: 'Confidence', value: confidence?.label || '--' },
    { label: 'Probability', value: probability?.label || '--' },
  ];

  return (
    <div>
      <p className="text-[13px] text-tg-hint mb-4">Review your signal subscription settings</p>
      <div className="card-premium-sm p-4 space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-[13px] text-tg-hint">{row.label}</span>
            <span className="text-[13px] font-medium text-tg-text">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Success State ─── */
function SuccessState({ onDone }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="icon-gradient-green w-16 h-16 rounded-full flex items-center justify-center mb-5">
        <CheckCircle2 size={32} strokeWidth={2} className="text-white" />
      </div>
      <h2 className="text-[20px] font-bold text-tg-text mb-2">Signal Launched!</h2>
      <p className="text-[14px] text-tg-hint mb-8 max-w-[260px] leading-relaxed">
        Your signal subscription is now active. You will receive notifications when new signals are generated.
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

/* ─── Main Wizard ─── */
export default function NewSignalWizard() {
  const navigate = useNavigate();
  const wizard = useWizard();
  const [launched, setLaunched] = useState(false);

  const stepComponents = [
    StepSymbol,
    StepDirection,
    StepFrequency,
    StepStrategy,
    StepFilters,
    StepRisk,
    StepConfidence,
    StepProbability,
    StepReview,
  ];

  const handleLaunch = useCallback(() => {
    setLaunched(true);
  }, []);

  if (launched) {
    return <SuccessState onDone={() => navigate('/signals')} />;
  }

  const StepComponent = stepComponents[wizard.step];
  const isLastStep = wizard.step === stepComponents.length - 1;
  const animClass = wizard.direction === 'forward' ? 'wizard-step-forward' : 'wizard-step-backward';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress */}
      <div className="px-5 pt-4 pb-2">
        <WizardProgress step={wizard.step} totalSteps={stepComponents.length} />
      </div>

      {/* Step title */}
      <div className="px-5 pb-3">
        <h2 className="text-[18px] font-bold text-tg-text">
          {STEP_TITLES[wizard.step] || `Step ${wizard.step + 1}`}
        </h2>
      </div>

      {/* Step content */}
      <div className="flex-1 px-5 pb-28 overflow-y-auto" key={wizard.step}>
        <div className={animClass}>
          <StepComponent data={wizard.data} setField={wizard.setField} />
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-tg-bg via-tg-bg to-transparent pt-8">
        <div className="flex items-center gap-3">
          {wizard.step > 0 && (
            <button
              type="button"
              onClick={wizard.prevStep}
              className="flex-1 py-3.5 rounded-2xl text-[14px] font-semibold bg-tg-secondary/60 text-tg-text pressable"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={isLastStep ? handleLaunch : wizard.nextStep}
            disabled={!wizard.canProceed}
            className={`flex-1 py-3.5 rounded-2xl text-[14px] font-semibold pressable shadow-sm transition-opacity duration-200 ${
              wizard.canProceed
                ? 'bg-tg-button text-tg-button-text'
                : 'bg-tg-button/40 text-tg-button-text/60 cursor-not-allowed'
            }`}
          >
            {isLastStep ? 'Launch Signal' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
