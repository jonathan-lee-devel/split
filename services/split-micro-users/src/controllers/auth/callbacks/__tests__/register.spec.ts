import {expect} from '@jest/globals';

import {makeRegisterUserCallback} from '../register-user';


describe('Register Callback Unit Tests', () => {
  it('When make register callback Then defined function', async () => {
    // @ts-ignore
    const registerUserCallback = makeRegisterUserCallback({}, {},
        () => {}, () => {},
        () => {}, {}, {});
    expect(registerUserCallback).toBeInstanceOf(Function);
  });
});
