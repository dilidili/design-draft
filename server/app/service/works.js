const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const DRAFT_INIT = [{
  name: 'EXTRACT_RECT',
  script: (draft) => `node ${path.join(__dirname, '../scripts/extractBoundingClientRect.js')} ${draft.url}`,
}, {
  name: 'GENERATE_CODE',
  script: () => `node ${path.join(__dirname, '../scripts/boundingRect2Code.js')}`,
}];

class WorkService extends Service {
  // is there any work need to be processed
  async isActive() {
    const { model } = this.ctx;

    return !!await model.Work.findOne({ currentStep: { $lt: 0 } });
  }

  async beginWork() {
    const { model } = this.ctx;

    const work = await model.Work.findOne({ currentStep: 0 });

    if (!work) return;

    if (work.type === 'DRAFT_INIT') {
      await work.populate('draft').execPopulate();

      work.totalSteps = DRAFT_INIT.length;
      await work.save();

      this.runScripts(DRAFT_INIT, work);
    }
  }

  async runScripts(scripts, work) {
    const config = this.app.config;
    const paths = config.paths;
    const workspacePath = path.join(paths.workspace, work._id + '');

    // init workspace
    if (!fs.existsSync(paths.workspace)) {
      fs.mkdirSync(paths.workspace);
    }
    if (!fs.existsSync(workspacePath)) {
      fs.mkdirSync(workspacePath);
    }

    for (let index = 0; index < scripts.length; index++) {
      const script = scripts[index];

      work.currentStep = index + 1;
      work.currentStepDescription = script['name'];

      child_process.execSync(script.script(work.draft), {
        cwd: workspacePath,
      })

      await work.save();
    }

    // use -1 to indicate that the work has been completed
    work.currentStep = -1;
    work.currentStepDescription = '';
    await work.save();
  }

  async enqueueWorkFromDraft(draft) {
    const { model } = this.ctx;

    const work = await model.Work.create({
      type: 'DRAFT_INIT',
      draft: draft._id,
    });

    draft.initializeWork = work._id;
    draft.save();
  }
}

module.exports = WorkService;