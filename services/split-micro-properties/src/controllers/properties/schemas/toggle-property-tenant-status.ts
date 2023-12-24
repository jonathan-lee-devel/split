import {z} from 'zod';

export const TogglePropertyTenantStatusRequestBodySchema = z.object({
  emailToToggle: z.string().email(),
});

export type TogglePropertyTenantStatusRequestBody = z.infer<typeof TogglePropertyTenantStatusRequestBodySchema>;

export const TogglePropertyTenantStatusRequestQuerySchema = z.object({});

export type TogglePropertyTenantStatusRequestQuery = z.infer<typeof TogglePropertyTenantStatusRequestQuerySchema>;
