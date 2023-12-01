import {Request, Response} from 'express';
import {z} from 'zod';
import {AnonymousEndpointCallback, ReturnAnonymouslyBasedOnSafeParseResultFunction} from '@split/split-http';

export const makeMakeIndexHealthCheckEndpoint = <TBody, TQuery>(
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
