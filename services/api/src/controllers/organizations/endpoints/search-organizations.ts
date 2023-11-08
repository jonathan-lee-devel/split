import {AnonymousEndpointCallback, ReturnAnonymouslyBasedOnSafeParseResultFunction} from '../../../lib/endpoint-util';
import {z} from 'zod';
import {Request, Response} from 'express';

export const makeMakeSearchOrganizationEndpoint = <TBody, TQuery>(
  returnAnonymouslyBasedOnSafeParseResult: ReturnAnonymouslyBasedOnSafeParseResultFunction<TBody, TQuery>,
) =>
    (
        bodySchema: z.Schema<TBody>,
        querySchema: z.Schema<TQuery>,
        callback: AnonymousEndpointCallback<TBody, TQuery>,
    ) => (req: Request, res: Response) => {
      returnAnonymouslyBasedOnSafeParseResult({
        bodyParseResult: bodySchema.safeParse(req.body),
        queryParseResult: querySchema.safeParse(req.query),
        callback,
        req,
        res});
    };
