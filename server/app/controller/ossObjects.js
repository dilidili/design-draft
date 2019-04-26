'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const uuidv4 = require('uuid/v4');

class ossObjectController extends Controller {
  async create() {
    const ctx = this.ctx;

    const stream = await this.ctx.getFileStream();
    const filename = uuidv4() + path.extname(stream.filename).toLowerCase();
    const result = await ctx.oss.put(filename, stream);

    if (result) {
      ctx.body = {
        url: result.url,
      }
      ctx.status = 201;
    }
  }
}

module.exports = ossObjectController;
