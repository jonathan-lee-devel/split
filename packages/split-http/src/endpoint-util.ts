import {AuthenticatedRequest, NextFunction, Request, Response} from 'express';
import {SafeParseError, SafeParseSuccess} from 'zod';

import {HttpStatus} from './enums';
import logger from './logger';

export interface EndpointInformation<TBody, TQuery> {
  bodyParseResult: SafeParseSuccess<TBody> | SafeParseError<TBody>;
  queryParseResult: SafeParseSuccess<TQuery> | SafeParseError<TQuery>;
  callback: AuthenticatedEndpointCallback<TBody, TQuery>;
  req: Request | AuthenticatedRequest;
  res: Response;
  next?: NextFunction;
}

export interface ControllerEndpointInformation<TBody, TParams, TQuery, TData> {
  bodyParseResult: SafeParseSuccess<TBody> | SafeParseError<TBody>;
  paramsParseResult: SafeParseSuccess<TParams> | SafeParseError<TParams>;
  queryParseResult: SafeParseSuccess<TQuery> | SafeParseError<TQuery>;
  useCase: AnonymousEndpointUseCase<TBody, TParams, TQuery, TData> | AuthenticatedEndpointUseCase<TBody, TParams, TQuery, TData>,
  req: Request | AuthenticatedRequest;
  res: Response;
}

/**
 * Returns the result based on the safe parse result of the given endpoint information.
 * If the body parse result is not successful, it returns a JSON response with the body parse error and a Bad Request status code.
 * If the query parse result is not successful, it returns a JSON response with the query parse error and a Bad Request status code.
 * If both the body and query parse results are successful, it calls the callback function with the request, response, and optional next parameters from the endpoint information.
 * If the endpoint information has a next parameter, the callback function is called with the next parameter, otherwise it is called without the next parameter.
 *
 * @param {EndpointInformation<TBody, TQuery>} endpointInformation - The endpoint information containing the parse results and callback function.
 * @return {*} The result based on the safe parse result of the endpoint information.
 */
const returnBasedOnSafeParseResult = <TBody, TQuery>(
  endpointInformation: EndpointInformation<TBody, TQuery>,
) => {
  if (!endpointInformation.bodyParseResult.success) {
    return endpointInformation.res.status(HttpStatus.BAD_REQUEST).json(endpointInformation.bodyParseResult.error);
  } else if (!endpointInformation.queryParseResult.success) {
    return endpointInformation.res.status(HttpStatus.BAD_REQUEST).json(endpointInformation.queryParseResult.error);
  }
  return (endpointInformation.next) ?
    endpointInformation.callback(endpointInformation.req as any, endpointInformation.res, endpointInformation.next) :
    endpointInformation.callback(endpointInformation.req as any, endpointInformation.res);
};

export const executeAnonymousController = async <TBody, TParams, TQuery, TData>(
  controllerEndpointInformation: ControllerEndpointInformation<TBody, TParams, TQuery, TData>,
)=> {
  if (!controllerEndpointInformation.bodyParseResult.success) {
    return controllerEndpointInformation.res.status(HttpStatus.BAD_REQUEST).json(controllerEndpointInformation.bodyParseResult.error);
  } else if (!controllerEndpointInformation.queryParseResult.success) {
    return controllerEndpointInformation.res.status(HttpStatus.BAD_REQUEST).json(controllerEndpointInformation.queryParseResult.error);
  } else if (!controllerEndpointInformation.paramsParseResult.success) {
    return controllerEndpointInformation.res.status(HttpStatus.BAD_REQUEST).json(controllerEndpointInformation.paramsParseResult.error);
  }

  let statusDataContainer: StatusDataContainer<TData | ErrorResponse | null | undefined>;
  if (controllerEndpointInformation.req.user &&
    (controllerEndpointInformation.req as AuthenticatedRequest).user.email) {
    statusDataContainer = await (controllerEndpointInformation.useCase as AuthenticatedEndpointUseCase<TBody, TParams, TQuery, TData>)(
      (controllerEndpointInformation.req as AuthenticatedRequest).user.email as string,
      controllerEndpointInformation.req.body as TBody,
      controllerEndpointInformation.req.params as TParams,
      controllerEndpointInformation.req.query as TQuery,
    );
  } else {
    statusDataContainer = await (controllerEndpointInformation.useCase as AnonymousEndpointUseCase<TBody, TParams, TQuery, TData>)(
      controllerEndpointInformation.req.body as TBody,
      controllerEndpointInformation.req.params as TParams,
      controllerEndpointInformation.req.query as TQuery,
    );
  }

  return controllerEndpointInformation.res.status(statusDataContainer.status).json(statusDataContainer.data);
};

