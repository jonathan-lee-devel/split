import {Routes} from '@angular/router';
import {LandingPageComponent} from './components/pages/landing-page/landing-page.component';
import {LoginComponent} from './components/pages/users/login/login.component';
import {RegisterComponent} from './components/pages/users/register/register.component';

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
];
