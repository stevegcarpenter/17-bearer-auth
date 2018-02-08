'use strict';

const superagent = require('superagent');

const mocks = require('../lib/mocks');
const server = require('../../lib/server');
require('jest');

const PORT = process.env.PORT;
const CAR_ENDPOINT = `:${PORT}/api/v1/car`;

describe('DELETE /api/v1/car/_id?', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mocks.auth.removeAll);
  afterAll(mocks.car.removeAll);

  describe('Valid', () => {
    it('should return a 204 status (NO CONTENT) on a successful deletion', () => {
      return mocks.car.createOne()
        .then(mock => {
          return superagent.delete(`${CAR_ENDPOINT}/${mock.car._id}`)
            .set('Authorization', `Bearer ${mock.token}`);
        })
        .then(res => expect(res.status).toBe(204));
    });
  });

  describe('Invalid', () => {
    it('should return a 404 status (NOT FOUND) with a bad id', () => {
      return mocks.car.createOne()
        .then(mock => {
          return superagent.delete(`${CAR_ENDPOINT}/fudgedId`)
            .set('Authorization', `Bearer ${mock.token}`);
        })
        .catch(err => expect(err.status).toBe(404));
    });

    it('should return a 401 status (UNAUTHORIZED) with a bad token', () => {
      return mocks.car.createOne()
        .then(mock => {
          return superagent.put(`${CAR_ENDPOINT}/${mock.car._id}`)
            .set('Authorization', 'Bearer BADTOKEN');
        })
        .catch(err => expect(err.status).toBe(401));
    });
  });
});
