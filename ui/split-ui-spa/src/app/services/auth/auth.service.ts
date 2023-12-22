import {isPlatformServer} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Inject, Injectable, NgZone, PLATFORM_ID, signal} from '@angular/core';
import {Router} from '@angular/router';

import {environment} from '../../../environments/environment';
import {RoutePath} from '../../app.routes';
import {AuthenticationRequestDto} from '../../dtos/auth/AuthenticationRequestDto';
import {LoginDto} from '../../dtos/auth/LoginDto';
import {TokensDto} from '../../dtos/auth/TokensDto';
import {UserDto} from '../../dtos/auth/UserDto';
import {ProfileService} from '../profile/profile.service';
import {UsersService} from '../users/users.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public static readonly INITIAL_USER: UserDto = {email: '', firstName: '', lastName: ''};
  private isLoggedIn = signal<boolean>(false);
  public isLoggedIn_ = this.isLoggedIn.asReadonly();
  private currentUserInfo = signal<UserDto>(AuthService.INITIAL_USER);
  public currentUserInfo_ = this.currentUserInfo.asReadonly();
  private readonly USER_DATA_KEY = 'user-data';
  private readonly ACCESS_TOKEN_KEY: string = 'access-token';
  private readonly REFRESH_TOKEN_KEY: string = 'refresh-token';

  constructor(
    @Inject(PLATFORM_ID) private platformId: NonNullable<unknown>,
    private httpClient: HttpClient,
    private router: Router,
    private ngZone: NgZone,
    private usersService: UsersService,
    private profileService: ProfileService,
  ) {
  }

  triggerOnServerReload() {
    this.isLoggedIn.set(this.isAuthenticated());
    this.currentUserInfo.set(this.getCurrentUserInfo());
  }

  getCurrentUserInfo(): UserDto {
    const userData = sessionStorage.getItem(this.USER_DATA_KEY);
    return (userData) ? JSON.parse(userData) : AuthService.INITIAL_USER;
  }

  getCurrentAccessToken(): string {
    return this.getToken(this.ACCESS_TOKEN_KEY);
  }

  getCurrentRefreshToken(): string {
    return this.getToken(this.REFRESH_TOKEN_KEY);
  }

  isAuthenticated() {
    return this.getCurrentAccessToken() !== '';
  }

  doLogin(authenticationRequest: AuthenticationRequestDto) {
    this.httpClient.post<LoginDto>(`${environment.USERS_SERVICE_BASE_URL}/login`, authenticationRequest)
        .subscribe((loginDto) => {
          this.onSuccessfulLogin({accessToken: loginDto.token, refreshToken: loginDto.refreshToken});
        });
  }

  doLogout() {
    sessionStorage.removeItem(this.USER_DATA_KEY);
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    this.isLoggedIn.set(false);
    this.currentUserInfo.set(AuthService.INITIAL_USER);
    this.router.navigate([`/${RoutePath.LOGIN}`])
        .catch((reason) => window.alert(reason));
  }

  doGoogleLogin() {
    this.router.navigate([`/${RoutePath.GOOGLE_LOGIN_IN_PROGRESS}`])
        .catch((reason) => window.alert(reason));
  }

  onSuccessfulGoogleLogin(tokenCode: string) {
    this.usersService.getTokenFromTokenCode(tokenCode)
        .subscribe((tokenHold) => {
          this.onSuccessfulLogin({accessToken: tokenHold.token, refreshToken: tokenHold.refreshToken});
        });
  }

  private getToken(key: string) {
    const token = sessionStorage.getItem(key);
    return (token) ? token : '';
  }

  private onSuccessfulLogin(tokensDto: TokensDto) {
    if (!isPlatformServer(this.platformId)) {
      sessionStorage.setItem(this.ACCESS_TOKEN_KEY, tokensDto.accessToken);
      sessionStorage.setItem(this.REFRESH_TOKEN_KEY, tokensDto.refreshToken);
      this.profileService.getUserInfo()
          .subscribe((userInfo) => {
            this.ngZone.run(() => {
              this.isLoggedIn.set(true);
              sessionStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userInfo));
              this.currentUserInfo.set(userInfo);
              this.router.navigate([`/${RoutePath.DASHBOARD}`], {replaceUrl: true})
                  .catch((reason) => window.alert(reason));
            });
          });
    }
  }
}
