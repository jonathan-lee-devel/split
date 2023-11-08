import {makeLogoutCallback} from '../logout';

describe('Logout Callback Unit Tests', () => {
  it('When make logout callback Then defined function', async () => {
    // @ts-ignore
    const logout = makeLogoutCallback({});

    expect(logout).toBeDefined();
    expect(logout).toBeInstanceOf(Function);
  });
});
