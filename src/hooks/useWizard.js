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

  Edit-from-review mode (new):
  - When the user taps Edit on the Review screen we set editingFromStep
    to the review step (9) and snapshot the data so Cancel can restore.
  - While editingFromStep != null, the button bar shows Save/Cancel
    instead of Back/Continue, and "Save" jumps straight back to Review
    rather than walking the user through every subsequent step.
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
    time_range_months: undefined,
    directions: [],
    symbols: [],
    frequency: null,
    ema_filters: [],
  },
  editingFromStep: null,   // set when entering edit mode from review
  editingSnapshot: null,   // {...data} before edit; restored by cancel
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
    case 'ENTER_EDIT':
      // Snapshot current data so Cancel can restore. fromStep is where
      // we'll return to after Save/Cancel (typically Review = 9).
      if (action.targetStep < 0 || action.targetStep >= TOTAL_STEPS) return state;
      return {
        ...state,
        editingFromStep: action.fromStep,
        editingSnapshot: { ...state.data },
        step: action.targetStep,
        animDir: action.targetStep < state.step ? 'backward' : 'forward',
      };
    case 'SAVE_EDIT': {
      // Return to the step the user came from, keep current data.
      if (state.editingFromStep === null) return state;
      const target = state.editingFromStep;
      return {
        ...state,
        editingFromStep: null,
        editingSnapshot: null,
        step: target,
        animDir: target < state.step ? 'backward' : 'forward',
      };
    }
    case 'CANCEL_EDIT': {
      // Restore the snapshot, return to the step the user came from.
      if (state.editingFromStep === null) return state;
      const target = state.editingFromStep;
      return {
        ...state,
        data: state.editingSnapshot || state.data,
        editingFromStep: null,
        editingSnapshot: null,
        step: target,
        animDir: target < state.step ? 'backward' : 'forward',
      };
    }
    case 'LOAD_TEMPLATE':
      return {
        ...state,
        step: TOTAL_STEPS - 1,
        animDir: 'forward',
        data: { ...initialState.data, ...action.data },
        editingFromStep: null,
        editingSnapshot: null,
      };
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
    case 4: return data.time_range_months !== undefined;
    case 5: return data.directions.length > 0;
    case 6: return data.symbols.length > 0;
    case 7: return data.frequency !== null;
    case 8: return true;
    case 9: return true;
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
  const enterEdit = useCallback(
    (targetStep, fromStep) => dispatch({ type: 'ENTER_EDIT', targetStep, fromStep }),
    [],
  );
  const saveEdit = useCallback(() => dispatch({ type: 'SAVE_EDIT' }), []);
  const cancelEdit = useCallback(() => dispatch({ type: 'CANCEL_EDIT' }), []);
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
    editingFromStep: state.editingFromStep,
    isEditing: state.editingFromStep !== null,
    setField,
    toggleArray,
    nextStep,
    prevStep,
    goToStep,
    enterEdit,
    saveEdit,
    cancelEdit,
    loadTemplate,
    canProceed,
    isLastStep: state.step === TOTAL_STEPS - 1,
    reset,
  };
}
