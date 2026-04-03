import { ChevronLeft, Rocket } from 'lucide-react';
import WizardProgress from './WizardProgress';

export default function WizardShell({
  step,
  totalSteps,
  title,
  subtitle,
  onBack,
  onNext,
  canProceed,
  isLastStep,
  direction,
  children,
}) {
  return (
    <div className="flex flex-col min-h-screen bg-tg-bg">
      {/* Top section: progress + header */}
      <div className="px-4 pt-3 pb-2">
        <WizardProgress step={step} totalSteps={totalSteps} />

        <div className="mt-4 mb-1">
          <h1 className="text-[18px] font-semibold text-tg-text leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[13px] text-tg-hint mt-1 leading-snug">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Content area with step transitions */}
      <div className="flex-1 overflow-y-auto px-4 pb-28">
        <div
          key={step}
          className={
            direction === 'forward'
              ? 'wizard-step-forward'
              : 'wizard-step-backward'
          }
        >
          {children}
        </div>
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-tg-bg/90 backdrop-blur-md border-t border-tg-secondary/30">
        <div className="flex items-center justify-between px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {/* Back button */}
          {step > 0 ? (
            <button
              type="button"
              onClick={onBack}
              className="pressable flex items-center gap-1 text-[15px] text-tg-button font-medium py-2 pr-3"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
              Back
            </button>
          ) : (
            <div />
          )}

          {/* Next / Launch button */}
          <button
            type="button"
            onClick={onNext}
            disabled={!canProceed}
            className={`pressable flex items-center gap-2 px-6 py-2.5 rounded-full text-[15px] font-semibold transition-all duration-200 ${
              isLastStep
                ? canProceed
                  ? 'icon-gradient-green text-white shadow-lg shadow-green/25'
                  : 'bg-tg-secondary/50 text-tg-hint cursor-not-allowed'
                : canProceed
                  ? 'bg-tg-button text-tg-button-text shadow-lg shadow-tg-button/25'
                  : 'bg-tg-secondary/50 text-tg-hint cursor-not-allowed'
            }`}
          >
            {isLastStep ? (
              <>
                <Rocket size={16} strokeWidth={2.5} />
                Launch
              </>
            ) : (
              'Next'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
