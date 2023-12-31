import {DEFAULT_ID_LENGTH} from '@split-common/split-constants';
import {z} from 'zod';

export const inviteTenantToPropertyRequestBodySchema = z.object({
  emailToInvite: z.string().email(),
});

export type InviteTenantToPropertyRequestBody = z.infer<typeof inviteTenantToPropertyRequestBodySchema>;

export const inviteTenantToPropertyRequestParamsSchema = z.object({
  propertyId: z.string().min(DEFAULT_ID_LENGTH).max(DEFAULT_ID_LENGTH),
});

export type InviteTenantToPropertyRequestParams = z.infer<typeof inviteTenantToPropertyRequestParamsSchema>;

export const inviteTenantToPropertyRequestQuerySchema = z.object({});

export type InviteTenantToPropertyRequestQuery = z.infer<typeof inviteTenantToPropertyRequestQuerySchema>;

export const inviteTenantToPropertyRequestHeadersSchema = z.object({});

export type InviteTenantToPropertyRequestHeaders = z.infer<typeof inviteTenantToPropertyRequestHeadersSchema>;
