'use strict';

const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/project.test.js', () => {
  it('should create project then delete it', function() {
    return app.httpRequest()
      .post('/api/projects')
      .send({ projectTitle: 'TEST_PROJECT' })
      .expect(201)
      .then(response => {
        assert(!!response.body._id, true)
        assert(!!response.body.createdAt, true)

        app.httpRequest()
          .delete(`/api/projects/${response.body._id}`)
          .expect(204)
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
