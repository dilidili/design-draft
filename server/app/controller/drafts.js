'use strict';

const Controller = require('egg').Controller;

const createRule = {
  urls: {
    type: 'array',
    itemType: 'string',
  },
  projectId: 'string',
};

const updateRule = {
  draftName: 'string',
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

  async update() {
    const ctx = this.ctx;
    const draftId = ctx.params.id;
    ctx.validate(updateRule, ctx.request.body);

    const draft = await ctx.service.drafts.update(draftId, ctx.request.body);

    ctx.body = draft;
    ctx.status = 200;
  }

  async destroy() {
    const ctx = this.ctx;

    const draftId = ctx.params.id;
    if (draftId) {
      await ctx.service.drafts.delete(draftId);
    }
    ctx.status = 204;
  }
}

module.exports = DraftController;
