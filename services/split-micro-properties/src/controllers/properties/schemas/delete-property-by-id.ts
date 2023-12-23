import {z} from 'zod';

export const DeletePropertyByIdRequestBodySchema = z.object({});

export type DeletePropertyByIdRequestBody = z.infer<typeof DeletePropertyByIdRequestBodySchema>;

export const DeletePropertyByIdRequestQuerySchema = z.object({});

export type DeletePropertyByIdRequestQuery = z.infer<typeof DeletePropertyByIdRequestQuerySchema>;
