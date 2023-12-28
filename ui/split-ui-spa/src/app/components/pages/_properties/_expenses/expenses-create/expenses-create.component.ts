import {NgOptimizedImage} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';

import {environment} from '../../../../../../environments/environment';
import {rebaseRoutePathAsString, RoutePath} from '../../../../../app.routes';
import {ExpenseService} from '../../../../../services/expense/expense.service';
import {Currency, CURRENCY_CODES} from '../../../../../types/currency';

@Component({
  selector: 'app-expenses-create',
  standalone: true,
  imports: [
    FormsModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './expenses-create.component.html',
  styleUrl: './expenses-create.component.scss',
})
export class ExpensesCreateComponent implements OnInit {
  propertyId: string = '';
  name: string = '';
  amount: number = 0.00;
  currencyCode: Currency = 'EUR';

  validCurrencies = CURRENCY_CODES;

  constructor(
    private route: ActivatedRoute,
    private expenseService: ExpenseService,
    private router: Router,
    private matSnackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.propertyId = params['propertyId'];
    });
  }

  doCreateExpense() {
    this.expenseService.createExpense({
      propertyId: this.propertyId,
      name: this.name,
      amount: this.amount,
      currencyCode: this.currencyCode,
    }).subscribe((expense) => {
      this.router.navigate([rebaseRoutePathAsString(RoutePath.PROPERTIES_DASHBOARD_ID.replace(':propertyId', expense.propertyId))])
          .catch((reason) => window.alert(reason));
      this.matSnackBar.open(`Expense: ${expense.name} created successfully!`, 'Ok', {
        duration: environment.SNACKBAR_DURATION_MS,
      });
    });
  }
}
