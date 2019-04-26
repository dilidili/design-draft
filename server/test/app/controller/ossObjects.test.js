'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const path = require('path');

describe('test/app/controller/oss.test.js', () => {
  it('can upload a file', function() {
    // create
    return app.httpRequest()
      .post('/api/oss/objects')
      .attach('file', path.join(__dirname, '../../fixtures/test.jpeg'))
      .expect(201)
      .then(response => {
        assert(!!response.body.url, true)
      })
  });
});
