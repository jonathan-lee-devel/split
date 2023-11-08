import {z} from 'zod';

export const InviteToJoinOrganizationRequestBodySchema = z.object({
  emailToInvite: z.string().email(),
});

export type InviteToJoinOrganizationRequestBody = z.infer<typeof InviteToJoinOrganizationRequestBodySchema>;

export const InviteToJoinOrganizationQuerySchema = z.object({});

export type InviteToJoinOrganizationRequestQuery = z.infer<typeof InviteToJoinOrganizationQuerySchema>;
