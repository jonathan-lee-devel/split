import {createAction} from '@ngrx/store';

const increment = createAction('[Counter Component] Increment');
const decrement = createAction('[Counter Component] Decrement');
const reset = createAction('[Counter Component] Reset');

export const CounterActions = {
  increment,
  decrement,
  reset,
} as const;
