import {model, Schema} from 'mongoose';

import {Property} from '../dao/PropertyDAO';

const schema = new Schema<Property>({
  id: {type: String, required: true, unique: true},
  createdByEmail: {type: String, required: true, unique: false},
  name: {type: String, required: true, unique: false},
  administratorEmails: {},
  tenantEmails: {},
  acceptedInvitationEmails: {},
}, {timestamps: true});

export const PropertyModel = model<Property>('Property', schema);
