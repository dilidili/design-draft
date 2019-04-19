'use strict';

const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/project.test.js', () => {
  it('should create project', function() {
    return app.httpRequest()
      .post('/api/projects')
      .send({ name: 'TEST_PROJECT' })
      .expect(201)
      .then(response => {
        assert(!!response.body.id, true)
      });
  });
});
