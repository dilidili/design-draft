const Service = require('egg').Service;

class DraftService extends Service {
  async create(params) {
    const { model } = this.ctx;
    const {
      projectId,
      url,
      draftName = '',
    } = params;

    const project = await model.Draft.create({
      draftName,
      url,
      project: projectId,
    });

    return project;
  }
}

module.exports = DraftService;