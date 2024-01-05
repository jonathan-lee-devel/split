import {createReducer, on} from '@ngrx/store';

import {CounterActions} from './counter.actions';

export const initialState: number = 0;

export type CounterState = typeof initialState;

export const counterReducer = createReducer(
    initialState,
    on(CounterActions.increment, (state): CounterState => {
      console.log(`Incrementing ${state} + 1`);
      return state + 1;
    }),
    on(CounterActions.decrement, (state): CounterState => {
      console.log(`Decrementing ${state} - 1`);
      return state - 1;
    }),
    on(CounterActions.reset, (state): CounterState => {
      console.log(`Resetting ${state} to 0`);
      return 0;
    }),
);
