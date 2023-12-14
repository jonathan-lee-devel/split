import {CommonModule} from '@angular/common';
import {Component, OnInit, Signal} from '@angular/core';
import {RouterLink} from '@angular/router';

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
export class PropertiesManageComponent implements OnInit {
  properties: PropertyDto[] = [];
  currentUser: UserDto = AuthService.INITIAL_USER;
  isLoadingMap_: Signal<Map<string, boolean>>;
  readonly propertiesWhereInvolvedLoading = 'properties-where-involved-loading';

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
        .subscribe((properties) => {
          setTimeout(() => {
            this.properties = properties;
            this.loadingService.onLoadingFinished(this.propertiesWhereInvolvedLoading);
          }, 2000);
        });
  }
}
