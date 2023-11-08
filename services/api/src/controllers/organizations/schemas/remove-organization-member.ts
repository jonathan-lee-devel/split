import {z} from 'zod';

export const RemoveOrganizationMemberRequestBodySchema = z.object({
  memberEmailToRemove: z.string().email(),
});

export type RemoveOrganizationMemberRequestBody = z.infer<typeof RemoveOrganizationMemberRequestBodySchema>;

export const RemoveOrganizationMemberRequestQuerySchema = z.object({});

export type RemoveOrganizationMemberRequestQuery = z.infer<typeof RemoveOrganizationMemberRequestQuerySchema>;
