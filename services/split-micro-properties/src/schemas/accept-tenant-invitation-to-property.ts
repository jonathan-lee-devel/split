import {DEFAULT_ID_LENGTH, DEFAULT_TOKEN_SIZE} from '@split-common/split-constants';
import {z} from 'zod';

export const acceptTenantInvitationToPropertyRequestBodySchema = z.object({
  tokenValue: z.string().min(DEFAULT_TOKEN_SIZE).max(DEFAULT_TOKEN_SIZE),
});

export type AcceptTenantInvitationToPropertyRequestBody = z.infer<typeof acceptTenantInvitationToPropertyRequestBodySchema>;

export const acceptTenantInvitationToPropertyRequestParamsSchema = z.object({
  propertyId: z.string().min(DEFAULT_ID_LENGTH).max(DEFAULT_ID_LENGTH),
});

export type AcceptTenantInvitationToPropertyRequestParams = z.infer<typeof acceptTenantInvitationToPropertyRequestParamsSchema>;

export const acceptTenantInvitationToPropertyRequestQuerySchema = z.object({});

export type AcceptTenantInvitationToPropertyRequestQuery = z.infer<typeof acceptTenantInvitationToPropertyRequestQuerySchema>;
