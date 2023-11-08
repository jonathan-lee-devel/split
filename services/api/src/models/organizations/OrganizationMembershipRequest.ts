import {model, Schema} from 'mongoose';

export interface OrganizationMembershipRequest {
  id: string;
  organizationId: string;
  requestingUserEmail: string;
  isApproved: boolean,
  approvingAdministratorEmail?: string;
}

const schema = new Schema<OrganizationMembershipRequest>({
  id: {type: String, required: true, unique: true},
  organizationId: {type: String, required: true, unique: false},
  requestingUserEmail: {type: String, required: true, unique: false},
  isApproved: {type: Boolean, required: true, unique: false},
  approvingAdministratorEmail: {type: String, required: false, unique: false},
}, {timestamps: true});

export const OrganizationMembershipRequestModel = model<OrganizationMembershipRequest>('OrganizationMembershipRequest', schema);
