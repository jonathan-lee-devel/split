import {z} from 'zod';

export const DeleteOrganizationRequestBodySchema = z.object({});

export type DeleteOrganizationRequestBody = z.infer<typeof DeleteOrganizationRequestBodySchema>;

export const DeleteOrganizationRequestQuerySchema = z.object({});

export type DeleteOrganizationRequestQuery = z.infer<typeof DeleteOrganizationRequestQuerySchema>;
