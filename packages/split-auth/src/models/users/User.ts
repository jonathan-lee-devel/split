import {Schema} from 'mongoose';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string | undefined;
  emailVerified: boolean;
  googleId: string | undefined;
}

export const userModelSchema = new Schema<User>({
  id: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  firstName: {type: String, required: true, unique: false},
  lastName: {type: String, required: true, unique: false},
  password: {type: String, required: false, unique: false},
  emailVerified: {type: Boolean, required: true, unique: false},
  googleId: {type: String, required: false, unique: true},
}, {timestamps: true});
