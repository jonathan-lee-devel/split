import {model, Schema} from 'mongoose';

export interface Delivery {
  id: string;
  creatorEmail: string;
  assignedDriverEmail: string;
  organizationId: string;
  productId: string;
  customerId: string;
  details: string;
  isDelivered: boolean;
}

const schema = new Schema<Delivery>({
  id: {type: String, required: true, unique: true},
  creatorEmail: {type: String, required: true, unique: false},
  assignedDriverEmail: {type: String, required: true, unique: false},
  organizationId: {type: String, required: true, unique: false},
  productId: {type: String, required: true, unique: false},
  customerId: {type: String, required: true, unique: false},
  details: {type: String, required: true, unique: false},
  isDelivered: {type: Boolean, required: true, unique: false},
}, {timestamps: true});

export const DeliveryModel = model<Delivery>('Delivery', schema);
