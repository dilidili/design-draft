const Service = require('egg').Service;

class ProjectService extends Service {
  async query({ projectId } = {}) {
    const { model } = this.ctx;

    if (projectId) {
      const project = await model.Project.findById(projectId);
      project.drafts = await model.Draft.find({ project: projectId });
      return project;
    } else {
      const projects = model.Project.find().sort('-updatedAt');
      return projects;
    }
  }

  async create(params) {
    const { model } = this.ctx;

    const project = await model.Project.create({ projectTitle: params.projectTitle });

    return project;
  }

  async delete(projectId) {
    const { model } = this.ctx;

    return await model.Project.deleteOne({ _id: projectId });
  }
}

module.exports = ProjectService;