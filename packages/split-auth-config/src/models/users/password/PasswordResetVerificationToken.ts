import {model, Schema} from 'mongoose';

export interface PasswordResetVerificationToken {
  value: string;
  expiryDate: Date;
  userEmail: string;
}

const schema = new Schema<PasswordResetVerificationToken>({
  value: {type: String, required: true, unique: true},
  expiryDate: {type: Date, required: true, unique: false},
  userEmail: {type: String, required: true, unique: true},
}, {timestamps: true});

export const PasswordResetVerificationTokenModel = model<PasswordResetVerificationToken>('PasswordResetVerificationToken', schema);
