import {expect} from '@jest/globals';

import {makeRegisterCallback} from '../register';

describe('Register Callback Unit Tests', () => {
  it('When make register callback Then defined function', async () => {
    // @ts-ignore
    const registerCallback = makeRegisterCallback({}, {});
    expect(registerCallback).toBeInstanceOf(Function);
  });
});
