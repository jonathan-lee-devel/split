import {AuthenticatedEndpointCallback, ReturnBasedOnAuthenticationAndSafeParseResultFunction} from '@split-common/split-http';
import {AuthenticatedRequest, Response} from 'express';
import {z} from 'zod';

export const makeMakeTogglePropertyTenantStatusEndpoint = <TBody, TQuery>(
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
