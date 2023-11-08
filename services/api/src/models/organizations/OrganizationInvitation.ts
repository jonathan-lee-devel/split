import {model, Schema} from 'mongoose';

export interface OrganizationInvitation {
  id: string;
  organizationId: string;
  requestingUserEmail: string;
  emailToInvite: string;
  isAccepted: boolean;
  value: string;
  expiryDate: Date;
}

const schema = new Schema<OrganizationInvitation>({
  id: {type: String, required: true, unique: true},
  organizationId: {type: String, required: true, unique: false},
  requestingUserEmail: {type: String, required: true, unique: false},
  emailToInvite: {type: String, required: true, unique: false},
  isAccepted: {type: Boolean, required: true, unique: false},
  value: {type: String, required: true, unique: true},
  expiryDate: {type: Date, required: true, unique: false},
}, {timestamps: true});

export const OrganizationInvitationModel = model<OrganizationInvitation>('OrganizationInvitation', schema);
