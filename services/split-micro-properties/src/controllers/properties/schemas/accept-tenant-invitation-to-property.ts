import {DEFAULT_TOKEN_SIZE} from '@split-common/split-constants';
import {z} from 'zod';

export const AcceptTenantInvitationToPropertyRequestBodySchema = z.object({
  tokenValue: z.string().min(DEFAULT_TOKEN_SIZE).max(DEFAULT_TOKEN_SIZE),
});

export type AcceptTenantInvitationToPropertyRequestBody = z.infer<typeof AcceptTenantInvitationToPropertyRequestBodySchema>;

export const AcceptTenantInvitationToPropertyRequestQuerySchema = z.object({});

export type AcceptTenantInvitationToPropertyRequestQuery = z.infer<typeof AcceptTenantInvitationToPropertyRequestQuerySchema>;
