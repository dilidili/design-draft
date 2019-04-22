'use strict';

const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/project.test.js', () => {
  it('should create project', function() {
    return app.httpRequest()
      .post('/api/projects')
      .send({ projectTitle: 'TEST_PROJECT' })
      .expect(201)
      .then(response => {
        assert(!!response.body._id, true)
      });
  });

  it('should return project list', function() {
    return app.httpRequest()
      .get('/api/projects')
      .expect(200)
      .then(response => {
        assert(Array.isArray(response.body), true)
      });
  });
});
