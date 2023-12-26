import {Currency} from 'dinero.js';
import {model, Schema} from 'mongoose';

export interface Expense {
    id: string;
    propertyId: string;
    name: string;
    amount: number;
    currencyCode: Currency;
    createdByEmail: string;
}

const schema = new Schema<Expense>({
  id: {type: String, required: true, unique: true},
  propertyId: {type: String, required: true, unique: false},
  name: {type: String, required: true, unique: false},
  amount: {type: Number, required: true, unique: false},
  currencyCode: {type: String, required: true, unique: false},
  createdByEmail: {type: String, required: true, unique: false},
}, {timestamps: true});

export const ExpenseModel = model<Expense>('Expense', schema);
