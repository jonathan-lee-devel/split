import {z} from 'zod';

export const GetOrganizationRequestBodySchema = z.object({});

export type GetOrganizationRequestBody = z.infer<typeof GetOrganizationRequestBodySchema>;

export const GetOrganizationRequestQuerySchema = z.object({});

export type GetOrganizationRequestQuery = z.infer<typeof GetOrganizationRequestQuerySchema>;
