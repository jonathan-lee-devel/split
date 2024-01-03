import path from 'node:path';

import {AnonymousController, ExecuteAnonymousControllerFunction, HandleUnhandledControllerErrorFunction} from '@split-common/split-http';
import {Request, Response} from 'express';

import {SimpleStatusDto} from '../dtos';
import {
  ConfirmPasswordResetRequestBody,
  confirmPasswordResetRequestBodySchema,
  ConfirmPasswordResetRequestHeaders,
  confirmPasswordResetRequestHeadersSchema,
  ConfirmPasswordResetRequestParams,
  confirmPasswordResetRequestParamsSchema,
  ConfirmPasswordResetRequestQuery,
  confirmPasswordResetRequestQuerySchema,
} from '../schemas';

export const makeConfirmPasswordResetHandler = (
    handleUnhandledControllerError: HandleUnhandledControllerErrorFunction,
    executeAnonymousController: ExecuteAnonymousControllerFunction,
    confirmPasswordResetController: AnonymousController<
      ConfirmPasswordResetRequestBody,
      ConfirmPasswordResetRequestParams,
      ConfirmPasswordResetRequestQuery,
      ConfirmPasswordResetRequestHeaders,
      SimpleStatusDto>,
) => async (req: Request, res: Response) => {
  try {
    await executeAnonymousController({
      req,
      res,
      controller: confirmPasswordResetController,
      bodyParseResult: confirmPasswordResetRequestBodySchema.safeParse(req.body),
      paramsParseResult: confirmPasswordResetRequestParamsSchema.safeParse(req.params),
      queryParseResult: confirmPasswordResetRequestQuerySchema.safeParse(req.query),
      headersParseResult: confirmPasswordResetRequestHeadersSchema.safeParse(req.headers),
    });
  } catch (err) {
    handleUnhandledControllerError(path.basename(__filename), err, res);
  }
};
