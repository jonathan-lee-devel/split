import {z} from 'zod';

export const UpdateOrganizationMemberJoinAsAdministratorRequestBodySchema = z.object({
  memberEmailToUpdate: z.string().email(),
});

export type UpdateOrganizationMemberJoinAsAdministratorRequestBody =
  z.infer<typeof UpdateOrganizationMemberJoinAsAdministratorRequestBodySchema>;

export const UpdateOrganizationMemberJoinAsAdministratorRequestQuerySchema = z.object({});

export type UpdateOrganizationMemberJoinAsAdministratorRequestQuery =
  z.infer<typeof UpdateOrganizationMemberJoinAsAdministratorRequestQuerySchema>;
