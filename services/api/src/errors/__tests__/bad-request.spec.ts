import {expect} from '@jest/globals';
import BadRequest from '../bad-request';

describe('ApplicationError test suite', () => {
  test('sets default error message', () => {
    const error = new BadRequest();
    expect(error.message).toBe('Bad request');
  });

  test('sets correct message', () => {
    const message = 'error message';
    const error = new BadRequest(message);
    expect(error.message).toBe(message);
  });

  test('sets 400 as default status code', () => {
    const message = 'error message';
    const error = new BadRequest(message);
    expect(error.status).toBe(400);
  });
});
