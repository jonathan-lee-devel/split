import {createFeatureSelector, createSelector} from '@ngrx/store';

import {ExpenseState} from './expense.reducer';


export const EXPENSE_FEATURE_NAME = 'expense';

const selectExpenseState = createFeatureSelector<ExpenseState>(EXPENSE_FEATURE_NAME);

const selectLoadExpensesForPropertyStatus = createSelector(selectExpenseState,
    (state: ExpenseState) => state.getExpensesForPropertyLoadStatus);

const selectExpensesForProperty = createSelector(
    selectExpenseState,
    (state: ExpenseState) => state.expensesForProperty,
);

export const ExpenseSelector = {
  selectLoadExpensesForPropertyStatus,
  selectExpensesForProperty,
} as const;
