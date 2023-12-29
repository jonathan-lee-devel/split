import {AuthenticatedEndpointUseCase, ControllerReturnBasedOnSafeParseResultFunction} from '@split-common/split-http';
import {AuthenticatedRequest, Response} from 'express';

import {Property} from '../entities/PropertyEntity';
import {
  CreatePropertyRequestBody,
  CreatePropertyRequestBodySchema,
  CreatePropertyRequestQuery,
  CreatePropertyRequestQuerySchema,
} from '../schemas/create-property';

export const makeCreatePropertyController = (
    controllerReturnBasedOnSafeParseResult
  : ControllerReturnBasedOnSafeParseResultFunction,
    createPropertyUseCase
      : AuthenticatedEndpointUseCase<CreatePropertyRequestBody, CreatePropertyRequestQuery, Property>,
) => async (req: AuthenticatedRequest, res: Response) => {
  await controllerReturnBasedOnSafeParseResult({
    req,
    res,
    useCase: createPropertyUseCase,
    bodyParseResult: CreatePropertyRequestBodySchema.safeParse(req.body),
    queryParseResult: CreatePropertyRequestQuerySchema.safeParse(req.query),
  });
};
