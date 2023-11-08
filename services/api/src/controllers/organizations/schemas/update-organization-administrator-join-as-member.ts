import {z} from 'zod';

export const UpdateOrganizationAdministratorJoinAsMemberRequestBodySchema = z.object({
  administratorEmailToUpdate: z.string().email(),
});

export type UpdateOrganizationAdministratorJoinAsMemberRequestBody =
  z.infer<typeof UpdateOrganizationAdministratorJoinAsMemberRequestBodySchema>;

export const UpdateOrganizationAdministratorJoinAsMemberRequestQuerySchema = z.object({});

export type UpdateOrganizationAdministratorJoinAsMemberRequestQuery =
  z.infer<typeof UpdateOrganizationAdministratorJoinAsMemberRequestQuerySchema>;
