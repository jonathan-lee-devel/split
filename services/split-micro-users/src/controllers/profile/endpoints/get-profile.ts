import {AuthenticatedRequest, Response} from 'express';
import {z} from 'zod';
import {AuthenticatedEndpointCallback, ReturnBasedOnAuthenticationAndSafeParseResultFunction} from '@split-common/split-http';

export const makeMakeGetProfileEndpoint = <TBody, TQuery>(
  returnBasedOnAuthenticationAndSafeParseResult: ReturnBasedOnAuthenticationAndSafeParseResultFunction<TBody, TQuery>,
) =>
    (
        bodySchema: z.Schema<TBody>,
        querySchema: z.Schema<TQuery>,
        callback: AuthenticatedEndpointCallback<TBody, TQuery>,
    ) => (req: AuthenticatedRequest, res: Response) => {
      returnBasedOnAuthenticationAndSafeParseResult({
        bodyParseResult: bodySchema.safeParse(req.body),
        queryParseResult: querySchema.safeParse(req.query),
        callback,
        req,
        res});
    };
