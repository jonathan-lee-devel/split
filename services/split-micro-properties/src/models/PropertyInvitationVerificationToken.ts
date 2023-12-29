import {model, Schema} from 'mongoose';

export interface PropertyInvitationVerificationToken {
  value: string;
  expiryDate: Date;
  userEmail: string;
  propertyId: string;
  isAccepted: boolean;
}

export const propertyInvitationVerificationTokenSchema = new Schema<PropertyInvitationVerificationToken>({
  value: {type: String, required: true, unique: true},
  expiryDate: {type: Date, required: true, unique: false},
  userEmail: {type: String, required: true, unique: false},
  propertyId: {type: String, required: true, unique: false},
  isAccepted: {type: Boolean, required: true, unique: false},
}, {timestamps: true});

export const PropertyInvitationVerificationTokenModel = model<PropertyInvitationVerificationToken>('PropertyInvitationVerificationToken', propertyInvitationVerificationTokenSchema);
