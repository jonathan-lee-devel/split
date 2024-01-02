import {Dto} from '@split-common/split-http';

export interface UserDto extends Dto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string | undefined;
  emailVerified: boolean;
  googleId: string | undefined;
}

export interface UserProfileDto {
  email: string;
  firstName: string;
  lastName: string;
}
