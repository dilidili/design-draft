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
  commit: async (workspacePath, work) => {
    const content = fs.readFileSync(path.join(workspacePath, 'output.js'), 'utf8');
    if (content) {
      work.draft.render = content;
      await work.draft.save()
    }
  }
}];

const WORK_PROCESS = {
  INIT_WORKSPACE: 0,
}

class WorkService extends Service {
  // is there any work need to be processed
  async isActive() {
    const { model } = this.ctx;

    const activeWork = await model.Work.findOne({ currentStep: { $gt: 0 } })
    return !!activeWork;
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
    // const { socket } = this.ctx;
    const config = this.app.config;
    const paths = config.paths;
    const workspacePath = path.join(paths.workspace, work._id + '');

    // init workspace
    if (!fs.existsSync(paths.workspace)) {
      fs.mkdirSync(paths.workspace);
    }
    if (!fs.existsSync(workspacePath)) {
      // socket.emit('WORK_PROCESS_CHANGE', {
      //   id: work._id,
      //   state: WORK_PROCESS.INIT_WORKSPACE,
      // });
      fs.mkdirSync(workspacePath);
    }

    for (let index = 0; index < scripts.length; index++) {
      const script = scripts[index];

      work.currentStep = index + 1;
      work.currentStepDescription = script['name'];

      child_process.execSync(script.script(work.draft), {
        cwd: workspacePath,
      })

      if (script.commit) {
        await script.commit(workspacePath, work);
      }

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