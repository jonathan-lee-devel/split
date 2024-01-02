import {Schema} from 'mongoose';

export interface PasswordResetVerificationToken {
  id: string;
  value: string;
  expiryDate: Date;
  userEmail: string;
}

export const passwordResetVerificationTokenModelSchema = new Schema<PasswordResetVerificationToken>({
  id: {type: String, required: true, unique: true},
  value: {type: String, required: true, unique: true},
  expiryDate: {type: Date, required: true, unique: false},
  userEmail: {type: String, required: true, unique: true},
}, {timestamps: true});
