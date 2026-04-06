import { useReducer, useMemo, useCallback } from 'react';

/*
  Step order:
  0 — Strategy (single select)
  1 — Risk Level (single select)
  2 — Confidence (single select)
  3 — Direction (multi: LONG, SHORT, or both)
  4 — Symbols (multi-select)
  5 — Timeframe / Frequency (single select)
  6 — Filters / EMA (multi-select, optional)
  7 — Review & Launch
*/

const TOTAL_STEPS = 8;

const initialState = {
  step: 0,
  animDir: 'forward',
  data: {
    strategy: null,
    risk_level: null,
    confidence: null,
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
    case 'RESET':
      return { ...initialState, data: { ...initialState.data, directions: [], symbols: [], ema_filters: [] } };
    default:
      return state;
  }
}

function canProceedForStep(step, data) {
  switch (step) {
    case 0: return data.strategy !== null;
    case 1: return data.risk_level !== null;
    case 2: return data.confidence !== null;
    case 3: return data.directions.length > 0;
    case 4: return data.symbols.length > 0;
    case 5: return data.frequency !== null;
    case 6: return true; // filters optional
    case 7: return true; // review
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
    canProceed,
    isLastStep: state.step === TOTAL_STEPS - 1,
    reset,
  };
}
