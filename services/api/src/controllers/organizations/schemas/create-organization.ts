import {z} from 'zod';

export const CreateOrganizationRequestBodySchema = z.object({
  name: z.string().min(1).max(20),
});

export type CreateOrganizationRequestBody = z.infer<typeof CreateOrganizationRequestBodySchema>;

export const CreateOrganizationRequestQuerySchema = z.object({});

export type CreateOrganizationRequestQuery = z.infer<typeof CreateOrganizationRequestQuerySchema>;
