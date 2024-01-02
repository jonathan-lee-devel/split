import {expect} from '@jest/globals';

import {makeIndexHealthCheckHandler} from '../index-health-check';

describe('Index Health Check Controller Unit Tests', () => {
  it('When make index health check controller Then defined Function', async () => {
    // @ts-expect-error Mock objects used
    const indexHealthCheckController = makeIndexHealthCheckHandler({}, () => {});
    expect(indexHealthCheckController).toBeDefined();
    expect(indexHealthCheckController).toBeInstanceOf(Function);
  });
});
