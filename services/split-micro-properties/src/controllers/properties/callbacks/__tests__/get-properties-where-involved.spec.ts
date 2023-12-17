import {expect} from '@jest/globals';

import {makeGetPropertiesWhereInvolvedCallback} from '../get-properties-where-involved';

describe('Get Properties Where Involved Callback Unit Tests', () => {
  it('When make get properties where involved callback Then defined function', async () => {
    // @ts-ignore
    const getPropertiesWhereInvolvedCallback = makeGetPropertiesWhereInvolvedCallback({}, {});
    expect(getPropertiesWhereInvolvedCallback).toBeInstanceOf(Function);
  });
});
