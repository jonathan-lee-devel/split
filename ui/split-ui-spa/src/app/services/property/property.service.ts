import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

import {environment} from '../../../environments/environment';
import {rebaseRoutePath, rebaseRoutePathAsString, RoutePath} from '../../app.routes';
import {ConfirmActionDialogComponent} from '../../components/lib/dialogs/confirm-action-dialog/confirm-action-dialog.component';
import {ConfirmDeleteDialogComponent} from '../../components/lib/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import {PropertyCreateRequestDto} from '../../dtos/properties/PropertyCreateRequestDto';
import {PropertyDto} from '../../dtos/properties/PropertyDto';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private readonly entityType = 'Property';

  constructor(
    private httpClient: HttpClient,
    private confirmDeleteDialog: MatDialog,
    private confirmActionDialog: MatDialog,
    private router: Router,
    private matSnackBar: MatSnackBar,
  ) {}

  public getPropertyById(propertyId: string): Observable<PropertyDto> {
    return this.httpClient.get<PropertyDto>(`${environment.PROPERTIES_SERVICE_BASE_URL}/id/${propertyId}`);
  }

  public getPropertiesWhereInvolved(): Observable<PropertyDto[]> {
    return this.httpClient.get<PropertyDto[]>(`${environment.PROPERTIES_SERVICE_BASE_URL}/where-involved`);
  }

  public createProperty(propertyCreateRequestDto: PropertyCreateRequestDto) {
    return this.httpClient.post<PropertyDto>(`${environment.PROPERTIES_SERVICE_BASE_URL}/`, propertyCreateRequestDto);
  }

  public deletePropertyById(propertyId: string): Observable<PropertyDto> {
    return this.httpClient.delete<PropertyDto>(`${environment.PROPERTIES_SERVICE_BASE_URL}/id/${propertyId}`);
  }

  public togglePropertyAdministratorStatus(propertyId: string, emailToToggle: string): Observable<PropertyDto> {
    return this.httpClient.patch<PropertyDto>(`${environment.PROPERTIES_SERVICE_BASE_URL}/id/${propertyId}/toggle-property-admin`, {emailToToggle});
  }

  public openDeletePropertyDialog(propertyId: string, propertyName: string) {
    const dialogRef = this.confirmDeleteDialog.open(ConfirmDeleteDialogComponent, {
      disableClose: false,
      enterAnimationDuration: 500,
    });
    dialogRef.componentInstance.entityType = this.entityType;
    dialogRef.componentInstance.entityId = propertyId;
    dialogRef.componentInstance.entityName = propertyName;
    dialogRef.componentInstance.onConfirmCallback = (propertyId) => {
      this.deletePropertyById(propertyId)
          .subscribe((property) => {
            this.router.navigate([rebaseRoutePath(RoutePath.PROPERTIES_MANAGE)]).catch((reason) => window.alert(reason));
            this.matSnackBar.open(`Property: ${property.name} deleted successfully!`, 'Ok', {
              duration: 5000,
            });
          });
    };
  }

  openTogglePropertyAdminDialog(propertyId: string, propertyName: string, combinedEmail: string) {
    const dialogRef = this.confirmActionDialog.open(ConfirmActionDialogComponent, {
      disableClose: false,
      enterAnimationDuration: 500,
    });
    dialogRef.componentInstance.entityId = propertyId;
    dialogRef.componentInstance.prompt = `Are you sure you want to toggle ${combinedEmail} administrator status for property: ${propertyName}?`;
    dialogRef.componentInstance.data = {emailToToggle: combinedEmail};
    dialogRef.componentInstance.onConfirmCallback = (propertyId, data: unknown) => {
      // @ts-expect-error emailToToggle is known in this case to be a part of the data
      this.togglePropertyAdministratorStatus(propertyId, (data && data.emailToToggle) ? data.emailToToggle : '')
          .subscribe((property) => {
            this.router.navigate([rebaseRoutePathAsString(RoutePath.PROPERTIES_DASHBOARD_ID.replace(':propertyId', property.id))]).catch((reason) => window.alert(reason));
            location.reload(); // Refresh to reflect changes
            // @ts-expect-error emailToToggle is known in this case to be a part of the data
            this.matSnackBar.open(`Property: ${property.name} has toggled administrator status for: ${data.emailToToggle}`, 'Ok', {
              duration: 5000,
            });
          });
    };
  }
}
