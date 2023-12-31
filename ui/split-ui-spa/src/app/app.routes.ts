import {Routes} from '@angular/router';

import {ExpensesCreateComponent} from './components/pages/_properties/_expenses/expenses-create/expenses-create.component';
import {
  PropertiesAcceptInvitationComponent,
} from './components/pages/_properties/properties-accept-invitation/properties-accept-invitation.component';
import {PropertiesCreateComponent} from './components/pages/_properties/properties-create/properties-create.component';
import {PropertiesDashboardComponent} from './components/pages/_properties/properties-dashboard/properties-dashboard.component';
import {
  PropertiesInviteTenantsComponent,
} from './components/pages/_properties/properties-invite-tenants/properties-invite-tenants.component';
import {PropertiesManageComponent} from './components/pages/_properties/properties-manage/properties-manage.component';
import {GoogleLoginProcessingComponent} from './components/pages/_users/google-login-processing/google-login-processing.component';
import {GoogleLoginSuccessComponent} from './components/pages/_users/google-login-success/google-login-success.component';
import {LoginComponent} from './components/pages/_users/login/login.component';
import {LogoutInProcessComponent} from './components/pages/_users/logout-in-process/logout-in-process.component';
import {RegisterComponent} from './components/pages/_users/register/register.component';
import {RegisterConfirmComponent} from './components/pages/_users/register-confirm/register-confirm.component';
import {ResetPasswordComponent} from './components/pages/_users/reset-password/reset-password.component';
import {ResetPasswordConfirmComponent} from './components/pages/_users/reset-password-confirm/reset-password-confirm.component';
import {DashboardComponent} from './components/pages/dashboard/dashboard.component';
import {LandingPageComponent} from './components/pages/landing-page/landing-page.component';
import {ManageAccountComponent} from './components/pages/manage-account/manage-account.component';
import {authGuard} from './guards/auth.guard';

export enum RoutePath {
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
  PROPERTIES_INVITATIONS_ACCEPT_ID_TOKEN_VALUE = 'properties/:propertyId/invitations/accept/:tokenValue',
  PROPERTIES_MANAGE = 'properties/manage',
  PROPERTIES_CREATE = 'properties/create',
  PROPERTIES_DASHBOARD_ID = 'properties/dashboard/:propertyId',
  PROPERTIES_DASHBOARD_ID_INVITE_TENANTS = 'properties/dashboard/:propertyId/invite-tenants',
  /* EXPENSE ROUTES */
  EXPENSES_CREATE = 'properties/dashboard/:propertyId/expenses/create',
}

export const rebaseRoutePath = (routePath: RoutePath) => `/${routePath}`;
export const rebaseRoutePathAsString = (routePathAsString: string) => `/${routePathAsString}`;

export const routes: Routes = [
  {
    path: RoutePath.LANDING_PAGE,
    component: LandingPageComponent,
    title: 'Split',
  },
  {
    path: RoutePath.LOGIN,
    component: LoginComponent,
    title: 'Split | Login',
  },
  {
    path: RoutePath.REGISTER,
    component: RegisterComponent,
    title: 'Split | Register',
  },
  {
    path: RoutePath.REGISTER_CONFIRM,
    component: RegisterConfirmComponent,
    title: 'Split | Confirm Registration',
  },
  {
    path: RoutePath.RESET_PASSWORD,
    component: ResetPasswordComponent,
    title: 'Split | Reset Password',
  },
  {
    path: RoutePath.RESET_PASSWORD_CONFIRM,
    component: ResetPasswordConfirmComponent,
    title: 'Split | Confirm Password Reset',
  },
  {
    path: RoutePath.LOGOUT_IN_PROCESS,
    component: LogoutInProcessComponent,
    title: 'Split | Logout',
  },
  {
    path: RoutePath.GOOGLE_LOGIN_IN_PROGRESS,
    component: GoogleLoginProcessingComponent,
    title: 'Split | Google Login in Progress',
  },
  {
    path: RoutePath.GOOGLE_LOGIN_SUCCESS,
    component: GoogleLoginSuccessComponent,
    title: 'Split | Google Login Success',
  },
  {
    path: RoutePath.DASHBOARD,
    component: DashboardComponent,
    title: 'Split | Dashboard',
    canActivate: [authGuard],
  },
  {
    path: RoutePath.ACCOUNT_MANAGE,
    component: ManageAccountComponent,
    title: 'Split | Account',
    canActivate: [authGuard],
  },
  /* PROPERTY ROUTES */
  {
    path: RoutePath.PROPERTIES_INVITATIONS_ACCEPT_ID_TOKEN_VALUE,
    component: PropertiesAcceptInvitationComponent,
    title: 'Split | Accept Invitation',
  },
  {
    path: RoutePath.PROPERTIES_MANAGE,
    component: PropertiesManageComponent,
    title: 'Split | Manage Properties',
    canActivate: [authGuard],
  },
  {
    path: RoutePath.PROPERTIES_CREATE,
    component: PropertiesCreateComponent,
    title: 'Split | Create Property',
    canActivate: [authGuard],
  },
  {
    path: RoutePath.PROPERTIES_DASHBOARD_ID,
    component: PropertiesDashboardComponent,
    title: 'Split | Property Dashboard',
    canActivate: [authGuard],
  },
  {
    path: RoutePath.PROPERTIES_DASHBOARD_ID_INVITE_TENANTS,
    component: PropertiesInviteTenantsComponent,
    title: 'Split | Invite Tenants',
    canActivate: [authGuard],
  },
  {
    path: RoutePath.EXPENSES_CREATE,
    component: ExpensesCreateComponent,
    title: 'Split | Create Expense',
    canActivate: [authGuard],
  },
];
