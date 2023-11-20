import {model, Schema} from 'mongoose';

export interface EmailSendAttempt {
  id: string;
  from: string;
  to: string;
  subject: string;
  html: string;
  isSentSuccessfully: boolean;
}

const schema = new Schema<EmailSendAttempt>({
  id: {type: String, required: true, unique: true},
  from: {type: String, required: true, unique: false},
  to: {type: String, required: true, unique: false},
  subject: {type: String, required: true, unique: false},
  html: {type: String, required: true, unique: false},
  isSentSuccessfully: {type: Boolean, required: true, unique: false},
}, {timestamps: true});

export const EmailSendAttemptModel = model<EmailSendAttempt>('EmailSendAttempt', schema);
