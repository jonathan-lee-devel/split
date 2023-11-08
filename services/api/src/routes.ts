import {Router} from 'express';
import {
  acceptOrganizationInvitationHandler,
  createOrganizationHandler,
  deleteOrganizationHandler,
  getOrganizationHandler,
  getOrganizationSnippetFromOrganizationInvitationHandler,
  getOrganizationSnippetHandler,
  getOrganizationsWhereInvolvedHandler,
  inviteToJoinOrganizationHandler,
  removeOrganizationAdministratorHandler,
  removeOrganizationMemberHandler,
  searchOrganizationsHandler,
  updateOrganizationAdministratorJoinAsMemberHandler,
  updateOrganizationMemberJoinAsAdministratorHandler,
} from './controllers/organizations';
import {loginHandler, logoutHandler} from './controllers/auth';
import {indexHealthCheckHandler} from './controllers/health';
import {getProfileHandler} from './controllers/profile';
import {confirmRegistrationHandler, registerUserHandler} from './controllers/registration';
import {confirmPasswordResetHandler, resetPasswordHandler} from './controllers/password';
import {createProductHandler, getProductsHandler} from './controllers/products';

const router = Router();

// Health Check Routes
router.get('/', indexHealthCheckHandler);

// Auth Routes
router.post('/auth/login', loginHandler);
router.post('/auth/logout', logoutHandler);

// User Routes
router.get('/profile', getProfileHandler);

// Registration Routes
router.post('/register', registerUserHandler);
router.post('/register/confirm', confirmRegistrationHandler);

// Password Routes
router.post('/password/reset', resetPasswordHandler);
router.post('/password/reset/confirm', confirmPasswordResetHandler);

// Organization Routes
router.get('/organizations/:organizationId', getOrganizationHandler);
router.get('/organizations/:organizationId/snippet', getOrganizationSnippetHandler);
router.get('/organizations/search/:searchString', searchOrganizationsHandler);
router.post('/organizations', createOrganizationHandler);
router.get('/organizations/get/where-involved', getOrganizationsWhereInvolvedHandler);
router.delete('/organizations/:organizationId', deleteOrganizationHandler);
router.patch('/organizations/:organizationId/administrators/remove', removeOrganizationAdministratorHandler);
router.patch('/organizations/:organizationId/members/remove', removeOrganizationMemberHandler);
router.patch('/organizations/update-admin-join-as-member/:organizationId', updateOrganizationAdministratorJoinAsMemberHandler);
router.patch('/organizations/update-member-join-as-admin/:organizationId', updateOrganizationMemberJoinAsAdministratorHandler);
router.post('/organizations/:organizationId/invite-to-join', inviteToJoinOrganizationHandler);
router.get('/organizations/invitations/:organizationInvitationValue/snippet', getOrganizationSnippetFromOrganizationInvitationHandler);
router.patch('/organizations/invitations/accept', acceptOrganizationInvitationHandler);

// Product Routes
router.get('/products/:organizationId', getProductsHandler);
router.post('/products', createProductHandler);

export default router;
