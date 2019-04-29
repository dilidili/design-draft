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

  async delete(draftId) {
    const { model } = this.ctx;

    return await model.Draft.deleteOne({ _id: draftId });
  }
}

module.exports = DraftService;