import {expect} from '@jest/globals';
import {makeGetTokenFromTokenHoldCallback} from '../get-token-from-token-hold';

describe('Token Hold Callback Unit Tests', () => {
  it('When make token hold callback Then defined function', async () => {
    // @ts-ignore
    const getTokenHoldCallback = makeGetTokenFromTokenHoldCallback({});
    expect(getTokenHoldCallback).toBeInstanceOf(Function);
  });
});
