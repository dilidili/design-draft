'use strict';

const Controller = require('egg').Controller;

const createRule = {
  code: {
    type: 'string',
  },
};

class BabelController extends Controller {
  async create() {
    const ctx = this.ctx;
    ctx.validate(createRule, ctx.request.body);

    const { code } = ctx.request.body
    if (!!code) {
      const transformedCode = await ctx.service.babel.create({
        code
      });

      ctx.body = { transformedCode };
    }

    ctx.status = 201;
  }
}

module.exports = BabelController;
