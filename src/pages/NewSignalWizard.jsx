import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CheckCircle2, BarChart3, Gauge, Target, Trophy,
  TrendingUp, TrendingDown, Coins, Clock, SlidersHorizontal, Rocket, Pencil,
  CalendarDays, BarChart, Percent,
} from 'lucide-react';
import useWizard from '../hooks/useWizard';
import WizardProgress from '../components/wizard/WizardProgress';
import OptionCard from '../components/wizard/OptionCard';
import PaywallSheet from '../components/shared/PaywallSheet';
import {
  STRATEGIES, RISK_LEVELS, MIN_TRADES, MIN_WIN_RATES, TIME_RANGES,
  DIRECTIONS, SYMBOLS, FREQUENCIES, EMA_FILTERS,
} from '../utils/constants';
import { createConfig, getSubscription } from '../api/signals';

/* ═══════════════════════════════════════════════
   Step titles & subtitles (Phase 4 — 10 steps)
   ═══════════════════════════════════════════════ */
const STEP_TITLES = [
  'Strategy', 'Risk level', 'Min trades', 'Min win rate', 'Time range',
  'Direction', 'Symbols', 'Frequency', 'Filters', 'Review',
];

const STEP_SUBTITLES = [
  'Choose a signal strategy',
  'Set stop-loss distance',
  'Statistical significance threshold',
  'Historical win-rate threshold',
  'Lookback window for stats',
  'Choose trade direction',
  'Select trading pairs',
  'How often you receive signals',
  'Optional EMA trend filters',
  'Review your signal configuration',
];

/* ═══════════════════════════════════════════════
   Step components
   ═══════════════════════════════════════════════ */

/* Single-select step components accept `setSingle(key, value)`, which
 * sets the field AND triggers auto-advance (or auto-save in edit mode)
 * via the wizard handler bound in the parent. multi=false on OptionCard
 * renders as a radio button.
 *
 * Multi-select step components keep using `toggleArray` directly and
 * pass multi=true to OptionCard (rounded-square checkbox style). No
 * auto-advance — user explicitly hits Continue when they've picked all
 * the options they want.
 */

function StepStrategy({ data, setSingle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {STRATEGIES.map((s) => (
        <OptionCard
          key={s.value}
          icon={BarChart3}
          title={s.label}
          description={s.description}
          selected={data.strategy === s.value}
          onClick={() => setSingle('strategy', s.value)}
          color="violet"
        />
      ))}
      <p className="text-[11px] text-tg-hint/40 text-center pt-2 uppercase tracking-widest font-medium">
        More strategies coming soon
      </p>
    </div>
  );
}

function StepRisk({ data, setSingle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {RISK_LEVELS.map((r) => (
        <OptionCard
          key={r.value}
          icon={Gauge}
          title={r.label}
          description={r.description}
          selected={data.risk_level === r.value}
          onClick={() => setSingle('risk_level', r.value)}
          color={r.value <= 5 ? 'green' : r.value <= 10 ? 'blue' : r.value <= 20 ? 'yellow' : 'red'}
        />
      ))}
    </div>
  );
}

function StepMinTrades({ data, setSingle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {MIN_TRADES.map((m) => (
        <OptionCard
          key={m.value}
          icon={BarChart}
          title={m.label}
          description={m.description}
          selected={data.min_trade_count === m.value}
          onClick={() => setSingle('min_trade_count', m.value)}
          color="blue"
        />
      ))}
    </div>
  );
}

function StepMinWinRate({ data, setSingle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {MIN_WIN_RATES.map((w) => (
        <OptionCard
          key={w.value}
          icon={Percent}
          title={w.label}
          description={w.description}
          selected={data.min_win_rate === w.value}
          onClick={() => setSingle('min_win_rate', w.value)}
          color="green"
        />
      ))}
    </div>
  );
}

function StepTimeRange({ data, setSingle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {TIME_RANGES.map((t) => (
        <OptionCard
          key={String(t.value)}
          icon={CalendarDays}
          title={t.label}
          description={t.description}
          selected={data.time_range_months === t.value}
          onClick={() => setSingle('time_range_months', t.value)}
          color="violet"
        />
      ))}
    </div>
  );
}

