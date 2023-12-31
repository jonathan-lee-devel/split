import {
  AuthenticatedController,
  ExecuteAuthenticatedControllerFunction,
  HandleUnhandledControllerErrorFunction,
} from '@split-common/split-http';
import {Request, Response} from 'express';

import {PropertyDto} from '../dtos';
import {
  GetPropertiesWhereInvolvedRequestBody,
  getPropertiesWhereInvolvedRequestBodySchema,
  GetPropertiesWhereInvolvedRequestParams,
  getPropertiesWhereInvolvedRequestParamsSchema,
  GetPropertiesWhereInvolvedRequestQuery,
  getPropertiesWhereInvolvedRequestQuerySchema,
} from '../schemas';

export const makeGetPropertiesWhereInvolvedHandler = (
    handleUnhandledControllerError: HandleUnhandledControllerErrorFunction,
    executeAuthenticatedController: ExecuteAuthenticatedControllerFunction,
    getPropertiesWhereInvolvedController: AuthenticatedController<
      GetPropertiesWhereInvolvedRequestBody,
      GetPropertiesWhereInvolvedRequestParams,
      GetPropertiesWhereInvolvedRequestQuery,
      PropertyDto[]>,
) => async (req: Request, res: Response) => {
  try {
    await executeAuthenticatedController({
      req,
      res,
      controller: getPropertiesWhereInvolvedController,
      bodyParseResult: getPropertiesWhereInvolvedRequestBodySchema.safeParse(req.body),
      paramsParseResult: getPropertiesWhereInvolvedRequestParamsSchema.safeParse(req.params),
      queryParseResult: getPropertiesWhereInvolvedRequestQuerySchema.safeParse(req.query),
    });
  } catch (err) {
    handleUnhandledControllerError('createPropertyController', err, res);
  }
};
