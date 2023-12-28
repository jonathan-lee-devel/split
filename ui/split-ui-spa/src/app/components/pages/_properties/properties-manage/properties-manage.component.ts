import {CommonModule} from '@angular/common';
import {Component, OnInit, Signal} from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {RouterLink} from '@angular/router';
import {delay} from 'rxjs';

import {environment} from '../../../../../environments/environment';
import {rebaseRoutePath, rebaseRoutePathAsString, RoutePath} from '../../../../app.routes';
import {UserDto} from '../../../../dtos/auth/UserDto';
import {PropertyDto} from '../../../../dtos/properties/PropertyDto';
import {AuthService} from '../../../../services/auth/auth.service';
import {LoadingService} from '../../../../services/loading/loading.service';
import {PropertyService} from '../../../../services/property/property.service';
import {CardWithLinkComponent} from '../../../lib/card-with-link/card-with-link.component';
import {LoadingSpinnerComponent} from '../../../lib/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-properties-manage',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, RouterLink, CardWithLinkComponent, MatProgressSpinnerModule],
  templateUrl: './properties-manage.component.html',
  styleUrl: './properties-manage.component.scss',
})
export class PropertiesManageComponent implements OnInit {
  properties: PropertyDto[] = [];
  currentUser: UserDto = AuthService.INITIAL_USER;
  isLoadingMap_: Signal<Map<string, boolean>>;
  readonly propertiesWhereInvolvedLoading = 'properties-where-involved-loading';
  protected readonly rebaseRoutePath = rebaseRoutePath;
  protected readonly RoutePath = RoutePath;
  protected readonly rebaseRoutePathAsString = rebaseRoutePathAsString;

  constructor(
    private loadingService: LoadingService,
    private authService: AuthService,
    private propertyService: PropertyService,
  ) {
    this.isLoadingMap_ = this.loadingService.isLoadingMap_;
  }

  ngOnInit() {
    this.loadingService.onLoadingStart(this.propertiesWhereInvolvedLoading);
    this.currentUser = this.authService.getCurrentUserInfo();
    this.propertyService.getPropertiesWhereInvolved()
        .pipe(
            delay(environment.SIMULATED_LOADING_DELAY_MS),
        ).subscribe((properties) => {
          this.properties = properties
              .sort((property, otherProperty) => {
                if (property.administratorEmails.includes(this.currentUser.email) &&
                    property.tenantEmails.includes(this.currentUser.email) &&
                    !otherProperty.administratorEmails.includes(this.currentUser.email)) {
                  return 2;
                }

                if (property.administratorEmails.includes(this.currentUser.email) &&
                !otherProperty.administratorEmails.includes(this.currentUser.email)) {
                  return 1;
                }

                if (otherProperty.administratorEmails.includes(this.currentUser.email) &&
                otherProperty.tenantEmails.includes(this.currentUser.email) &&
                !property.tenantEmails.includes(this.currentUser.email)) {
                  return -1;
                }

                return 0;
              });
          this.loadingService.onLoadingFinished(this.propertiesWhereInvolvedLoading);
        });
  }
}
