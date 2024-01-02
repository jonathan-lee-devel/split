import {z} from 'zod';

export const getProfileRequestBodySchema = z.object({});

export type GetProfileRequestBody = z.infer<typeof getProfileRequestBodySchema>;

export const getProfileRequestParamsSchema = z.object({});

export type GetProfileRequestParams = z.infer<typeof getProfileRequestParamsSchema>;

export const getProfileRequestQuerySchema = z.object({});

export type GetProfileRequestQuery = z.infer<typeof getProfileRequestQuerySchema>;

export const getProfileRequestHeadersSchema = z.object({});

export type GetProfileRequestHeaders = z.infer<typeof getProfileRequestHeadersSchema>;