function StepDirection({ data, toggleArray }) {
  const selected = data.directions || [];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {DIRECTIONS.map((d) => (
        <OptionCard
          key={d.value}
          icon={d.value === 'LONG' ? TrendingUp : TrendingDown}
          title={d.label}
          description={d.description}
          selected={selected.includes(d.value === 'LONG' ? 'BUY' : 'SELL')}
          onClick={() => toggleArray('directions', d.value === 'LONG' ? 'BUY' : 'SELL')}
          color={d.value === 'LONG' ? 'green' : 'red'}
          multi
        />
      ))}
    </div>
  );
}

function StepSymbol({ data, toggleArray, subscription, onPaywall }) {
  const selected = data.symbols || [];
  const limit = subscription?.symbols_limit ?? null;
  const atLimit = limit && selected.length >= limit;

  function handleClick(sym) {
    if (!selected.includes(sym) && atLimit) {
      onPaywall();
      return;
    }
    toggleArray('symbols', sym);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {selected.length > 0 && (
        <p className="text-[11px] font-mono text-tg-hint/50 text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {selected.length}{limit ? `/${limit}` : ''} selected
        </p>
      )}
      {SYMBOLS.map((sym) => (
        <OptionCard
          key={sym.value}
          icon={Coins}
          title={sym.label}
          description={sym.name}
          selected={selected.includes(sym.value)}
          onClick={() => handleClick(sym.value)}
          color="blue"
          multi
        />
      ))}
    </div>
  );
}

function StepFrequency({ data, setSingle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {FREQUENCIES.map((f) => (
        <OptionCard
          key={f.value}
          icon={Clock}
          title={f.label}
          description={f.description}
          selected={data.frequency === f.value}
          onClick={() => setSingle('frequency', f.value)}
          color="blue"
        />
      ))}
    </div>
  );
}

function StepFilters({ data, toggleArray }) {
  const selected = data.ema_filters || [];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {EMA_FILTERS.map((f) => (
        <OptionCard
          key={f.value}
          icon={SlidersHorizontal}
          title={f.label}
          description={f.description}
          selected={selected.includes(f.value)}
          onClick={() => toggleArray('ema_filters', f.value)}
          color="yellow"
          multi
        />
      ))}
      <p className="text-[11px] text-tg-hint/40 text-center pt-1 uppercase tracking-widest font-medium">
        {selected.length === 0 ? 'No filter — all combos included' : `${selected.length} filter${selected.length > 1 ? 's' : ''} active`}
      </p>
    </div>
  );
}

