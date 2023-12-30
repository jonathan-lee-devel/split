import {model, Schema} from 'mongoose';

import {PropertyInvitationVerificationToken} from '../entities/PropertyInvitationVerificationTokenEntity';

export const propertyInvitationVerificationTokenSchema = new Schema<PropertyInvitationVerificationToken>({
  id: {type: String, required: true, unique: true},
  value: {type: String, required: true, unique: true},
  expiryDate: {type: Date, required: true, unique: false},
  userEmail: {type: String, required: true, unique: false},
  propertyId: {type: String, required: true, unique: false},
  isAccepted: {type: Boolean, required: true, unique: false},
}, {timestamps: true});

export const PropertyInvitationVerificationTokenModel = model<PropertyInvitationVerificationToken>('PropertyInvitationVerificationToken', propertyInvitationVerificationTokenSchema);
