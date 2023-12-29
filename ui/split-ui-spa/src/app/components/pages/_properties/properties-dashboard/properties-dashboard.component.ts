import {AsyncPipe, NgOptimizedImage} from '@angular/common';
import {Component, OnInit, Signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {delay, tap} from 'rxjs';

import {environment} from '../../../../../environments/environment';
import {rebaseRoutePath, rebaseRoutePathAsString, RoutePath} from '../../../../app.routes';
import {UserDto} from '../../../../dtos/auth/UserDto';
import {ExpenseDto} from '../../../../dtos/expenses/ExpenseDto';
import {initialPropertyDto, PropertyDto} from '../../../../dtos/properties/PropertyDto';
import {AuthService} from '../../../../services/auth/auth.service';
import {ExpenseService} from '../../../../services/expense/expense.service';
import {LoadingService} from '../../../../services/loading/loading.service';
import {PropertyService} from '../../../../services/property/property.service';

@Component({
  selector: 'app-properties-dashboard',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    FormsModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    RouterLink,
    AsyncPipe,
  ],
  templateUrl: './properties-dashboard.component.html',
  styleUrl: './properties-dashboard.component.scss',
})
export class PropertiesDashboardComponent implements OnInit {
  isLoadingMap_: Signal<Map<string, boolean>>;
  propertyId: string = '';
  property: PropertyDto = initialPropertyDto;
  propertyExpenses: ExpenseDto[] = [];
  combinedEmails: Set<string> = new Set<string>();
  currentUser: UserDto = AuthService.INITIAL_USER;
  protected readonly propertyDashboardByIdLoadingKey = 'property-dashboard-by-id-loading-key';
  protected readonly expensesForPropertyLoadingKey = 'expenses-for-property-loading-key';
  protected readonly RoutePath = RoutePath;
  protected readonly rebaseRoutePath = rebaseRoutePath;
  protected readonly rebaseRoutePathAsString = rebaseRoutePathAsString;
  protected readonly Router = Router;

  constructor(
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private authService: AuthService,
    private propertyService: PropertyService,
    private expenseService: ExpenseService,
  ) {
    this.isLoadingMap_ = this.loadingService.isLoadingMap_;
  }

  ngOnInit() {
    this.route.params
        .subscribe((params) => {
          this.propertyId = params['propertyId'];
          this.loadingService.onLoadingStart(this.propertyDashboardByIdLoadingKey);
          this.currentUser = this.authService.getCurrentUserInfo();
          this.propertyService.getPropertyById(this.propertyId)
              .pipe(
                  delay(environment.SIMULATED_LOADING_DELAY_MS),
                  tap((property) => {
                    this.updateCombinedEmails(property);
                  }),
              ).subscribe((property) => {
                this.property = property;
                this.loadingService.onLoadingFinished(this.propertyDashboardByIdLoadingKey);
              });
          this.loadingService.onLoadingStart(this.expensesForPropertyLoadingKey);
          this.expenseService.getExpensesForProperty(this.propertyId)
              .pipe(
                  delay(environment.SIMULATED_LOADING_DELAY_MS),
              ).subscribe((expenses) => {
                this.propertyExpenses = expenses;
                this.loadingService.onLoadingFinished(this.expensesForPropertyLoadingKey);
              });
        });
  }

  doDeleteProperty() {
    this.propertyService.openDeletePropertyDialog(this.propertyId, this.property.name);
  }

  toggleAdministrator(combinedEmail: string) {
    this.propertyService.openTogglePropertyAdminDialog(this.property, combinedEmail)
        .then((property) => {
          this.property = property;
        });
  }

  toggleTenant(combinedEmail: string) {
    this.propertyService.openTogglePropertyTenantDialog(this.property, combinedEmail)
        .then((property) => {
          this.property = property;
          this.updateCombinedEmails(this.property);
        });
  }

  doDeleteExpense(expense: ExpenseDto) {
    this.expenseService.openDeleteExpenseDialog(expense.id, expense.name)
        .then((successFlag) => {
          if (successFlag) {
            this.propertyExpenses.splice(this.propertyExpenses.indexOf(expense), 1);
          }
        });
  }

  private updateCombinedEmails(property: PropertyDto) {
    console.log(JSON.stringify(property));
    this.combinedEmails.clear();
    property.administratorEmails.forEach((administratorEmail) => {
      this.combinedEmails.add(administratorEmail);
    });
    property.tenantEmails.forEach((tenantEmails) => {
      this.combinedEmails.add(tenantEmails);
    });
  }
}
