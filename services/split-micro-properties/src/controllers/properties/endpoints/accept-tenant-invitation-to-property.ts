import {AuthenticatedEndpointCallback, ReturnAnonymouslyBasedOnSafeParseResultFunction} from '@split-common/split-http';
import {AuthenticatedRequest, Response} from 'express';
import {z} from 'zod';

export const makeMakeAcceptTenantInvitationToPropertyEndpoint = <TBody, TQuery>(
  returnAnonymouslyBasedOnSafeParseResult: ReturnAnonymouslyBasedOnSafeParseResultFunction<TBody, TQuery>,
) =>
    (
        bodySchema: z.Schema<TBody>,
        querySchema: z.Schema<TQuery>,
        callback: AuthenticatedEndpointCallback<TBody, TQuery>,
    ) => (req: AuthenticatedRequest, res: Response) => {
      returnAnonymouslyBasedOnSafeParseResult({
        bodyParseResult: bodySchema.safeParse(req.body),
        queryParseResult: querySchema.safeParse(req.query),
        callback,
        req,
        res});
    };
