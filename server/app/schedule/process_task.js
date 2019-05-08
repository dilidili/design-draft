const Subscription = require('egg').Subscription;

class ProcessTask extends Subscription {
  // using `schedule` property to set the scheduled task execution interval and other configurations
  static get schedule() {
    return {
      interval: '100m', // 1 minute interval
      type: 'all',
    };
  }

  // `subscribe` is the function to be executed when the scheduled task is triggered
  async subscribe() {
    const worksServices = this.ctx.service.works;

    if (!await worksServices.isActive()) {
      await worksServices.beginWork();
    }
  }
}

module.exports = ProcessTask;