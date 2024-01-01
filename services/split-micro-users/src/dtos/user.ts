import {Dto} from '@split-common/split-http';

export interface UserDto extends Dto {
  email: string;
  firstName: string;
  lastName: string;
  password: string | undefined;
  emailVerified: boolean;
  googleId: string | undefined;
}
