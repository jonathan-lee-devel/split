import {createReducer, on} from '@ngrx/store';

import {decrement, increment, reset} from './counter.actions';

export const initialState = 0;

export const counterReducer = createReducer(
    initialState,
    on(increment, (state): number => {
      console.log(`Incrementing ${state} + 1`);
      return state + 1;
    }),
    on(decrement, (state): number => {
      console.log(`Decrementing ${state} - 1`);
      return state - 1;
    }),
    on(reset, (state): number => {
      console.log(`Resetting ${state} to 0`);
      return 0;
    }),
);
