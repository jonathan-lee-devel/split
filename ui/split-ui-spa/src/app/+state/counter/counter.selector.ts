import {createFeatureSelector, createSelector} from '@ngrx/store';

import {CounterState} from './counter.reducer';

export const COUNT_FEATURE_NAME = 'count';

const selectCounterState = createFeatureSelector<CounterState>(COUNT_FEATURE_NAME);

const selectCounter = createSelector(
    selectCounterState,
    (state: CounterState) => state,
);

export const CounterSelector = {
  selectCounter,
} as const;
