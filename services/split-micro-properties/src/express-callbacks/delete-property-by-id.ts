import {
  AuthenticatedController,
  ExecuteAuthenticatedControllerFunction,
  HandleUnhandledControllerErrorFunction,
} from '@split-common/split-http';
import {Request, Response} from 'express';

import {PropertyDto} from '../dtos';
import {
  DeletePropertyByIdRequestBody,
  deletePropertyByIdRequestBodySchema,
  DeletePropertyByIdRequestParams,
  deletePropertyByIdRequestParamsSchema,
  DeletePropertyByIdRequestQuery,
  deletePropertyByIdRequestQuerySchema,
} from '../schemas';

export const makeDeletePropertyByIdHandler = (
    handleUnhandledControllerError: HandleUnhandledControllerErrorFunction,
    executeAuthenticatedController: ExecuteAuthenticatedControllerFunction,
    deletePropertyByIdController: AuthenticatedController<
    DeletePropertyByIdRequestBody,
    DeletePropertyByIdRequestParams,
    DeletePropertyByIdRequestQuery,
    PropertyDto>,
) => async (req: Request, res: Response) => {
  try {
    await executeAuthenticatedController({
      req,
      res,
      controller: deletePropertyByIdController,
      bodyParseResult: deletePropertyByIdRequestBodySchema.safeParse(req.body),
      paramsParseResult: deletePropertyByIdRequestParamsSchema.safeParse(req.params),
      queryParseResult: deletePropertyByIdRequestQuerySchema.safeParse(req.query),
    });
  } catch (err) {
    handleUnhandledControllerError('deletePropertyByIdController', err, res);
  }
};
