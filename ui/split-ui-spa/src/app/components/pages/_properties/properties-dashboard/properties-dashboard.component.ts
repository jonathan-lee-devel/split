import {NgOptimizedImage} from '@angular/common';
import {Component, OnInit, Signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ActivatedRoute, RouterLink} from '@angular/router';

import {rebaseRoutePath, RoutePath} from '../../../../app.routes';
import {initialPropertyDto, PropertyDto} from '../../../../dtos/properties/PropertyDto';
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
  ],
  templateUrl: './properties-dashboard.component.html',
  styleUrl: './properties-dashboard.component.scss',
})
export class PropertiesDashboardComponent implements OnInit {
  isLoadingMap_: Signal<Map<string, boolean>>;
  propertyId: string = '';
  property: PropertyDto = initialPropertyDto;
  readonly propertyDashboardByIdLoadingKey = 'property-dashboard-by-id-loading-key';
  protected readonly RoutePath = RoutePath;
  protected readonly rebaseRoutePath = rebaseRoutePath;

  constructor(
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private propertyService: PropertyService,
  ) {
    this.isLoadingMap_ = this.loadingService.isLoadingMap_;
  }

  ngOnInit() {
    this.route.params
        .subscribe((params) => {
          this.propertyId = params['propertyId'];
          this.loadingService.onLoadingStart(this.propertyDashboardByIdLoadingKey);
          this.propertyService.getPropertyById(this.propertyId)
              .subscribe((property) => {
                setTimeout(() => {
                  this.property = property;
                  this.loadingService.onLoadingFinished(this.propertyDashboardByIdLoadingKey);
                }, 1000);
              });
        });
  }

  doDeleteProperty() {
    this.propertyService.openDeletePropertyDialog(this.propertyId, this.property.name);
  }
}