export type ExecuteAnonymousControllerFunction = typeof executeAnonymousController;

export const executeAuthenticatedController = async <TBody, TParams, TQuery, TData>(
  controllerEndpointInformation: ControllerEndpointInformation<TBody, TParams, TQuery, TData>,
) => {
  if (!(controllerEndpointInformation.req as AuthenticatedRequest).user ||
    !(controllerEndpointInformation.req as AuthenticatedRequest).user.email ||
    !(controllerEndpointInformation.req as AuthenticatedRequest).user.emailVerified) {
    return controllerEndpointInformation.res.status(HttpStatus.UNAUTHORIZED).send();
  }

  return executeAnonymousController(controllerEndpointInformation);
};

export type ExecuteAuthenticatedControllerFunction = typeof executeAuthenticatedController;

export type AnonymousEndpointCallback<TBody, TQuery> = (
  req: Request<any, any, TBody, TQuery>,
  res: Response,
  next?: NextFunction,
) => Promise<Response<any, Record<string, any>>> | undefined;

export type ReturnAnonymouslyBasedOnSafeParseResultFunction<TBody, TQuery> = (
  endpointInformation: EndpointInformation<TBody, TQuery>,
) => void;

export const returnAnonymouslyBasedOnSafeParseResult = <TBody, TQuery>(
  endpointInformation: EndpointInformation<TBody, TQuery>,
) => returnBasedOnSafeParseResult(endpointInformation);

export type AuthenticatedEndpointCallback<TBody, TQuery> = (
  req: AuthenticatedRequest<any, any, TBody, TQuery>,
  res: Response,
  next?: NextFunction,
) => Promise<Response<any, Record<string, any>>> | undefined;

export type StatusDataContainer<TData> = {
  data: TData;
  status: HttpStatus;
}

export type ErrorResponse = {
  error: string;
}

export type AuthenticatedEndpointUseCase<TBody, TParams, TQuery, TData> = (
  requestingUserEmail: string,
  body: TBody,
  params: TParams,
  query: TQuery,
) => Promise<StatusDataContainer<TData | ErrorResponse | null | undefined>>;

export type AnonymousEndpointUseCase<TBody, TParams, TQuery, TData> = (
  body: TBody,
  params: TParams,
  query: TQuery,
) => Promise<StatusDataContainer<TData | ErrorResponse | null | undefined>>;

export type ReturnBasedOnAuthenticationAndSafeParseResultFunction<TBody, TQuery> = (
  endpointInformation: EndpointInformation<TBody, TQuery>,
) => void;

// eslint-disable-next-line valid-jsdoc
/**
 * Returns a result based on authentication and safe parse result.
 *
 * @param {EndpointInformation<TBody, TQuery>} endpointInformation - The endpoint information.
 * @return The result based on authentication and safe parse result.
 */
export const returnBasedOnAuthenticationAndSafeParseResult = <TBody, TQuery>(
  endpointInformation: EndpointInformation<TBody, TQuery>,
) => (endpointInformation.req.user) && (endpointInformation.req as AuthenticatedRequest).user.emailVerified ?
  returnBasedOnSafeParseResult(endpointInformation) :
  endpointInformation.res.status(HttpStatus.UNAUTHORIZED).send();

export const wrapTryCatchAuthenticated = <TBody, TQuery>(
  callback: AuthenticatedEndpointCallback<TBody, TQuery>,
) =>
    async (req: AuthenticatedRequest<any, any, TBody, TQuery>, res: Response, next?: NextFunction) => {
      try {
        await callback(req, res, next);
      } catch (err) {
        logger.error(`Unhandled error has occurred: ${err}`);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
      }
    };

export const wrapTryCatchAnonymous = <TBody, TQuery>(
  callback: AnonymousEndpointCallback<TBody, TQuery>,
) =>
    async (req: Request<any, any, TBody, TQuery>, res: Response, next?: NextFunction)=> {
      try {
        await callback(req, res, next);
      } catch (err) {
        logger.error(`Unhandled error has occurred: ${err}`);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
      }
    };
