'use strict';

const Controller = require('egg').Controller;

const createRule = {
  name: 'string',
};

class ProjectController extends Controller {
  async create() {
    const ctx = this.ctx;
    ctx.validate(createRule, ctx.request.body);

    const id = await ctx.service.projects.create(ctx.request.body);

    ctx.body = {
      id: id,
    };
    ctx.status = 201;
  }
}

module.exports = ProjectController;
