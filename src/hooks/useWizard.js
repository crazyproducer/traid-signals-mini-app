import { useReducer, useMemo, useCallback } from 'react';

/*
  Step order (Phase 4 — 10 steps total):
  0 — Strategy        (single select)
  1 — Risk level      (single select; stop-loss size %)
  2 — Min trades      (single select; statistical significance threshold)
  3 — Min win rate    (single select; historical win-rate threshold)
  4 — Time range      (single select; lookback for stats + matching window)
  5 — Direction       (multi: LONG / SHORT)
  6 — Symbols         (multi-select)
  7 — Frequency       (single select)
  8 — EMA filters     (multi-select, optional)
  9 — Review & Launch

  Versus prior 8-step model: split 'confidence' into 'min_trades' +
  'min_win_rate' (two explicit thresholds rather than one fuzzy knob),
  and added 'time_range_months' as a recency filter on stats + matcher.
*/

const TOTAL_STEPS = 10;

const initialState = {
  step: 0,
  animDir: 'forward',
  data: {
    strategy: null,
    risk_level: null,
    min_trade_count: null,
    min_win_rate: null,
    time_range_months: undefined,   // distinct from null which is a valid choice ("All time")
    directions: [],
    symbols: [],
    frequency: null,
    ema_filters: [],
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, data: { ...state.data, [action.key]: action.value } };
    case 'TOGGLE_IN_ARRAY': {
      const arr = state.data[action.key] || [];
      const exists = arr.includes(action.value);
      const next = exists ? arr.filter((v) => v !== action.value) : [...arr, action.value];
      return { ...state, data: { ...state.data, [action.key]: next } };
    }
    case 'NEXT_STEP':
      if (state.step >= TOTAL_STEPS - 1) return state;
      return { ...state, step: state.step + 1, animDir: 'forward' };
    case 'PREV_STEP':
      if (state.step <= 0) return state;
      return { ...state, step: state.step - 1, animDir: 'backward' };
    case 'GO_TO_STEP':
      if (action.step < 0 || action.step >= TOTAL_STEPS) return state;
      return { ...state, step: action.step, animDir: action.step < state.step ? 'backward' : 'forward' };
    case 'LOAD_TEMPLATE':
      return { ...state, step: TOTAL_STEPS - 1, animDir: 'forward', data: { ...initialState.data, ...action.data } };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

function canProceedForStep(step, data) {
  switch (step) {
    case 0: return data.strategy !== null;
    case 1: return data.risk_level !== null;
    case 2: return data.min_trade_count !== null;
    case 3: return data.min_win_rate !== null;
    case 4: return data.time_range_months !== undefined;  // null = "All time" is valid
    case 5: return data.directions.length > 0;
    case 6: return data.symbols.length > 0;
    case 7: return data.frequency !== null;
    case 8: return true;   // EMA filters optional
    case 9: return true;   // Review
    default: return false;
  }
}

export default function useWizard() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setField = useCallback((key, value) => {
    dispatch({ type: 'SET_FIELD', key, value });
  }, []);

  const toggleArray = useCallback((key, value) => {
    dispatch({ type: 'TOGGLE_IN_ARRAY', key, value });
  }, []);

  const nextStep = useCallback(() => dispatch({ type: 'NEXT_STEP' }), []);
  const prevStep = useCallback(() => dispatch({ type: 'PREV_STEP' }), []);
  const goToStep = useCallback((step) => dispatch({ type: 'GO_TO_STEP', step }), []);
  const loadTemplate = useCallback((data) => dispatch({ type: 'LOAD_TEMPLATE', data }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  const canProceed = useMemo(
    () => canProceedForStep(state.step, state.data),
    [state.step, state.data],
  );

  return {
    step: state.step,
    totalSteps: TOTAL_STEPS,
    data: state.data,
    animDir: state.animDir,
    setField,
    toggleArray,
    nextStep,
    prevStep,
    goToStep,
    loadTemplate,
    canProceed,
    isLastStep: state.step === TOTAL_STEPS - 1,
    reset,
  };
}
