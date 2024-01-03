import {DEFAULT_TOKEN_SIZE} from '@split-common/split-constants';
import {z} from 'zod';

export const confirmRegistrationRequestBodySchema = z.object({
  tokenValue: z.string().min(DEFAULT_TOKEN_SIZE).max(DEFAULT_TOKEN_SIZE),
});

export type ConfirmRegistrationRequestBody = z.infer<typeof confirmRegistrationRequestBodySchema>;

export const confirmRegistrationRequestParamsSchema = z.object({});

export type ConfirmRegistrationRequestParams = z.infer<typeof confirmRegistrationRequestParamsSchema>;

export const confirmRegistrationRequestQuerySchema = z.object({});

export type ConfirmRegistrationRequestQuery = z.infer<typeof confirmRegistrationRequestQuerySchema>;

export const confirmRegistrationRequestHeadersSchema = z.object({});

export type ConfirmRegistrationRequestHeaders = z.infer<typeof confirmRegistrationRequestHeadersSchema>;
