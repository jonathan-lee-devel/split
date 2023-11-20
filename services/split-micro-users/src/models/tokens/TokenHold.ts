import {model, Schema} from 'mongoose';

export interface TokenHold {
    email: string;
    token: string;
    tokenCode: string;
    refreshToken: string;
    expiryDate: Date,
}

const schema = new Schema<TokenHold>({
  email: {type: String, required: true, unique: false},
  token: {type: String, required: true, unique: false},
  tokenCode: {type: String, required: true, unique: true},
  refreshToken: {type: String, required: true, unique: false},
  expiryDate: {type: Date, required: true, unique: false},
}, {timestamps: true});

export const TokenHoldModel = model<TokenHold>('TokenHold', schema);
