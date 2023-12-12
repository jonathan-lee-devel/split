import {model, Schema} from 'mongoose';

export interface Expense {
    id: string;
    propertyId: string;
    createdByEmail: string;
    name: string;
    administratorEmails: Array<string>;
    tenantEmails: Array<string>;
}

const schema = new Schema<Expense>({
  id: {type: String, required: true, unique: true},
  propertyId: {type: String, required: true, unique: false},
  createdByEmail: {type: String, required: true, unique: false},
  name: {type: String, required: true, unique: false},
  administratorEmails: {},
  tenantEmails: {},
}, {timestamps: true});

export const PropertyModel = model<Expense>('Expense', schema);
