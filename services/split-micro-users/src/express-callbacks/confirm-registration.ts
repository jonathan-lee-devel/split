import path from 'node:path';

import {AnonymousController, ExecuteAnonymousControllerFunction, HandleUnhandledControllerErrorFunction} from '@split-common/split-http';
import {Request, Response} from 'express';

import {SimpleStatusDto} from '../dtos';
import {
  ConfirmRegistrationRequestBody,
  confirmRegistrationRequestBodySchema,
  ConfirmRegistrationRequestHeaders,
  confirmRegistrationRequestHeadersSchema,
  ConfirmRegistrationRequestParams,
  confirmRegistrationRequestParamsSchema,
  ConfirmRegistrationRequestQuery,
  confirmRegistrationRequestQuerySchema,
} from '../schemas/confirm-registration';

export const makeConfirmRegistrationHandler = (
    handleUnhandledControllerError: HandleUnhandledControllerErrorFunction,
    executeAnonymousController: ExecuteAnonymousControllerFunction,
    confirmRegistrationController: AnonymousController<
      ConfirmRegistrationRequestBody,
      ConfirmRegistrationRequestParams,
      ConfirmRegistrationRequestQuery,
      ConfirmRegistrationRequestHeaders,
      SimpleStatusDto>,
) => async (req: Request, res: Response) => {
  try {
    await executeAnonymousController({
      req,
      res,
      controller: confirmRegistrationController,
      bodyParseResult: confirmRegistrationRequestBodySchema.safeParse(req.body),
      paramsParseResult: confirmRegistrationRequestParamsSchema.safeParse(req.params),
      queryParseResult: confirmRegistrationRequestQuerySchema.safeParse(req.query),
      headersParseResult: confirmRegistrationRequestHeadersSchema.safeParse(req.headers),
    });
  } catch (err) {
    handleUnhandledControllerError(path.basename(__filename), err, res);
  }
};
