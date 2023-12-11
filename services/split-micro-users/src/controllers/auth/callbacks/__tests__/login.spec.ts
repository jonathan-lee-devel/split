import {expect} from '@jest/globals';
import {makeLoginCallback} from '../login';

describe('Login Callback Unit Tests', () => {
  it('When make login callback Then defined function', async () => {
    // @ts-ignore
    const loginCallback = makeLoginCallback({}, {}, {});
    expect(loginCallback).toBeInstanceOf(Function);
  });
});
