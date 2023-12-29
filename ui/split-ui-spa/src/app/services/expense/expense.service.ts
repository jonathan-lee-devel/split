import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

import {environment} from '../../../environments/environment';
import {rebaseRoutePathAsString, RoutePath} from '../../app.routes';
import {ConfirmDeleteDialogComponent} from '../../components/lib/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import {CreateExpenseRequestDto} from '../../dtos/expenses/CreateExpenseRequestDto';
import {ExpenseDto} from '../../dtos/expenses/ExpenseDto';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private readonly entityType = 'Expense';
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private confirmDeleteDialog: MatDialog,
    private matSnackBar: MatSnackBar,
  ) { }

  public createExpense(createExpenseRequestDto: CreateExpenseRequestDto): Observable<ExpenseDto> {
    return this.httpClient.post<ExpenseDto>(`${environment.EXPENSES_SERVICE_BASE_URL}/`, {...createExpenseRequestDto});
  }

  public getExpensesForProperty(propertyId: string): Observable<ExpenseDto[]> {
    return this.httpClient.get<ExpenseDto[]>(`${environment.EXPENSES_SERVICE_BASE_URL}/for-property/${propertyId}`);
  }

  public async openDeleteExpenseDialog(expenseId: string, expenseName: string) {
    return new Promise<boolean>((resolve) => {
      const dialogRef = this.confirmDeleteDialog.open(ConfirmDeleteDialogComponent, {
        disableClose: false,
        enterAnimationDuration: 500,
      });
      dialogRef.componentInstance.entityType = this.entityType;
      dialogRef.componentInstance.entityId = expenseId;
      dialogRef.componentInstance.entityName = expenseName;
      dialogRef.componentInstance.onConfirmCallback = (expenseId) => {
        this.deleteExpenseById(expenseId)
            .subscribe((expense) => {
              this.router.navigate([rebaseRoutePathAsString(RoutePath.PROPERTIES_DASHBOARD_ID
                  .replace(':propertyId', expense.propertyId))])
                  .catch((reason) => window.alert(reason));
              resolve(true);
              this.matSnackBar.open(`Expense: ${expense.name} deleted successfully!`, 'Ok', {
                duration: environment.SNACKBAR_DURATION_MS,
              });
            });
      };
    });
  }

  private deleteExpenseById(expenseId: string): Observable<ExpenseDto> {
    return this.httpClient.delete<ExpenseDto>(`${environment.EXPENSES_SERVICE_BASE_URL}/id/${expenseId}`);
  }
}
