import {DEFAULT_TOKEN_SIZE} from '@split-common/split-constants';
import {z} from 'zod';

export const ConfirmRegistrationRequestBodySchema = z.object({
  tokenValue: z.string().min(DEFAULT_TOKEN_SIZE).max(DEFAULT_TOKEN_SIZE),
});

export type ConfirmRegistrationRequestBody = z.infer<typeof ConfirmRegistrationRequestBodySchema>;

export const ConfirmRegistrationRequestQuerySchema = z.object({});

export type ConfirmRegistrationRequestQuery = z.infer<typeof ConfirmRegistrationRequestQuerySchema>;
