import {expect} from '@jest/globals';

import {makeHandleExistingUser} from '../handle-existing-user';

describe('Handle Existing User Unit Tests', () => {
  it('When make handle existing user Then defined function', async () => {
    const handleExistingUser = makeHandleExistingUser(
        // @ts-ignore
        {},
        // @ts-ignore
        {},
        {},
        {},
    );

    expect(handleExistingUser).toBeDefined();
    expect(handleExistingUser).toBeInstanceOf(Function);
  });
  it('When handle existing user And no existing user Then delete expense', async () => {
    let loggedInfoMessage: string | undefined;
    let registrationDeleteFilter: any;
    let passwordDeleteFilter: any;
    const handleExistingUser = makeHandleExistingUser(
        // @ts-ignore
        {info: (message) => {
          loggedInfoMessage = message;
        }},
        {
          // @ts-ignore
          findOne: () => {
            return {
              exec: () => undefined,
            };
          },
        },
        {
          deleteOne: (filter) => {
            registrationDeleteFilter = filter;
            return {
              exec: () => {},
            };
          },
        },
        {
          deleteOne: (filter) => {
            passwordDeleteFilter = filter;
            return {
              exec: () => {},
            };
          },
        },
    );

    const email = 'test@example.com';
    const filter: any = {userEmail: email};
    const result = await handleExistingUser(email);

    expect(loggedInfoMessage).toStrictEqual(`No user found for e-mail: <${email}>, deleting any possible associated tokens`);
    expect(registrationDeleteFilter).toStrictEqual(filter);
    expect(passwordDeleteFilter).toStrictEqual(filter);
    expect(result).toBeFalsy();
  });
  it('When handle existing user And no existing user Then return true', async () => {
    const handleExistingUser = makeHandleExistingUser(
        // @ts-ignore
        {info: (message) => {}},
        {
          // @ts-ignore
          findOne: () => {
            return {
              exec: () => {
                return {
                  emailVerified: true,
                  googleId: '12345',
                  password: 'password',
                };
              },
            };
          },
        },
        {},
        {},
    );

    const email = 'test@example.com';
    const result = await handleExistingUser(email);

    expect(result).toBeTruthy();
  });
  it('When handle existing user And existing user And not verified Then delete user and expense', async () => {
    let loggedInfoMessage: string | undefined;
    let registrationDeleteFilter: any;
    let passwordDeleteFilter: any;
    let userDeleteFilter: any;
    const handleExistingUser = makeHandleExistingUser(
        // @ts-ignore
        {info: (message) => {
          loggedInfoMessage = message;
        }},
        {
          // @ts-ignore
          findOne: () => {
            return {
              exec: () => {
                return {
                  emailVerified: false,
                };
              },
            };
          },
          // @ts-ignore
          deleteOne: (filter) => {
            userDeleteFilter = filter;
            return {
              exec: () => {

              },
            };
          },
        },
        {
          deleteOne: (filter) => {
            registrationDeleteFilter = filter;
            return {
              exec: () => {},
            };
          },
        },
        {
          deleteOne: (filter) => {
            passwordDeleteFilter = filter;
            return {
              exec: () => {},
            };
          },
        },
    );

    const email = 'test@example.com';
    const userFilter: any = {email};
    const tokenFilter: any = {userEmail: email};
    const result = await handleExistingUser(email);

    expect(loggedInfoMessage).toStrictEqual(`Existing user: <${email}> detected without verified e-mail or Google ID, deleting user and any possible associated tokens`);
    expect(userDeleteFilter).toStrictEqual(userFilter);
    expect(registrationDeleteFilter).toStrictEqual(tokenFilter);
    expect(passwordDeleteFilter).toStrictEqual(tokenFilter);
    expect(result).toBeFalsy();
  });
});
