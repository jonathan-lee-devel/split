import nodemailer from 'nodemailer';
import {environment} from './environment';

export const transporterConfig = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: environment.EMAIL_USER,
    pass: environment.EMAIL_PASSWORD,
  },
});

