'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const { createProject } = require('./project.test.js');

const deleteDraft = ({ draftId }) => {
  return app.httpRequest()
    .delete(`/api/drafts/${draftId}`)
}

const updateDraft = (draftId, { draftName }) => {
  return app.httpRequest()
    .put(`/api/drafts/${draftId}`)
    .send({ draftName })
}

const fetchDraft = (draftId) => {
  return app.httpRequest()
    .get(`/api/drafts/${draftId}`)
}

describe('test/app/controller/draft.test.js', () => {
  let projectId = null
  
  before(() => {
    return createProject({ projectTitle: 'TEST_PROJECT' })
      .expect(201)
      .then(response => {
        projectId = response.body._id
      })
  })

  it('should create a list of drafts with pictures', function() {
    let createdDrafts = []

    // create
    return app.httpRequest()
      .post('/api/drafts')
      .send({ urls: [
        'https://design-draft.oss-cn-hangzhou.aliyuncs.com/060fe401-2d85-4a05-9ee5-387745c102a5.jpeg',
        'https://design-draft.oss-cn-hangzhou.aliyuncs.com/11245a2f-4d58-4817-ad1a-cea106bb2ad0.jpeg',
      ], projectId: projectId })
      .expect(201)
      .then(response => {
        assert(response.body.filter(v => !!v).length > 0);

        createdDrafts = response.body;

        // update
        return updateDraft(createdDrafts[0]._id, { draftName: 'NEW_DRAFT_NAME' })
          .expect(200)
          .then((response) => {
            assert(response.body.draftName === 'NEW_DRAFT_NAME');
            assert(!!response.body.updatedAt);

            // delete
            return deleteDraft({ draftId: createdDrafts[0]._id })
              .expect(204)
          })

      });
  });

  it.only('should start a bunch of tasks when fetch draft detail', function() {
    let createdDraft = null

    // create
    return app.httpRequest()
      .post('/api/drafts')
      .send({ urls: [
        'https://design-draft.oss-cn-hangzhou.aliyuncs.com/060fe401-2d85-4a05-9ee5-387745c102a5.jpeg',
      ], projectId: projectId })
      .expect(201)
      .then(response => {
        assert(response.body.filter(v => !!v).length > 0);

        createdDraft = response.body[0];

        // detail
        return fetchDraft(createdDraft._id)
          .expect(200)
          .then((response) => {
            assert(response.body.draftName === 'Untitled');
            assert(!!response.body.initilizeWork === true);

            // initialization
            return app.runSchedule('process_task');
          })
      });
  })
});
