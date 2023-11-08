import {model, Schema} from 'mongoose';
import Dinero from 'dinero.js';

export interface Product {
  id: string;
  name: string;
  organizationId: string;
  priceAmount: number;
  priceCurrency: Dinero.Currency;
}

const schema = new Schema<Product>({
  id: {type: String, required: true, unique: true},
  name: {type: String, required: true, unique: false},
  organizationId: {type: String, required: true, unique: false},
  priceAmount: {type: Number, required: true, unique: false},
  priceCurrency: {type: String, required: true, unique: false},
}, {timestamps: true});

export const ProductModel = model<Product>('Product', schema);
