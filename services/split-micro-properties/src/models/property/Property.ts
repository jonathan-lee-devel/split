import {model, Schema} from 'mongoose';

export interface Property {
    id: string;
    createdByEmail: string;
    name: string;
    administratorEmails: Array<string>;
    tenantEmails: Array<string>;
}

const schema = new Schema<Property>({
  id: {type: String, required: true, unique: true},
  createdByEmail: {type: String, required: true, unique: false},
  name: {type: String, required: true, unique: false},
  administratorEmails: {},
  tenantEmails: {},
}, {timestamps: true});

export const PropertyModel = model<Property>('Property', schema);
