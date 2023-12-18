import {expect} from '@jest/globals';

import {makeGetPropertyByIdCallback} from '../get-property-by-id';

describe('Get Property by ID Involved Callback Unit Tests', () => {
  it('When make get property by ID callback Then defined function', async () => {
    // @ts-ignore
    const getPropertyByIdCallback = makeGetPropertyByIdCallback({}, {}, () => {});
    expect(getPropertyByIdCallback).toBeInstanceOf(Function);
  });
});
