import { Routes } from '@angular/router';
import {LandingPageComponent} from "./components/pages/landing-page/landing-page.component";

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
  /* GOOGLE LOGIN ROUTES */
  GOOGLE_LOGIN_SUCCESS = 'google-login-success',
  /* DASHBOARD ROUTES */
  DASHBOARD = 'dashboard',
  /* ACCOUNT ROUTES */
  ACCOUNT_MANAGE = 'account/manage',
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
    path: '',
    component: LandingPageComponent,
    title: 'Split',
  }
];
