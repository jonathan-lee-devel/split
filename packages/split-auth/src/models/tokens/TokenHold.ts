import {Schema} from 'mongoose';

export interface TokenHold {
    id: string;
    email: string;
    token: string;
    tokenCode: string;
    refreshToken: string;
    expiryDate: Date,
}

export const tokenHoldModelSchema = new Schema<TokenHold>({
  id: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: false},
  token: {type: String, required: true, unique: false},
  tokenCode: {type: String, required: true, unique: true},
  refreshToken: {type: String, required: true, unique: false},
  expiryDate: {type: Date, required: true, unique: false},
}, {timestamps: true});
