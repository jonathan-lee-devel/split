import winston from 'winston';

/**
 * Handles error responses and logs the error using the provided logger.
 *
 * @param {winston.Logger} logger - The logger instance for logging the error.
 * @return {*} - The resulting response
 */
export const makeErrorResponseHandler = (logger: winston.Logger): any => (
    err: { message: string; status: string },
    req: any,
    res: {
    locals: { message: any; error: any };
    status: (arg0: any) => void;
    json: (arg0: { error: any }) => void;
  },
    _: any,
) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  logger.error(
      `Error at ${req.url}: {"status":"${err.status}", "message":"${err.message}"}`,
  );
  res.status(err.status || 500);
  res.json({error: err});
};
