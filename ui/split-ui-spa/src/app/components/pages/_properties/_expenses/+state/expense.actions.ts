import {createAction, props} from '@ngrx/store';

import {ExpenseDto} from '../../../../../dtos/expenses/ExpenseDto';

const getExpenseById = createAction('[Expense] Get by ID', props<{expenseId: string}>());
const loadExpenseById = createAction('[Expense] Load by ID', props<{expenseId: string}>());
const loadedExpenseById = createAction('[Expense] Loaded by ID', props<{expense: ExpenseDto}>());

const getExpensesForProperty = createAction('[Expense] Get for Property', props<{propertyId: string}>());
const loadExpensesForProperty = createAction('[Expense] Load for Property', props<{propertyId: string}>());
const loadedExpensesForProperty = createAction('[Expense] Loaded for Property', props<{expenses: ExpenseDto[]}>());

const removeExpenseById = createAction('[Expense] Remove by ID', props<{expenseId: string}>());

export const ExpenseActions = {
  getExpenseById,
  loadExpenseById,
  loadedExpenseById,
  getExpensesForProperty,
  loadExpensesForProperty,
  loadedExpensesForProperty,
  removeExpenseById,
} as const;
