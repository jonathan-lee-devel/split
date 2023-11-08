import {makeLoginCallback} from '../login';

describe('Login Callback Unit Tests', () => {
  it('When make login callback Then defined function', async () => {
    // @ts-ignore
    const login = makeLoginCallback({}, {});

    expect(login).toBeDefined();
    expect(login).toBeInstanceOf(Function);
  });
});
