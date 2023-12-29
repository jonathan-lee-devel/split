import {z} from 'zod';

export const InviteTenantToPropertyRequestBodySchema = z.object({
  emailToInvite: z.string().email(),
});

export type InviteTenantToPropertyRequestBody = z.infer<typeof InviteTenantToPropertyRequestBodySchema>;

export const InviteTenantToPropertyRequestQuerySchema = z.object({});

export type InviteTenantToPropertyRequestQuery = z.infer<typeof InviteTenantToPropertyRequestQuerySchema>;
