import {NextFunction, Request, Response} from 'express';
import {z} from 'zod';
import {AnonymousEndpointCallback, ReturnAnonymouslyBasedOnSafeParseResultFunction} from '../../../lib/endpoint-util';

export const makeMakeLoginEndpoint = <TBody, TQuery>(
  returnAnonymouslyBasedOnSafeParseResult: ReturnAnonymouslyBasedOnSafeParseResultFunction<TBody, TQuery>,
) =>
    (
        bodySchema: z.Schema<TBody>,
        querySchema: z.Schema<TQuery>,
        callback: AnonymousEndpointCallback<TBody, TQuery>,
    ) => (req: Request, res: Response, next: NextFunction) => {
      returnAnonymouslyBasedOnSafeParseResult({
        bodyParseResult: bodySchema.safeParse(req.body),
        queryParseResult: querySchema.safeParse(req.query),
        callback,
        req,
        res,
        next});
    };
