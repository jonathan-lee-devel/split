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

export type AnonymousEndpointCallback<TBody, TQuery> = (
  req: Request<any, any, TBody, TQuery>,
  res: Response,
  next?: NextFunction
) => void;

export type ReturnAnonymouslyBasedOnSafeParseResultFunction<TBody, TQuery> = (
  endpointInformation: EndpointInformation<TBody, TQuery>,
) => void;

export const returnAnonymouslyBasedOnSafeParseResult = <TBody, TQuery>(
  endpointInformation: EndpointInformation<TBody, TQuery>,
) => {
  return returnBasedOnSafeParseResult(endpointInformation);
};

export type AuthenticatedEndpointCallback<TBody, TQuery> = (
  req: AuthenticatedRequest<any, any, TBody, TQuery>,
  res: Response,
  next?: NextFunction
) => void;

export type ReturnBasedOnAuthenticationAndSafeParseResultFunction<TBody, TQuery> = (
  endpointInformation: EndpointInformation<TBody, TQuery>,
) => void;

export const returnBasedOnAuthenticationAndSafeParseResult = <TBody, TQuery>(
  endpointInformation: EndpointInformation<TBody, TQuery>,
) => {
  logger.silly(`endpoint info = ${JSON.stringify( (endpointInformation.req as AuthenticatedRequest).user )}`);
  return (endpointInformation.req.user) && (endpointInformation.req as AuthenticatedRequest).user.emailVerified ?
    returnBasedOnSafeParseResult(endpointInformation) :
    endpointInformation.res.status(HttpStatus.UNAUTHORIZED).send();
};

