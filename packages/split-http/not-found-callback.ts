import {NextFunction, Request, Response} from 'express';
import createError from 'http-errors';

import {HttpStatus} from './enums';

/**
 * Handles not found errors.
 *
 * @param {Request} _req - The request object.
 * @param {Response} _res - The response object.
 * @param {NextFunction} next - The next function to call.
 * @return {void} - No return value.
 */
export const notFoundCallback = (_req: Request, _res: Response, next: NextFunction) => {
  next(createError(HttpStatus.NOT_FOUND));
};
