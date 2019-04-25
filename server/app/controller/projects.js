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

  async show() {
    const ctx = this.ctx;
    const projectId = ctx.params.id;

    const project = await ctx.service.projects.query({ projectId });

    ctx.body = project;
    ctx.status = project ? 200 : 204;
  }

  async create() {
    const ctx = this.ctx;
    ctx.validate(createRule, ctx.request.body);

    const newProject = await ctx.service.projects.create(ctx.request.body);

    ctx.body = newProject;
    ctx.status = 201;
  }

  async destroy() {
    const ctx = this.ctx;

    const projectId = ctx.params.id;
    if (projectId) {
      await ctx.service.projects.delete(projectId);
    }
    ctx.status = 204;
  }
}

module.exports = ProjectController;
