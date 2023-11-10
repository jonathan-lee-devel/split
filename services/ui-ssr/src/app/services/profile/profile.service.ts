import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserDto} from "../../dtos/auth/UserDto";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private httpClient: HttpClient) { }

  getUserInfo() {
    return this.httpClient.get<UserDto>(`${environment.RAW_API_URL}/profile`);
  }
}
