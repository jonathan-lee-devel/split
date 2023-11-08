import request from 'supertest';
import app from '../../../app';
import {HttpStatus} from '../../../lib/enums/HttpStatus';

describe('Test POST Login', () => {
  test('POST /auth/login with no details should return 401 Unauthorized', (done) => {
    request(app)
        .post('/auth/login')
        .expect(HttpStatus.UNAUTHORIZED, done);
  });
});
