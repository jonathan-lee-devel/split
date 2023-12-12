import {CommonModule} from '@angular/common';
import {afterRender, AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';

import {UserDto} from '../../../../dtos/auth/UserDto';
import {PropertyDto} from '../../../../dtos/properties/PropertyDto';
import {AuthService} from '../../../../services/auth/auth.service';
import {LoadingService} from '../../../../services/loading/loading.service';
import {PropertyService} from '../../../../services/property/property.service';
import {SyncService} from '../../../../services/sync/sync.service';
import {LoadingSpinnerComponent} from '../../../lib/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-properties-manage',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, RouterLink],
  templateUrl: './properties-manage.component.html',
  styleUrl: './properties-manage.component.scss',
})
export class PropertiesManageComponent implements OnInit, AfterViewInit {
  properties: PropertyDto[] = [];
  currentUser: UserDto = AuthService.INITIAL_USER;
  isLoadingMap = new Map<string, boolean>();
  readonly propertiesWhereInvolvedLoading = 'properties-where-involved-loading';

  constructor(
      private syncService: SyncService,
      private changeDetector: ChangeDetectorRef,
      private loadingService: LoadingService,
      private authService: AuthService,
      private propertyService: PropertyService,
  ) {
    this.loadingService.isLoadingMapObservable()
        .subscribe((isLoadingMap) => {
          this.isLoadingMap = isLoadingMap;
        });
    afterRender(() => {

    });
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

  ngAfterViewInit() {
    this.syncService.sync();
    this.changeDetector.detectChanges();
  }
}
