import {User, userModelSchema} from '@split-common/split-auth';
import {model} from 'mongoose';

export const UserModel = model<User>('User', userModelSchema);
