import {expect} from '@jest/globals';
import {HttpStatus} from '@split/split-http';
import {makeIndexHealthCheckCallback} from '../index-health-check';

describe('Index Health Check Callback Unit Tests', () => {
  it('When make health check callback Then defined function', async () => {
    // @ts-ignore
    const cypressHealthCheck = makeIndexHealthCheckCallback({});

    expect(cypressHealthCheck).toBeDefined();
    expect(cypressHealthCheck).toBeInstanceOf(Function);
  });
  it('When health check Then message logged and correct status', async () => {
    let loggedMessage: string | undefined;
    const ip = '127.0.0.1';
    const indexHealthCheck = makeIndexHealthCheckCallback({
      // @ts-ignore
      silly: (message) => {
        loggedMessage = message;
      }},
    );

    let returnedCode: number | undefined;
    // @ts-ignore
    await indexHealthCheck({ip}, {status(code: number) {
      returnedCode = code;
      return {
        send: () => {},
      };
    },
    });

    expect(returnedCode).toStrictEqual(HttpStatus.OK);
    expect(loggedMessage).toStrictEqual(`Requested health check from ${ip}`);
  });
});
