import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {environment} from '../../../environments/environment';
import {CreateExpenseRequestDto} from '../../dtos/expenses/CreateExpenseRequestDto';
import {ExpenseDto} from '../../dtos/expenses/ExpenseDto';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  constructor(private httpClient: HttpClient) { }

  public createExpense(createExpenseRequestDto: CreateExpenseRequestDto): Observable<ExpenseDto> {
    return this.httpClient.post<ExpenseDto>(`${environment.EXPENSES_SERVICE_BASE_URL}/`, {...createExpenseRequestDto});
  }
}
