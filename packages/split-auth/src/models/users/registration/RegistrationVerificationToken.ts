import {Schema} from 'mongoose';

export interface RegistrationVerificationToken {
  id: string;
  value: string;
  expiryDate: Date;
  userEmail: string;
}

export const registrationVerificationTokenModelSchema = new Schema<RegistrationVerificationToken>({
  id: {type: String, required: true, unique: true},
  value: {type: String, required: true, unique: true},
  expiryDate: {type: Date, required: true, unique: false},
  userEmail: {type: String, required: true, unique: true},
}, {timestamps: true});
