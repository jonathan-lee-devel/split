import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {Actions, concatLatestFrom, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {catchError, EMPTY, filter, map, switchMap, tap} from 'rxjs';

import {PropertyActions} from './property.actions';
import {PropertySelector} from './property.selector';
import {environment} from '../../../../../environments/environment';
import {rebaseRoutePath, rebaseRoutePathAsString, RoutePath} from '../../../../app.routes';
import {PropertyDto} from '../../../../dtos/properties/PropertyDto';
import {PropertyService} from '../../../../services/property/property.service';
import {EntityType} from '../../../../types/entity';
import {ConfirmDeleteDialogComponent} from '../../../lib/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';

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
        concatLatestFrom(({propertyId}) => this.store.select(PropertySelector.selectLoadPropertyByIdStatus(propertyId))),
        switchMap(([{propertyId}]) => this.propertyService.deletePropertyById(propertyId)),
        map((property) => {
          this.onSuccessfulPropertyDeletion(property);
          return PropertyActions.removedPropertyById({propertyId: property.id});
        }),
    );
  });

  loadPropertiesWhereInvolved$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(PropertyActions.loadPropertiesWhereInvolved),
        switchMap(() => this.propertyService.getPropertiesWhereInvolved()),
        map((properties) => PropertyActions.loadedPropertiesWhereInvolved({properties})),
    );
  });

  getPropertiesWhereInvolved$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(PropertyActions.getPropertiesWhereInvolved),
        concatLatestFrom(() => this.store.select(PropertySelector.selectLoadPropertiesWhereInvolvedStatus())),
        filter(([, propertyLoadByIdStatus]) => propertyLoadByIdStatus !== 'LOADED'),
        map(() => PropertyActions.loadPropertiesWhereInvolved()),
    );
  });

  addProperty$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(PropertyActions.addProperty),
        switchMap(({propertyCreateRequest}) => this.propertyService.createProperty(propertyCreateRequest)),
        catchError(() => EMPTY), // Let error interceptor handle error
        map((property) => {
          this.onSuccessfulPropertyCreation(property);
          return PropertyActions.addedProperty({property});
        }),
    );
  });

  promptRemovePropertyById$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(PropertyActions.promptRemovePropertyById),
        concatLatestFrom(({property}) => this.store.select(PropertySelector.selectPropertyById(property.id))),
        tap(([{property}]) => {
          this.openConfirmDeleteDialog(property);
        }),
        map(([{property}]) => PropertyActions.promptedRemovePropertyById({property})),
    );
  });

  private readonly entityType: EntityType = 'Property';

  constructor(
    private store: Store,
    private actions$: Actions,
    private router: Router,
    private propertyService: PropertyService,
    private matSnackBar: MatSnackBar,
    private confirmDeleteDialog: MatDialog,
  ) {}

  private onSuccessfulPropertyCreation(property: PropertyDto) {
    this.matSnackBar.open(`Property with name: ${property.name} has successfully been created`, 'OK', {
      duration: environment.SNACKBAR_DURATION_MS,
    });
    this.router.navigate([rebaseRoutePathAsString(
        RoutePath.PROPERTIES_DASHBOARD_ID.replace(':propertyId', property.id))],
    ).catch((reason) => window.alert(reason));
  }

  private onSuccessfulPropertyDeletion(property: PropertyDto) {
    this.matSnackBar.open(`Property with name: ${property.name} has successfully been deleted`, 'OK', {
      duration: environment.SNACKBAR_DURATION_MS,
    });
    this.router.navigate([rebaseRoutePath(RoutePath.PROPERTIES_MANAGE)])
        .catch((reason) => window.alert(reason));
  }

  private openConfirmDeleteDialog(property: PropertyDto) {
    const dialogRef = this.confirmDeleteDialog.open(ConfirmDeleteDialogComponent, {
      disableClose: true,
      enterAnimationDuration: 500,
    });
    dialogRef.componentInstance.entityType = this.entityType;
    dialogRef.componentInstance.entityId = property.id;
    dialogRef.componentInstance.entityName = property.name;
  }
}
