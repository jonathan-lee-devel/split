import crypto from 'crypto';

import {DEFAULT_JWT_EXPIRATION_VALUE, DEFAULT_TOKEN_SIZE} from '@split-common/split-constants';
import {HttpStatus} from '@split-common/split-http';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {UserDAO} from '../dao';
import {UserDto} from '../dtos';

export const makeAuthService = (
    jwtSecret: string,
    userDao: UserDAO,
) => {
  return {
    verifyUserLoginDetails: async (email: string, password: string) => {
      const user = await userDao.getOneTransformed({email});
      if (!user) {
        return {status: HttpStatus.UNAUTHORIZED};
      }
      if (!user.emailVerified) {
        return {status: HttpStatus.UNAUTHORIZED, error: 'You must verify your e-mail address by re-registering'};
      }
      if (!user.password) {
        return {status: HttpStatus.UNAUTHORIZED, error: 'User does not have a password, you must register'};
      }
      return ((await bcrypt.compare(password, user.password))) ?
        {status: HttpStatus.OK, data: {user}} :
        {status: HttpStatus.UNAUTHORIZED};
    },
    generateLoginTokens: async (user: UserDto) => {
      const payload = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
      };
      const token = jwt.sign(payload, jwtSecret, {expiresIn: DEFAULT_JWT_EXPIRATION_VALUE});
      const refreshToken = crypto.randomBytes(DEFAULT_TOKEN_SIZE / 2).toString('hex');
      return {status: HttpStatus.OK, data: {token, refreshToken}};
    },
  };
};
