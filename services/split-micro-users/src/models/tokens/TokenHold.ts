import {model, Schema} from 'mongoose';

export interface TokenHold {
    email: string;
    token: string;
    expiryDate: Date,
}

const schema = new Schema<TokenHold>({
  email: {type: String, required: true, unique: false},
  token: {type: String, required: true, unique: false},
  expiryDate: {type: Date, required: true, unique: false},
}, {timestamps: true});

export const TokenHoldModel = model<TokenHold>('TokenHold', schema);
