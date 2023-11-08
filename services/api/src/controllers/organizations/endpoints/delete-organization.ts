import {AuthenticatedEndpointCallback, ReturnBasedOnAuthenticationAndSafeParseResultFunction} from '../../../lib/endpoint-util';
import {z} from 'zod';
import {Request, Response} from 'express';

export const makeMakeDeleteOrganizationEndpoint = <TBody, TQuery>(
  returnBasedOnAuthenticationAndSafeParseResult: ReturnBasedOnAuthenticationAndSafeParseResultFunction<TBody, TQuery>,
) =>
    (
        bodySchema: z.Schema<TBody>,
        querySchema: z.Schema<TQuery>,
        callback: AuthenticatedEndpointCallback<TBody, TQuery>,
    ) => (req: Request, res: Response) => {
      returnBasedOnAuthenticationAndSafeParseResult({
        bodyParseResult: bodySchema.safeParse(req.body),
        queryParseResult: querySchema.safeParse(req.query),
        callback,
        req,
        res});
    };
