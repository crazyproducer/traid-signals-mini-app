import { useReducer, useMemo, useCallback } from 'react';

const STEPS = [
  'symbol',
  'direction',
  'frequency',
  'strategy',
  'filters',
  'risk',
  'confidence',
  'probability',
  'preview',
  'review',
];

const TOTAL_STEPS = STEPS.length;

const initialState = {
  step: 0,
  direction: 'forward',
  data: {
    symbols: [],
    direction: null,
    frequency: null,
    strategy: null,
    ema_filter: null,
    risk_level: null,
    confidence: null,
    min_probability: null,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        data: { ...state.data, [action.key]: action.value },
      };
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
      return { ...initialState, data: { ...initialState.data } };
    default:
      return state;
  }
}

function canProceedForStep(step, data) {
  switch (step) {
    case 0:
      return data.symbols.length > 0;
    case 1:
      return data.direction !== null;
    case 2:
      return data.frequency !== null;
    case 3:
      return data.strategy !== null;
    case 4:
      return true;
    case 5:
      return data.risk_level !== null;
    case 6:
      return data.confidence !== null;
    case 7:
      return data.min_probability !== null;
    case 8:
    case 9:
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
    nextStep,
    prevStep,
    canProceed,
    isLastStep: state.step === TOTAL_STEPS - 1,
    isPreview: state.step === 8,
    isReview: state.step === 9,
    reset,
  };
}
