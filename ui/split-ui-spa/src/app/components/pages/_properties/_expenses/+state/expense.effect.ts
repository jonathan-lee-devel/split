import {Injectable} from '@angular/core';
import {Actions, concatLatestFrom, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {filter, map, switchMap} from 'rxjs';

import {ExpenseActions} from './expense.actions';
import {ExpenseSelector} from './expense.selector';
import {ExpenseService} from '../../../../../services/expense/expense.service';

@Injectable()
export class ExpenseEffects {
  loadPropertyById$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(ExpenseActions.loadExpensesForProperty),
        switchMap(({propertyId}) => this.expenseService.getExpensesForProperty(propertyId)),
        map((expenses) => ExpenseActions.loadedExpensesForProperty({expenses})),
    );
  });

  getPropertyById$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(ExpenseActions.getExpensesForProperty),
        concatLatestFrom(() => this.store.select(ExpenseSelector.selectLoadExpensesForPropertyStatus)),
        filter(([, propertyLoadByIdStatus]) => propertyLoadByIdStatus === 'NOT_LOADED'),
        map(([{propertyId}]) => ExpenseActions.loadExpensesForProperty({propertyId})),
    );
  });

  constructor(
    private store: Store,
    private actions$: Actions,
    private expenseService: ExpenseService,
  ) {}
}
