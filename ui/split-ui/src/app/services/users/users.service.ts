import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {TokenHoldDto} from '../../dtos/users/TokenHoldDto';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(
    private httpClient: HttpClient,
  ) { }

  public getTokenFromTokenCode(tokenCode: string) {
    return this.httpClient.post<TokenHoldDto>(`${environment.USERS_SERVICE_BASE_URL}/token-code`, {tokenCode});
  }
}
