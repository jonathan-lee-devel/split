import {createReducer, on} from '@ngrx/store';

import {ExpenseActions} from './expense.actions';
import {ExpenseDto, initialExpenseDto} from '../../../../../dtos/expenses/ExpenseDto';
import {LoadStatus} from '../../../../../types/load-status';

export interface ExpenseState {
  expense: ExpenseDto,
  getExpenseByIdLoadStatus: LoadStatus,
  expensesForProperty: ExpenseDto[],
  getExpensesForPropertyLoadStatus: LoadStatus,
}

export const initialState: ExpenseState = {
  expense: initialExpenseDto,
  getExpenseByIdLoadStatus: 'NOT_LOADED',
  expensesForProperty: [],
  getExpensesForPropertyLoadStatus: 'NOT_LOADED',
};

export const expenseReducer = createReducer(
    initialState,
    on(ExpenseActions.getExpensesForProperty, (state): ExpenseState => {
      return {...state};
    }),
    on(ExpenseActions.loadExpensesForProperty, (state): ExpenseState => {
      return {...state, getExpensesForPropertyLoadStatus: 'LOADING'};
    }),
    on(ExpenseActions.loadedExpensesForProperty, (state, {expenses}): ExpenseState => {
      return {...state, expensesForProperty: expenses, getExpensesForPropertyLoadStatus: 'LOADED'};
    }),
);
