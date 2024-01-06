import {AsyncPipe, NgIf, NgOptimizedImage} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable, of, tap} from 'rxjs';

import {PropertyActions} from '../+state/property.actions';
import {PropertySelector} from '../+state/property.selector';
import {rebaseRoutePath, rebaseRoutePathAsString, RoutePath} from '../../../../app.routes';
import {UserDto} from '../../../../dtos/auth/UserDto';
import {ExpenseDto} from '../../../../dtos/expenses/ExpenseDto';
import {initialPropertyDto, PropertyDto} from '../../../../dtos/properties/PropertyDto';
import {AuthService} from '../../../../services/auth/auth.service';
import {LoadStatus} from '../../../../types/load-status';
import {ExpenseActions} from '../_expenses/+state/expense.actions';
import {ExpenseSelector} from '../_expenses/+state/expense.selector';

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
    NgIf,
  ],
  templateUrl: './properties-dashboard.component.html',
  styleUrl: './properties-dashboard.component.scss',
})
export class PropertiesDashboardComponent implements OnInit {
  property$: Observable<PropertyDto | null> = of(initialPropertyDto);
  propertyLoadStatus$: Observable<LoadStatus> = of('LOADING' as LoadStatus);
  expenses$: Observable<ExpenseDto[] | null> = of([]);
  expensesLoadStatus$: Observable<LoadStatus> = of('LOADING' as LoadStatus);
  propertyId: string = '';
  combinedEmails: Set<string> = new Set<string>();
  currentUser: UserDto = AuthService.INITIAL_USER;
  protected readonly propertyDashboardByIdLoadingKey = 'property-dashboard-by-id-loading-key';
  protected readonly expensesForPropertyLoadingKey = 'expenses-for-property-loading-key';
  protected readonly RoutePath = RoutePath;
  protected readonly rebaseRoutePath = rebaseRoutePath;
  protected readonly rebaseRoutePathAsString = rebaseRoutePathAsString;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {
    this.property$ = this.store.select(PropertySelector.selectPropertyById);
    this.propertyLoadStatus$ = this.store.select(PropertySelector.selectLoadPropertyByIdStatus);
    this.property$.pipe(
        tap((property) => (property) ? this.updateCombinedEmails(property): undefined),
    ).subscribe(); // Unsubscribed by component async pipe
    this.expenses$ = this.store.select(ExpenseSelector.selectExpensesForProperty);
    this.expensesLoadStatus$ = this.store.select(ExpenseSelector.selectLoadExpensesForPropertyStatus);
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUserInfo();
    this.route.params
        .subscribe((params) => {
          this.propertyId = params['propertyId'];
          [PropertyActions.getPropertyById({propertyId: this.propertyId}),
            ExpenseActions.getExpensesForProperty({propertyId: this.propertyId})]
              .forEach((action) => this.store.dispatch(action));
        });
  }
  /* eslint-disable @typescript-eslint/no-unused-vars */
  doDeleteProperty(property: PropertyDto) {
    // this.propertyService.openDeletePropertyDialog(this.propertyId, property.name);
    // TODO: Refactor to use actions
  }

  async toggleAdministrator(property: PropertyDto, combinedEmail: string) {
    // await this.propertyService.openTogglePropertyAdminDialog(property, combinedEmail);
    // TODO: Refactor to use actions
  }

  async toggleTenant(property: PropertyDto, combinedEmail: string) {
    // await this.propertyService.openTogglePropertyTenantDialog(property, combinedEmail);
    // TODO: Refactor to use actions
  }

  async doDeleteExpense(expense: ExpenseDto) {
    // await this.expenseService.openDeleteExpenseDialog(expense.id, expense.name);
    // TODO: Refactor to use actions
  }

  private updateCombinedEmails(property: PropertyDto) {
    this.combinedEmails.clear();
    property.administratorEmails.forEach((administratorEmail) => {
      this.combinedEmails.add(administratorEmail);
    });
    property.tenantEmails.forEach((tenantEmails) => {
      this.combinedEmails.add(tenantEmails);
    });
  }
}
