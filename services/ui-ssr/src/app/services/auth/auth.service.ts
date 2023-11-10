import {EventEmitter, Injectable, Output, signal} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {LoginDto} from "../../dtos/auth/LoginDto";
import {UserDto} from "../../dtos/auth/UserDto";
import {Router} from "@angular/router";
import {RoutePaths} from "../../app.routes";
import {LogoutDto} from "../../dtos/auth/LogoutDto";
import {ProfileService} from "../profile/profile.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public static readonly INITIAL_USER: UserDto = {email: '', firstName: '', lastName: ''};

    private readonly USERNAME = 'username';
    private readonly PASSWORD = 'password';
    private readonly SUCCESS = 'SUCCESS';
    private readonly USER_DATA_KEY = 'user-data';

    @Output() isLoggedIn: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() userInfo: EventEmitter<UserDto> = new EventEmitter<UserDto>();

    currentIsLoggedIn = signal<boolean>(false);
    currentUserInfo = signal<UserDto>(AuthService.INITIAL_USER);

    constructor(
        private httpClient: HttpClient,
        private router: Router,
        private profileService: ProfileService,
    ) {
    }

    triggerOnServerReload() {
        this.isLoggedIn.next(this.isAuthenticated())
        this.currentIsLoggedIn.set(this.isAuthenticated())
        this.userInfo.next(this.getCurrentUserInfo());
        this.currentUserInfo.set(this.getCurrentUserInfo());
    }

    getCurrentUserInfo(): UserDto {
        const userData = sessionStorage.getItem(this.USER_DATA_KEY);
        return (userData) ? JSON.parse(userData) : AuthService.INITIAL_USER;
    }

    isAuthenticated() {
        const userData = sessionStorage.getItem(this.USER_DATA_KEY);
        return (userData) ? JSON.parse(userData) : false;
    }

    doLogin(username: string, password: string) {
        const body = new HttpParams()
            .set(this.USERNAME, username)
            .set(this.PASSWORD, password);

        this.httpClient.post<LoginDto>(`${environment.RAW_API_URL}/auth/login`, body, {
            withCredentials: true,
        }).subscribe((loginDto) => {
            if (loginDto.loginStatus === this.SUCCESS) {
                this.onSuccessfulLogin(loginDto.user);
            } else {
                window.alert('Login Failed!');
            }
        });
    }

    doLogout() {
        sessionStorage.removeItem(this.USER_DATA_KEY);
        this.currentIsLoggedIn.set(false);
        this.isLoggedIn.next(false);
        this.currentUserInfo.set(AuthService.INITIAL_USER);
        this.userInfo.next(AuthService.INITIAL_USER);
        this.httpClient.post<LogoutDto>(`${environment.RAW_API_URL}/auth/logout`, {}, {withCredentials: true})
            .subscribe((logoutDto) => {
                if (logoutDto.logoutStatus !== this.SUCCESS) {
                    window.alert('Logout Failed!');
                } else {
                    this.router.navigate([`/${RoutePaths.LOGIN}`]).catch((reason) => window.alert(reason));
                }
            });
    }

    doGoogleLogin() {
        window.location.href = `${environment.RAW_API_URL}/auth/google`;
    }

    onSuccessfulGoogleLogin() {
        this.profileService.getUserInfo().subscribe((userInfo) => {
            this.onSuccessfulLogin(userInfo);
        });
    }

    private onSuccessfulLogin(userInfo: UserDto) {
        sessionStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userInfo));
        this.currentIsLoggedIn.set(true);
        this.isLoggedIn.next(true);
        this.currentUserInfo.set(userInfo);
        this.userInfo.next(userInfo);
        this.router.navigate([`/${RoutePaths.DASHBOARD}`]).catch((reason) => window.alert(reason));
    }
}
