import {NgOptimizedImage} from '@angular/common';
import {Component, OnInit, Signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {delay} from 'rxjs';

import {environment} from '../../../../../environments/environment';
import {rebaseRoutePath, rebaseRoutePathAsString, RoutePath} from '../../../../app.routes';
import {PropertyDto} from '../../../../dtos/properties/PropertyDto';
import {LoadingService} from '../../../../services/loading/loading.service';
import {PropertyService} from '../../../../services/property/property.service';

@Component({
  selector: 'app-properties-invite-tenants',
  standalone: true,
  imports: [
    FormsModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    RouterLink,
    MatProgressSpinnerModule,
  ],
  templateUrl: './properties-invite-tenants.component.html',
  styleUrl: './properties-invite-tenants.component.scss',
})
export class PropertiesInviteTenantsComponent implements OnInit {
  isLoadingMap_: Signal<Map<string, boolean>>;
  property: PropertyDto | undefined;
  propertyId: string = '';
  email: string = '';
  protected readonly rebaseRoutePath = rebaseRoutePath;
  protected readonly RoutePath = RoutePath;
  protected readonly rebaseRoutePathAsString = rebaseRoutePathAsString;
  protected readonly propertyDashboardInviteTenantsLoadingKey: string = 'property-dashboard-invite-tenants';
  protected readonly isTenantInviteLoadingKey: string = 'is-tenant-invite-loading-key';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private propertyService: PropertyService,
    private matSnackBar: MatSnackBar,
  ) {
    this.isLoadingMap_ = this.loadingService.isLoadingMap_;
  }

  ngOnInit() {
    this.route.params
        .subscribe((params) => {
          this.propertyId = params['propertyId'];
          this.loadingService.onLoadingStart(this.propertyDashboardInviteTenantsLoadingKey);
          this.propertyService.getPropertyById(this.propertyId)
              .pipe(
                  delay(environment.SIMULATED_LOADING_DELAY_MS),
              ).subscribe((property) => {
                this.property = property;
                this.loadingService.onLoadingFinished(this.propertyDashboardInviteTenantsLoadingKey);
              });
        },
        );
  }

  doInviteTenant() {
    this.loadingService.onLoadingStart(this.isTenantInviteLoadingKey);
    this.propertyService.inviteTenantToProperty(this.propertyId, this.email)
        .pipe(
            delay(environment.SIMULATED_LOADING_DELAY_MS),
        ).subscribe((property) => {
          this.matSnackBar.open(`Successfully invited: ${this.email} to property: ${property.name}!`, 'Ok', {
            duration: environment.SNACKBAR_DURATION_MS,
          });
          this.loadingService.onLoadingFinished(this.isTenantInviteLoadingKey);
          this.router.navigate([rebaseRoutePathAsString(RoutePath.PROPERTIES_DASHBOARD_ID.replace(':propertyId', property.id))])
              .catch((reason) => window.alert(reason));
        });
  }
}
