import {EventEmitter, Injectable, NgZone, Output, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserDto} from '../../dtos/auth/UserDto';
import {Router} from '@angular/router';
import {RoutePaths} from '../../app.routes';
import {ProfileService} from '../profile/profile.service';
import {UsersService} from '../users/users.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public static readonly INITIAL_USER: UserDto = {email: '', firstName: '', lastName: ''};
  @Output() isLoggedIn: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() userInfo: EventEmitter<UserDto> = new EventEmitter<UserDto>();
  currentIsLoggedIn = signal<boolean>(false);
  currentUserInfo = signal<UserDto>(AuthService.INITIAL_USER);
  private readonly USERNAME = 'username';
  private readonly PASSWORD = 'password';
  private readonly SUCCESS = 'SUCCESS';
  private readonly USER_DATA_KEY = 'user-data';
  private readonly ACCESS_TOKEN_KEY: string = 'access-token';

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private ngZone: NgZone,
    private usersService: UsersService,
    private profileService: ProfileService,
    private matSnackbar: MatSnackBar,
  ) {
  }

  triggerOnServerReload() {
    this.isLoggedIn.next(this.isAuthenticated());
    this.currentIsLoggedIn.set(this.isAuthenticated());
    this.userInfo.next(this.getCurrentUserInfo());
    this.currentUserInfo.set(this.getCurrentUserInfo());
  }

  getCurrentUserInfo(): UserDto {
    const userData = sessionStorage.getItem(this.USER_DATA_KEY);
    return (userData) ? JSON.parse(userData) : AuthService.INITIAL_USER;
  }

  getCurrentAccessToken(): string {
    const accessToken = sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
    return (accessToken) ? accessToken : '';
  }

  isAuthenticated() {
    const userData = sessionStorage.getItem(this.USER_DATA_KEY);
    return (userData) ? JSON.parse(userData) : false;
  }

  doLogin(username: string, password: string) {
    if (username === password) {
      window.alert('Change your password');
    }
    window.alert('Login not yet implemented, please sign in with Google');
    // const body = new HttpParams()
    //     .set(this.USERNAME, username)
    //     .set(this.PASSWORD, password);
    //
    // this.httpClient.post<LoginDto>(`${environment.RAW_API_URL}/auth/login`, body, {
    //   withCredentials: true,
    // }).subscribe((loginDto) => {
    //   if (loginDto.loginStatus === this.SUCCESS) {
    //     this.onSuccessfulLogin(loginDto.user);
    //   } else {
    //     window.alert('Login Failed!');
    //   }
    // });
  }

  doLogout() {
    sessionStorage.removeItem(this.USER_DATA_KEY);
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    this.currentIsLoggedIn.set(false);
    this.isLoggedIn.next(false);
    this.currentUserInfo.set(AuthService.INITIAL_USER);
    this.userInfo.next(AuthService.INITIAL_USER);
    this.router.navigate([`/${RoutePaths.LOGIN}`]).catch((reason) => window.alert(reason));
  }

  doGoogleLogin() {
    this.router.navigate([`/${RoutePaths.GOOGLE_LOGIN_IN_PROGRESS}`]).catch((reason) => window.alert(reason));
  }

  onSuccessfulGoogleLogin(tokenCode: string) {
    this.usersService.getTokenFromTokenCode(tokenCode)
        .subscribe((tokenHold) => {
          this.onSuccessfulLogin(tokenHold.token);
        });
  }

  test() {
    return this.httpClient.get<unknown>(`${environment.USERS_SERVICE_BASE_URL}/test`);
  }

  private onSuccessfulLogin(accessToken: string) {
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    this.currentIsLoggedIn.set(true);
    this.isLoggedIn.next(true);
    this.profileService.getUserInfo()
        .subscribe((userInfo) => {
          this.matSnackbar.open(`API: ${JSON.stringify(userInfo)}`);
          console.log(`userInfo.firstName: ${userInfo.firstName}`);
          this.currentUserInfo.set(userInfo);
          this.userInfo.next(userInfo);
          sessionStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userInfo));
          this.ngZone.run(() => {
            this.router.navigate([`/${RoutePaths.DASHBOARD}`], {replaceUrl: true})
                .catch((reason) => window.alert(reason));
          });
        });
  }
}
