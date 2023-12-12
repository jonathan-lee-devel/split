import {expect} from '@jest/globals';

import {makeCreatePropertyCallback} from '../create-property';

describe('Create Expense Callback Unit Tests', () => {
  it('When make create expense callback Then defined function', async () => {
    // @ts-ignore
    const createPropertyCallback = makeCreatePropertyCallback({}, () => {
    }, // @ts-ignore
    {}, () => {});
    expect(createPropertyCallback).toBeInstanceOf(Function);
  });
});
