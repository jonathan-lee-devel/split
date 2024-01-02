import {GenerateIdFunction} from '@split-common/split-auth';
import {HttpStatus} from '@split-common/split-http';

import {UserDAO} from '../dao';
import {EncodePasswordFunction} from '../util/password/encode-password';

export const makeRegisterService = (
    userDao: UserDAO,
    generateId: GenerateIdFunction,
    encodePassword: EncodePasswordFunction,
) => {
  return {
    registerUser: async (email: string, firstName: string, lastName: string, password: string) => {
      const existingGoogleUser = await userDao.getOneTransformed({email});
      if (existingGoogleUser) {
        existingGoogleUser.firstName = firstName;
        existingGoogleUser.lastName = lastName;
        existingGoogleUser.password = await encodePassword(password);
      }
      return (existingGoogleUser) ?
        {status: HttpStatus.OK, data: await userDao.updateOneAndReturnTransformed(existingGoogleUser)} :
        {status: HttpStatus.OK, data: await userDao.createAndReturnTransformed({
          id: await generateId(),
          email,
          firstName,
          lastName,
          password: await encodePassword(password),
          emailVerified: false,
          googleId: undefined,
        })};
    },
  };
};
