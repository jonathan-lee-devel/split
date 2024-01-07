import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {RouterLink} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import {PropertyActions} from '../+state/property.actions';
import {PropertySelector} from '../+state/property.selector';
import {rebaseRoutePath, rebaseRoutePathAsString, RoutePath} from '../../../../app.routes';
import {UserDto} from '../../../../dtos/auth/UserDto';
import {PropertyDto} from '../../../../dtos/properties/PropertyDto';
import {AuthService} from '../../../../services/auth/auth.service';
import {LoadStatus} from '../../../../types/load-status';
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
  properties$: Observable<PropertyDto[]>;
  propertiesLoadingState$: Observable<LoadStatus>;
  currentUser: UserDto;
  protected readonly rebaseRoutePath = rebaseRoutePath;
  protected readonly RoutePath = RoutePath;
  protected readonly rebaseRoutePathAsString = rebaseRoutePathAsString;

  constructor(
    private store: Store,
    private authService: AuthService,
  ) {
    this.properties$ = this.store.select(PropertySelector.selectPropertiesWhereInvolved());
    this.propertiesLoadingState$ = this.store.select(PropertySelector.selectLoadPropertiesWhereInvolvedStatus());
    this.currentUser = this.authService.getCurrentUserInfo();
  }

  ngOnInit() {
    this.store.dispatch(PropertyActions.getPropertiesWhereInvolved());
  }
}
