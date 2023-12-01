import winston from 'winston';

export const makeErrorResponseHandler = (logger: winston.Logger) => (
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
