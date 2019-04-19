const Service = require('egg').Service;

class ProjectService extends Service {
  async create(params) {
    const { model } = this.ctx;

    const project = await model.Project.create({ projectTitle: params.name });

    return project._id
  }
}

module.exports = ProjectService;