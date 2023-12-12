import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

import {PropertyDto} from '../../dtos/properties/PropertyDto';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  constructor(
      private httpClient: HttpClient,
  ) { }

  public getPropertiesWhereInvolved(): Observable<PropertyDto[]> {
    return of([{
      id: '1',
      name: 'Test',
      tenantEmails: ['jonathan.lee.devel@gmail.com'],
      administratorEmails: ['jonathan.lee.devel@gmail.com'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }]);
  }
}
