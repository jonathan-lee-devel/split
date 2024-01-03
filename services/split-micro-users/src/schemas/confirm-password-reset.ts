import {DEFAULT_TOKEN_SIZE, MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH} from '@split-common/split-constants';
import {z} from 'zod';

export const confirmPasswordResetRequestBodySchema = z.object({
  tokenValue: z.string().min(DEFAULT_TOKEN_SIZE).max(DEFAULT_TOKEN_SIZE),
  password: z.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH),
  confirmPassword: z.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH),
}).refine((data) => data.password === data.confirmPassword, 'Passwords must match');

export type ConfirmPasswordResetRequestBody = z.infer<typeof confirmPasswordResetRequestBodySchema>;

export const confirmPasswordResetRequestParamsSchema = z.object({});

export type ConfirmPasswordResetRequestParams = z.infer<typeof confirmPasswordResetRequestParamsSchema>;

export const confirmPasswordResetRequestQuerySchema = z.object({});

export type ConfirmPasswordResetRequestQuery = z.infer<typeof confirmPasswordResetRequestQuerySchema>;

export const confirmPasswordResetRequestHeadersSchema = z.object({});

export type ConfirmPasswordResetRequestHeaders = z.infer<typeof confirmPasswordResetRequestHeadersSchema>;
