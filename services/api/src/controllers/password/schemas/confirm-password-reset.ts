import {z} from 'zod';
import {DEFAULT_TOKEN_SIZE} from '../../../constants/token/token';
import {MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH} from '../../../constants/registration/registration';

export const ConfirmPasswordResetRequestBodySchema = z.object({
  tokenValue: z.string().min(DEFAULT_TOKEN_SIZE).max(DEFAULT_TOKEN_SIZE),
  password: z.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH),
  confirmPassword: z.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH), // Must match password, validation performed in callback
});

export type ConfirmPasswordResetRequestBody = z.infer<typeof ConfirmPasswordResetRequestBodySchema>;

export const ConfirmPasswordResetRequestQuerySchema = z.object({});

export type ConfirmPasswordResetRequestQuery = z.infer<typeof ConfirmPasswordResetRequestQuerySchema>;
