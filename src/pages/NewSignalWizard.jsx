import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import useWizard from '../hooks/useWizard';
import WizardProgress from '../components/wizard/WizardProgress';
import StepStrategy from '../components/wizard/StepStrategy';
import StepRisk from '../components/wizard/StepRisk';
import StepConfidence from '../components/wizard/StepConfidence';
import StepDirection from '../components/wizard/StepDirection';
import StepSymbol from '../components/wizard/StepSymbol';
import StepFrequency from '../components/wizard/StepFrequency';
import StepFilters from '../components/wizard/StepFilters';
import StepReview from '../components/wizard/StepReview';

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

/* ─── Step Renderer ─── */
function renderStep(step, wizard) {
  const { data, setField, toggleArrayItem } = wizard;

  switch (step) {
    case 0:
      return (
        <StepStrategy
          value={data.strategy}
          onChange={(val) => setField('strategy', val)}
        />
      );
    case 1:
      return (
        <StepRisk
          value={data.risk_level}
          onChange={(val) => setField('risk_level', val)}
        />
      );
    case 2:
      return (
        <StepConfidence
          value={data.confidence}
          onChange={(val) => setField('confidence', val)}
        />
      );
    case 3:
      return (
        <StepDirection
          directions={data.directions}
          onToggle={(val) => toggleArrayItem('directions', val)}
        />
      );
    case 4:
      return (
        <StepSymbol
          symbols={data.symbols}
          onToggle={(val) => toggleArrayItem('symbols', val)}
          maxSymbols={null}
        />
      );
    case 5:
      return (
        <StepFrequency
          value={data.frequency}
          onChange={(val) => setField('frequency', val)}
        />
      );
    case 6:
      return (
        <StepFilters
          emaFilters={data.ema_filters}
          onToggle={(val) => toggleArrayItem('ema_filters', val)}
        />
      );
    case 7:
      return <StepReview data={data} />;
    default:
      return null;
  }
}

/* ─── Main Wizard ─── */
export default function NewSignalWizard() {
  const navigate = useNavigate();
  const wizard = useWizard();
  const [launched, setLaunched] = useState(false);

  const handleLaunch = useCallback(() => {
    setLaunched(true);
  }, []);

  if (launched) {
    return <SuccessState onDone={() => navigate('/signals')} />;
  }

  const isLastStep = wizard.step === wizard.totalSteps - 1;
  const animClass = wizard.direction === 'forward' ? 'wizard-step-forward' : 'wizard-step-backward';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress */}
      <div className="px-5 pt-4 pb-2">
        <WizardProgress step={wizard.step} totalSteps={wizard.totalSteps} />
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
          {renderStep(wizard.step, wizard)}
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
