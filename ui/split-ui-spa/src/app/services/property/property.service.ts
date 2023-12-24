import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

import {environment} from '../../../environments/environment';
import {rebaseRoutePath, RoutePath} from '../../app.routes';
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
}
