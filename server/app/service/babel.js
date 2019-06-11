const Service = require('egg').Service;
const babel = require('@babel/core');

class BabelService extends Service {
  async create({ code } = {}) {
    return new Promise((resolve, reject) => {
      babel.transform(code, {
        presets: ['@babel/preset-react'],
      }, function(err, result) {
        if (!err) {
          resolve(result.code);
        } else {
          reject(err);
        }
      })
    });
  }
}

module.exports = BabelService;