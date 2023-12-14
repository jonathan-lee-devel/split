import {CommonModule} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {skipWhile, Subscription} from 'rxjs';

import {UserDto} from '../../../../dtos/auth/UserDto';
import {PropertyDto} from '../../../../dtos/properties/PropertyDto';
import {AuthService} from '../../../../services/auth/auth.service';
import {LoadingService} from '../../../../services/loading/loading.service';
import {PropertyService} from '../../../../services/property/property.service';
import {LoadingSpinnerComponent} from '../../../lib/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-properties-manage',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, RouterLink],
  templateUrl: './properties-manage.component.html',
  styleUrl: './properties-manage.component.scss',
})
export class PropertiesManageComponent implements OnInit, OnDestroy {
  properties: PropertyDto[] = [];
  currentUser: UserDto = AuthService.INITIAL_USER;
  isLoadingMap = new Map<string, boolean>();
  readonly propertiesWhereInvolvedLoading = 'properties-where-involved-loading';
  private isLoadingMapSubscription: Subscription | undefined;

  constructor(
      private loadingService: LoadingService,
      private authService: AuthService,
      private propertyService: PropertyService,
  ) {}

  ngOnInit() {
    this.isLoadingMapSubscription = this.loadingService.isLoadingMap$
        .pipe(
            skipWhile((loadingMap) =>
              loadingMap.get(this.propertiesWhereInvolvedLoading) !== this.isLoadingMap.get(this.propertiesWhereInvolvedLoading),
            ),
        )
        .subscribe((isLoadingMap) => {
          this.isLoadingMap = isLoadingMap;
        });
    this.loadingService.onLoadingStart(this.propertiesWhereInvolvedLoading);
    this.currentUser = this.authService.getCurrentUserInfo();
    this.propertyService.getPropertiesWhereInvolved()
        .subscribe((properties) => {
          setTimeout(() => {
            this.properties = properties;
            this.loadingService.onLoadingFinished(this.propertiesWhereInvolvedLoading);
          }, 2000);
        });
  }

  ngOnDestroy() {
    this.isLoadingMapSubscription?.unsubscribe();
  }
}
