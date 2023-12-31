import {
  AuthenticatedController,
  ExecuteAuthenticatedControllerFunction,
  HandleUnhandledControllerErrorFunction,
} from '@split-common/split-http';
import {Request, Response} from 'express';

import {PropertyDto} from '../dtos';
import {
  CreatePropertyRequestBody,
  createPropertyRequestBodySchema,
  CreatePropertyRequestParams,
  createPropertyRequestParamsSchema,
  CreatePropertyRequestQuery,
  createPropertyRequestQuerySchema,
} from '../schemas';

export const makeCreatePropertyHandler = (
    handleUnhandledControllerError: HandleUnhandledControllerErrorFunction,
    executeAuthenticatedController: ExecuteAuthenticatedControllerFunction,
    createPropertyController: AuthenticatedController<
      CreatePropertyRequestBody,
      CreatePropertyRequestParams,
      CreatePropertyRequestQuery,
      PropertyDto>,
) => async (req: Request, res: Response) => {
  try {
    await executeAuthenticatedController({
      req,
      res,
      controller: createPropertyController,
      bodyParseResult: createPropertyRequestBodySchema.safeParse(req.body),
      paramsParseResult: createPropertyRequestParamsSchema.safeParse(req.params),
      queryParseResult: createPropertyRequestQuerySchema.safeParse(req.query),
    });
  } catch (err) {
    handleUnhandledControllerError('createPropertyController', err, res);
  }
};
