import {z} from 'zod';

export const RemoveOrganizationAdministratorRequestBodySchema = z.object({
  administratorEmailToRemove: z.string().email(),
});

export type RemoveOrganizationAdministratorRequestBody = z.infer<typeof RemoveOrganizationAdministratorRequestBodySchema>;

export const RemoveOrganizationAdministratorRequestQuerySchema = z.object({});

export type RemoveOrganizationAdministratorRequestQuery = z.infer<typeof RemoveOrganizationAdministratorRequestQuerySchema>;
