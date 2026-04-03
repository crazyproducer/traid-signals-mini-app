import { useReducer, useMemo, useCallback } from 'react';

const TOTAL_STEPS = 8;

const initialState = {
  step: 0,
  direction: 'forward',
  data: {
    strategy: null,        // Step 0: 'pullback'
    risk_level: null,      // Step 1: 1|5|10|20|30
    confidence: null,      // Step 2: 0.5|0.6|0.7
    directions: [],        // Step 3: ['LONG'] or ['SHORT'] or ['LONG','SHORT']
    symbols: [],           // Step 4: ['BTCUSDT', ...]
    frequency: null,       // Step 5: '4h'|'24h'
    ema_filters: [],       // Step 6: [20, 50] or []
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        data: { ...state.data, [action.key]: action.value },
      };
    case 'SET_ARRAY_TOGGLE': {
      const current = state.data[action.key] || [];
      const exists = current.includes(action.value);
      const updated = exists
        ? current.filter((item) => item !== action.value)
        : [...current, action.value];
      return {
        ...state,
        data: { ...state.data, [action.key]: updated },
      };
    }
    case 'NEXT_STEP':
      if (state.step >= TOTAL_STEPS - 1) return state;
      return {
        ...state,
        step: state.step + 1,
        direction: 'forward',
      };
    case 'PREV_STEP':
      if (state.step <= 0) return state;
      return {
        ...state,
        step: state.step - 1,
        direction: 'backward',
      };
    case 'RESET':
      return { ...initialState, data: { ...initialState.data, directions: [], symbols: [], ema_filters: [] } };
    default:
      return state;
  }
}

function canProceedForStep(step, data) {
  switch (step) {
    case 0: // Strategy
      return data.strategy !== null;
    case 1: // Risk Level
      return data.risk_level !== null;
    case 2: // Confidence
      return data.confidence !== null;
    case 3: // Direction (multi-select, at least one)
      return data.directions.length > 0;
    case 4: // Symbols (multi-select, at least one)
      return data.symbols.length > 0;
    case 5: // Frequency/Timeframe
      return data.frequency !== null;
    case 6: // Filters (optional)
      return true;
    case 7: // Review
      return true;
    default:
      return false;
  }
}

export default function useWizard() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setField = useCallback((key, value) => {
    dispatch({ type: 'SET_FIELD', key, value });
  }, []);

  const toggleArrayItem = useCallback((key, value) => {
    dispatch({ type: 'SET_ARRAY_TOGGLE', key, value });
  }, []);

  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' });
  }, []);

  const prevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const canProceed = useMemo(
    () => canProceedForStep(state.step, state.data),
    [state.step, state.data],
  );

  return {
    step: state.step,
    totalSteps: TOTAL_STEPS,
    data: state.data,
    direction: state.direction,
    setField,
    toggleArrayItem,
    nextStep,
    prevStep,
    canProceed,
    isLastStep: state.step === TOTAL_STEPS - 1,
    isReview: state.step === TOTAL_STEPS - 1,
    reset,
  };
}
