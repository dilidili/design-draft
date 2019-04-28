'use strict';

const Controller = require('egg').Controller;

const createRule = {
  urls: {
    type: 'array',
    itemType: 'string',
  },
  projectId: 'string',
};

class DraftController extends Controller {
  async create() {
    const ctx = this.ctx;
    ctx.validate(createRule, ctx.request.body);

    const drafts = [];

    for (let index = 0; index < ctx.request.body.urls.length; index++) {
      const url = ctx.request.body.urls[index];

      const draft = await ctx.service.drafts.create({
        url,
        projectId: ctx.request.body.projectId,
        draftName: 'Untitled',
      });
      drafts.push(draft);
    }

    ctx.body = drafts;
    ctx.status = 201;
  }
}

module.exports = DraftController;
