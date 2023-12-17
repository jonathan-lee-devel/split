import {expect} from '@jest/globals';

import {makeCreatePropertyCallback} from '../create-property';

describe('Create Property Callback Unit Tests', () => {
  it('When make create property callback Then defined function', async () => {
    // @ts-ignore
    const createPropertyCallback = makeCreatePropertyCallback({}, () => {
    }, // @ts-ignore
    {}, () => {});
    expect(createPropertyCallback).toBeInstanceOf(Function);
  });
});
