'use strict';

const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/project.test.js', () => {
  it('should create project, fetch detail, then delete it', function() {
    // create
    return app.httpRequest()
      .post('/api/projects')
      .send({ projectTitle: 'TEST_PROJECT' })
      .expect(201)
      .then(response => {
        assert(!!response.body._id, true)
        assert(!!response.body.createdAt, true)

        // get
        app.httpRequest()
          .get(`/api/projects/${response.body._id}`)
          .expect(200)
          .then(detailResponse => {
            assert(detailResponse.body._id === response.body._id)

            // delete
            app.httpRequest()
              .delete(`/api/projects/${response.body._id}`)
              .expect(204)
          })
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
