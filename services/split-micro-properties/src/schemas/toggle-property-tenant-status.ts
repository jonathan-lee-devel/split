import {DEFAULT_ID_LENGTH} from '@split-common/split-constants';
import {z} from 'zod';

export const togglePropertyTenantStatusRequestBodySchema = z.object({
  emailToToggle: z.string().email(),
});

export type TogglePropertyTenantStatusRequestBody = z.infer<typeof togglePropertyTenantStatusRequestBodySchema>;

export const togglePropertyTenantStatusRequestParamsSchema = z.object({
  propertyId: z.string().min(DEFAULT_ID_LENGTH).max(DEFAULT_ID_LENGTH),
});

export type TogglePropertyTenantStatusRequestParams = z.infer<typeof togglePropertyTenantStatusRequestParamsSchema>;

export const togglePropertyTenantStatusRequestQuerySchema = z.object({});

export type TogglePropertyTenantStatusRequestQuery = z.infer<typeof togglePropertyTenantStatusRequestQuerySchema>;
