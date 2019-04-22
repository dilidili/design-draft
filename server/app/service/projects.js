const Service = require('egg').Service;

class ProjectService extends Service {
  async query() {
    const { model } = this.ctx;

    const projects = model.Project.find({}) || [];

    return projects;
  }

  async create(params) {
    const { model } = this.ctx;

    const project = await model.Project.create({ projectTitle: params.projectTitle });

    return project;
  }


}

module.exports = ProjectService;