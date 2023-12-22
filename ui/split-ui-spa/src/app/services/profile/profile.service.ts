import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {environment} from '../../../environments/environment';
import {UserDto} from '../../dtos/auth/UserDto';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private httpClient: HttpClient) { }

  getUserInfo() {
    return this.httpClient.get<UserDto>(`${environment.USERS_SERVICE_BASE_URL}/profile`);
  }
}
