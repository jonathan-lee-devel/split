import {createFeatureSelector, createSelector} from '@ngrx/store';

import {CounterState} from './counter.reducer';

export const selectCounterState = createFeatureSelector<CounterState>('count');

export const selectCounter = createSelector(
    selectCounterState,
    (state: CounterState) => state,
);
