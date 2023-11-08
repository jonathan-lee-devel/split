import {model, Schema} from 'mongoose';

export interface Organization {
  id: string;
  name: string;
  memberEmails: Array<string>;
  administratorEmails: Array<string>;
}

const schema = new Schema<Organization>({
  id: {type: String, required: true, unique: true},
  name: {type: String, required: true, unique: false},
  memberEmails: {},
  administratorEmails: {},
}, {timestamps: true});

schema.index({name: 'text'});

export const OrganizationModel = model<Organization>('Organization', schema);
