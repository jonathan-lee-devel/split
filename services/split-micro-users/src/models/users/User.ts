import {model, Schema} from 'mongoose';

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  password: string | undefined;
  emailVerified: boolean;
  googleId: string | undefined;
}

const schema = new Schema<User>({
  email: {type: String, required: true, unique: true},
  firstName: {type: String, required: true, unique: false},
  lastName: {type: String, required: true, unique: false},
  password: {type: String, required: false, unique: false},
  emailVerified: {type: Boolean, required: true, unique: false},
  googleId: {type: String, required: false, unique: true},
}, {timestamps: true});

export const UserModel = model<User>('User', schema);
