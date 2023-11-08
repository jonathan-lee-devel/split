import request from 'supertest';
import app from '../../../app';
import {HttpStatus} from '../../../lib/enums/HttpStatus';

describe('Test POST Logout', () => {
  test('POST /auth/logout with no session should return 401 Unauthorized', (done) => {
    request(app).post('/auth/logout')
        .expect(HttpStatus.UNAUTHORIZED, done);
  });
});
