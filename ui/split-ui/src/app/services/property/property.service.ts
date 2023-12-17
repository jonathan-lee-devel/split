import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

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
    return this.httpClient.get<PropertyDto[]>(`${environment.PROPERTIES_SERVICE_BASE_URL}/where-involved`);
  }

  public createProperty(propertyCreateRequestDto: PropertyCreateRequestDto) {
    return this.httpClient.post<PropertyDto>(`${environment.PROPERTIES_SERVICE_BASE_URL}/`, propertyCreateRequestDto);
  }
}
