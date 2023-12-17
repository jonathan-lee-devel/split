import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

import {environment} from '../../../environments/environment';
import {PropertyCreateRequestDto} from '../../dtos/properties/PropertyCreateRequestDto';
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
      name: '12 Penny Lane',
      tenantEmails: ['jonathan.lee.devel@gmail.com'],
      administratorEmails: ['jonathan.lee.devel@gmail.com'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Whitshire House',
      tenantEmails: [],
      administratorEmails: ['jonathan.lee.devel@gmail.com'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: '42 Evergreen Terrace',
      tenantEmails: ['jonathan.lee.devel@gmail.com'],
      administratorEmails: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }]);
  }

  public createProperty(propertyCreateRequestDto: PropertyCreateRequestDto) {
    return this.httpClient.post<PropertyDto>(`${environment.PROPERTIES_SERVICE_BASE_URL}/`, propertyCreateRequestDto);
  }
}
