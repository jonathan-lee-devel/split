import {makeAuthService} from './auth';
import {makeDefaultUserDao} from '../dao';
import {environment} from '../environment';

const defaultUserDao = makeDefaultUserDao();

export const authService = makeAuthService(
    environment.JWT_SECRET,
    defaultUserDao,
);

export type AuthService = typeof authService;