function StepReview({ data, onEdit }) {
  const dirLabels = (data.directions || []).map((d) => d === 'BUY' ? 'Long' : 'Short').join(' & ') || '--';
  const stratLabel = STRATEGIES.find((s) => s.value === data.strategy)?.label || '--';
  const freqLabel = FREQUENCIES.find((f) => f.value === data.frequency)?.label || '--';
  const minTradesLabel = MIN_TRADES.find((m) => m.value === data.min_trade_count)?.label || '--';
  const minWrLabel = MIN_WIN_RATES.find((w) => w.value === data.min_win_rate)?.label || '--';
  const timeRangeLabel = TIME_RANGES.find((t) => t.value === data.time_range_months)?.label || '--';

  const MAX_SHOW = 3;
  const selectedSyms = SYMBOLS.filter((s) => (data.symbols || []).includes(s.value)).map((s) => s.base);
  const symLabels = selectedSyms.length === 0 ? '--'
    : selectedSyms.length <= MAX_SHOW ? selectedSyms.join(', ')
    : selectedSyms.slice(0, MAX_SHOW).join(', ') + ` +${selectedSyms.length - MAX_SHOW} more`;

  const selectedEma = data.ema_filters || [];
  const emaLabels = selectedEma.length === 0 ? 'None'
    : selectedEma.map((v) => `EMA ${v}`).join(', ');

  const items = [
    { label: 'Strategy', value: stratLabel, step: 0 },
    { label: 'Risk level', value: data.risk_level != null ? `${data.risk_level}%` : '--', step: 1 },
    { label: 'Min trades', value: minTradesLabel, step: 2 },
    { label: 'Min win rate', value: minWrLabel, step: 3 },
    { label: 'Time range', value: timeRangeLabel, step: 4 },
    { label: 'Direction', value: dirLabels, step: 5 },
    { label: 'Symbols', value: symLabels, step: 6 },
    { label: 'Timeframe', value: freqLabel, step: 7 },
    { label: 'Filters', value: emaLabels, step: 8 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.map((item) => (
        <div key={item.label} className="card w-full text-left flex items-center" style={{ padding: '14px 16px' }}>
          <div style={{ flex: 1 }}>
            <span className="text-[9px] uppercase font-medium text-tg-hint block" style={{ letterSpacing: '0.04em' }}>
              {item.label}
            </span>
            <span className="text-[15px] font-semibold text-tg-text block" style={{ marginTop: '2px' }}>
              {item.value}
            </span>
          </div>
          <button type="button" onClick={() => onEdit(item.step)} className="pressable flex items-center justify-center" style={{ flexShrink: 0, padding: '8px', marginRight: '-8px', borderRadius: '6px' }}>
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
function SuccessState({ onDone }) {
  return (
    <div className="flex flex-col items-center justify-center text-center page-padding" style={{ minHeight: '100dvh' }}>
      <div style={{ position: 'relative', marginBottom: '28px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px -4px rgba(5, 150, 105, 0.35)' }}>
          <CheckCircle2 size={40} strokeWidth={1.8} className="text-white" />
        </div>
        <div className="live-dot" style={{ position: 'absolute', inset: '-6px', borderRadius: '46px', border: '2px solid rgba(5, 150, 105, 0.2)' }} />
      </div>
      <h2 className="text-[24px] font-bold text-tg-text" style={{ letterSpacing: '-0.03em', marginBottom: '8px' }}>Signal launched</h2>
      <p className="text-[14px] text-tg-hint" style={{ marginBottom: '32px', maxWidth: '280px', lineHeight: '1.6' }}>
        Your signal subscription is now active. You will receive notifications when new signals are generated.
      </p>
      <button type="button" onClick={onDone} className="btn pressable w-full" style={{ backgroundColor: 'var(--tg-theme-button-color, #2481cc)', color: 'var(--tg-theme-button-text-color, #fff)' }}>
        View my signals
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Main Wizard

   Note: the "matching records" hero count (live preview-count) was
   removed pending further design. The /api/signals/preview-count
   endpoint is still live on the gateway and previewCount() is still
   exported from api/signals.js — just no UI consumer right now.
   ═══════════════════════════════════════════════ */
export default function NewSignalWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const w = useWizard();
  const [launched, setLaunched] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [launchError, setLaunchError] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [subscription, setSubscription] = useState(null);

  // Load subscription once for symbol quota
  useEffect(() => {
    getSubscription().then(setSubscription).catch(() => setSubscription(null));
  }, []);

  // Apply template data if passed via navigation
  useEffect(() => {
    if (location.state?.template) {
      const t = location.state.template;
      w.loadTemplate({
        strategy: t.strategies?.[0] || 'pullback',
        risk_level: t.risk_level,
        min_trade_count: t.min_trade_count ?? 30,
        min_win_rate: t.min_win_rate ?? 0.66,
        time_range_months: t.time_range_months ?? null,
        directions: t.directions || [],
        symbols: t.symbols || [],
        frequency: t.frequency,
        ema_filters: t.ema_filters || [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Single-select setter — sets the field AND auto-advances. In edit mode,
  // auto-advance means "save and return to review" (which is the right
  // gesture: one tap = one change committed). Otherwise: walks the
  // wizard forward to the next step.
  const setSingle = useCallback((key, value) => {
    w.setField(key, value);
    setTimeout(() => {
      if (w.isEditing) {
        w.saveEdit();
      } else {
        w.nextStep();
      }
    }, 180);   // small delay so user sees the selection register visually
  }, [w]);

  const handleLaunch = useCallback(async () => {
    setLaunchError(null);
    setLaunching(true);
    try {
      const payload = {
        name: `${(w.data.symbols[0] || 'BTC')} ${(w.data.directions[0] === 'BUY' ? 'Long' : 'Short')} ${w.data.frequency}`,
        strategy: w.data.strategy,
        risk_level: w.data.risk_level,
        min_trade_count: w.data.min_trade_count,
        min_win_rate: w.data.min_win_rate,
        time_range_months: w.data.time_range_months,
        signal_sides: w.data.directions,
        symbols: w.data.symbols,
        timeframe: w.data.frequency === '24h' ? '1DAY' : '4HOUR',
        ema_filters: w.data.ema_filters,
      };
      await createConfig(payload);
      setLaunched(true);
    } catch (e) {
      setLaunchError(e?.message || 'Failed to launch — please try again');
    } finally {
      setLaunching(false);
    }
  }, [w.data]);

  if (launched) {
    return <SuccessState onDone={() => navigate('/signals')} />;
  }

  function renderStep() {
    switch (w.step) {
      case 0: return <StepStrategy   data={w.data} setSingle={setSingle} />;
      case 1: return <StepRisk       data={w.data} setSingle={setSingle} />;
      case 2: return <StepMinTrades  data={w.data} setSingle={setSingle} />;
      case 3: return <StepMinWinRate data={w.data} setSingle={setSingle} />;
      case 4: return <StepTimeRange  data={w.data} setSingle={setSingle} />;
      case 5: return <StepDirection  data={w.data} toggleArray={w.toggleArray} />;
      case 6: return <StepSymbol     data={w.data} toggleArray={w.toggleArray}
                                     subscription={subscription} onPaywall={() => setShowPaywall(true)} />;
      case 7: return <StepFrequency  data={w.data} setSingle={setSingle} />;
      case 8: return <StepFilters    data={w.data} toggleArray={w.toggleArray} />;
      case 9: return <StepReview     data={w.data}
                                     onEdit={(targetStep) => w.enterEdit(targetStep, w.step)} />;
      default: return null;
    }
  }

  const animClass = w.animDir === 'forward' ? 'wizard-step-forward' : 'wizard-step-backward';

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <div className="page-padding" style={{ paddingTop: '16px', paddingBottom: '12px' }}>
        <WizardProgress
          step={w.step}
          totalSteps={w.totalSteps}
          title={STEP_TITLES[w.step]}
          subtitle={STEP_SUBTITLES[w.step]}
        />
      </div>

      <div className="flex-1 page-padding overflow-y-auto hide-scrollbar" style={{ paddingBottom: '120px' }} key={w.step}>
        <div className={animClass}>{renderStep()}</div>
        {launchError && (
          <p className="text-[12px] text-red text-center" style={{ marginTop: '12px' }}>{launchError}</p>
        )}
      </div>

      <div className="page-padding" style={{ position: 'fixed', bottom: '70px', left: 0, right: 0, paddingBottom: '16px', paddingTop: '16px', background: 'linear-gradient(to top, var(--tg-theme-bg-color, #fff) 60%, transparent)' }}>
        {/* Edit-from-review mode: Save / Cancel commit just this field
            and bounce back to Review; no walking through the rest of
            the wizard. Save is disabled if the field isn't valid (so
            the user can't accidentally save an unselected radio). */}
        {w.isEditing ? (
          <div className="flex items-center gap-3">
            <button type="button" onClick={w.cancelEdit} className="btn flex-1 bg-tg-secondary/60 text-tg-text pressable">
              Cancel
            </button>
            <button
              type="button"
              onClick={w.saveEdit}
              disabled={!w.canProceed}
              className={`btn flex-1 pressable transition-all duration-200 ${
                w.canProceed
                  ? 'bg-tg-button text-tg-button-text shadow-[0_4px_14px_-2px] shadow-tg-button/30'
                  : 'bg-tg-secondary/40 text-tg-hint/50 cursor-not-allowed'
              }`}
            >
              Save
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {w.step > 0 && (
              <button type="button" onClick={w.prevStep} className="btn flex-1 bg-tg-secondary/60 text-tg-text pressable">Back</button>
            )}
            <button
              type="button"
              onClick={w.isLastStep ? handleLaunch : w.nextStep}
              disabled={!w.canProceed || launching}
              className={`btn flex-1 pressable transition-all duration-200 ${
                w.canProceed && !launching
                  ? w.isLastStep
                    ? 'icon-gradient-green text-white'
                    : 'bg-tg-button text-tg-button-text shadow-[0_4px_14px_-2px] shadow-tg-button/30'
                  : 'bg-tg-secondary/40 text-tg-hint/50 cursor-not-allowed'
              }`}
            >
              {launching ? 'Launching…' : (w.isLastStep ? 'Launch signal' : 'Continue')}
            </button>
          </div>
        )}
      </div>

      {showPaywall && (
        <PaywallSheet
          reason={`Plan allows ${subscription?.symbols_limit ?? '?'} symbol(s). Upgrade for more.`}
          onClose={() => setShowPaywall(false)}
        />
      )}
    </div>
  );
}
