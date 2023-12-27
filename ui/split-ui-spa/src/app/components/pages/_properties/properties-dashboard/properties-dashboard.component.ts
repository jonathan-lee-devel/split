import {AsyncPipe, NgOptimizedImage} from '@angular/common';
import {Component, OnInit, Signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {delay, tap} from 'rxjs';

import {rebaseRoutePath, rebaseRoutePathAsString, RoutePath} from '../../../../app.routes';
import {UserDto} from '../../../../dtos/auth/UserDto';
import {initialPropertyDto, PropertyDto} from '../../../../dtos/properties/PropertyDto';
import {AuthService} from '../../../../services/auth/auth.service';
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
  combinedEmails: Set<string> = new Set<string>();
  currentUser: UserDto = AuthService.INITIAL_USER;
  readonly propertyDashboardByIdLoadingKey = 'property-dashboard-by-id-loading-key';
  protected readonly RoutePath = RoutePath;
  protected readonly rebaseRoutePath = rebaseRoutePath;
  protected readonly rebaseRoutePathAsString = rebaseRoutePathAsString;
  protected readonly Router = Router;

  constructor(
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private authService: AuthService,
    private propertyService: PropertyService,
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
                  delay(1000),
                  tap((property) => {
                    this.updateCombinedEmails(property);
                  }),
              ).subscribe((property) => {
                this.property = property;
                this.loadingService.onLoadingFinished(this.propertyDashboardByIdLoadingKey);
              });
        },
        );
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
