import {Routes} from '@angular/router';

import {PropertiesManageComponent} from './components/pages/_properties/properties-manage/properties-manage.component';
import {
  GoogleLoginProcessingComponent,
} from './components/pages/_users/google-login-processing/google-login-processing.component';
import {
  GoogleLoginSuccessComponent,
} from './components/pages/_users/google-login-success/google-login-success.component';
import {LoginComponent} from './components/pages/_users/login/login.component';
import {LogoutInProcessComponent} from './components/pages/_users/logout-in-process/logout-in-process.component';
import {RegisterComponent} from './components/pages/_users/register/register.component';
import {RegisterConfirmComponent} from './components/pages/_users/register-confirm/register-confirm.component';
import {ResetPasswordComponent} from './components/pages/_users/reset-password/reset-password.component';
import {
  ResetPasswordConfirmComponent,
} from './components/pages/_users/reset-password-confirm/reset-password-confirm.component';
import {DashboardComponent} from './components/pages/dashboard/dashboard.component';
import {LandingPageComponent} from './components/pages/landing-page/landing-page.component';
import {ManageAccountComponent} from './components/pages/manage-account/manage-account.component';
import {authGuard} from './guards/auth.guard';

export enum RoutePaths {
  /* ANONYMOUS ROUTES */
  LANDING_PAGE = '',
  LOGIN = 'login',
  REGISTER = 'register',
  REGISTER_CONFIRM = 'register/confirm/:tokenValue',
  RESET_PASSWORD = 'reset-password',
  RESET_PASSWORD_CONFIRM = 'reset-password/confirm/:tokenValue',
  /* ERROR ROUTES */
  SERVER_ERROR = 'error/server-error',
  ERROR_NOT_FOUND = 'error/not-found',
  /* LOADING ROUTES */
  LOGOUT_IN_PROCESS = 'logout-in-process',
  GOOGLE_LOGIN_IN_PROGRESS = 'google-login-in-process',
  GOOGLE_LOGIN_SUCCESS = 'google-login-success',
  /* DASHBOARD ROUTES */
  DASHBOARD = 'dashboard',
  /* ACCOUNT ROUTES */
  ACCOUNT_MANAGE = 'account/manage',
  /* PROPERTY ROUTES */
  PROPERTIES_MANAGE = 'properties/manage',
  /* ORGANIZATION ROUTES */
  ORGANIZATIONS_CREATE = 'organizations/create',
  ORGANIZATIONS_MANAGE = 'organizations/manage',
  ORGANIZATIONS_DASHBOARD_ID = 'organizations/dashboard/:organizationId',
  ORGANIZATIONS_PAGE_ID = 'organizations/:organizationId',
  ORGANIZATIONS_INVITE_MEMBER = 'organizations/dashboard/:organizationId/invite-member',
  ORGANIZATIONS_INVITATION = 'organizations/invitations/:organizationInvitationId',
  /* PRODUCT ROUTES */
  ORGANIZATIONS_PRODUCT_CREATE = 'organizations/dashboard/:organizationId/create-product',
}

export const routes: Routes = [
  {
    path: RoutePaths.LANDING_PAGE,
    component: LandingPageComponent,
    title: 'Split',
  },
  {
    path: RoutePaths.LOGIN,
    component: LoginComponent,
    title: 'Split | Login',
  },
  {
    path: RoutePaths.REGISTER,
    component: RegisterComponent,
    title: 'Split | Register',
  },
  {
    path: RoutePaths.REGISTER_CONFIRM,
    component: RegisterConfirmComponent,
    title: 'Split | Confirm Registration',
  },
  {
    path: RoutePaths.RESET_PASSWORD,
    component: ResetPasswordComponent,
    title: 'Split | Reset Password',
  },
  {
    path: RoutePaths.RESET_PASSWORD_CONFIRM,
    component: ResetPasswordConfirmComponent,
    title: 'Split | Confirm Password Reset',
  },
  {
    path: RoutePaths.LOGOUT_IN_PROCESS,
    component: LogoutInProcessComponent,
    title: 'Split | Logout',
  },
  {
    path: RoutePaths.GOOGLE_LOGIN_IN_PROGRESS,
    component: GoogleLoginProcessingComponent,
    title: 'Split | Google Login in Progress',
  },
  {
    path: RoutePaths.GOOGLE_LOGIN_SUCCESS,
    component: GoogleLoginSuccessComponent,
    title: 'Split | Google Login Success',
  },
  {
    path: RoutePaths.DASHBOARD,
    component: DashboardComponent,
    title: 'Split | Dashboard',
    canActivate: [authGuard],
  },
  {
    path: RoutePaths.ACCOUNT_MANAGE,
    component: ManageAccountComponent,
    title: 'Split | Account',
    canActivate: [authGuard],
  },
  /* PROPERTY ROUTES */
  {
    path: RoutePaths.PROPERTIES_MANAGE,
    component: PropertiesManageComponent,
    title: 'Split | Manage Properties',
    canActivate: [authGuard],
  },
];
