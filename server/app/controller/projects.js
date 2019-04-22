'use strict';

const Controller = require('egg').Controller;

const createRule = {
  projectTitle: 'string',
};

class ProjectController extends Controller {
  async index() {
    const ctx = this.ctx;

    const projects = await ctx.service.projects.query();

    ctx.body = projects;
    ctx.status = 200;
  }

  async create() {
    const ctx = this.ctx;
    ctx.validate(createRule, ctx.request.body);

    const newProject = await ctx.service.projects.create(ctx.request.body);

    ctx.body = newProject;
    ctx.status = 201;
  }
}

module.exports = ProjectController;
