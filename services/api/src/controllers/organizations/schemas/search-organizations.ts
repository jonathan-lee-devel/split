import {z} from 'zod';

export const SearchOrganizationsRequestBodySchema = z.object({});

export type SearchOrganizationsRequestBody = z.infer<typeof SearchOrganizationsRequestBodySchema>;

export const SearchOrganizationsRequestQuerySchema = z.object({});

export type SearchOrganizationsRequestQuery = z.infer<typeof SearchOrganizationsRequestQuerySchema>;
