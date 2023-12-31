import {MAX_NAME_LENGTH, MAX_PASSWORD_LENGTH, MIN_NAME_LENGTH, MIN_PASSWORD_LENGTH} from '@split-common/split-constants';
import {z} from 'zod';

export const RegisterRequestBodySchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(MIN_NAME_LENGTH).max(MAX_NAME_LENGTH),
  lastName: z.string().min(MIN_NAME_LENGTH).max(MAX_NAME_LENGTH),
  password: z.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH),
  confirmPassword: z.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH),
  acceptTermsAndConditions: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['password', 'confirmPassword'],
}).refine((data) => data.acceptTermsAndConditions === true, {
  message: 'You must accept the terms and conditions',
  path: ['acceptTermsAndConditions'],
});

export type RegisterRequestBody = z.infer<typeof RegisterRequestBodySchema>;

export const RegisterRequestQuerySchema = z.object({});

export type RegisterRequestQuery = z.infer<typeof RegisterRequestQuerySchema>;
