import {Injectable} from '@angular/core';
import {Actions, concatLatestFrom, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {filter, map, switchMap} from 'rxjs';

import {PropertyActions} from './property.actions';
import {PropertySelector} from './property.selector';
import {initialPropertyDto} from '../../../../dtos/properties/PropertyDto';
import {PropertyService} from '../../../../services/property/property.service';

@Injectable()
export class PropertyEffects {
  loadPropertyById$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(PropertyActions.loadPropertyById),
        switchMap(({propertyId}) => this.propertyService.getPropertyById(propertyId)),
        map((property) => PropertyActions.loadedPropertyById({property})),
    );
  });

  getPropertyById$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(PropertyActions.getPropertyById),
        concatLatestFrom(({propertyId}) => this.store.select(PropertySelector.selectLoadPropertyByIdStatus(propertyId))),
        filter(([, propertyLoadByIdStatus]) => propertyLoadByIdStatus === 'NOT_LOADED'),
        map(([{propertyId}]) => PropertyActions.loadPropertyById({propertyId})),
    );
  });

  removePropertyById$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(PropertyActions.removePropertyById),
        switchMap(({propertyId, property}) => this.propertyService.openDeletePropertyDialog(propertyId, property)),
        filter((propertyResult) => propertyResult !== null),
        // Filtered on null result so only removed invoked if confirmed
        map((property) => PropertyActions.removedPropertyById({property: (property) ? property : initialPropertyDto})),
    );
  });

  constructor(
    private store: Store,
    private actions$: Actions,
    private propertyService: PropertyService,
  ) {}
}
