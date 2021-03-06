'use strict';
const path = require('path');

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1513765449219_5858';

  // add your config here
  config.middleware = [];

  config.view = {
    mapping: {
      '.html': 'nunjucks',
    },
  };

  config.oss = require('./oss.keys.json');

  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/design',
      options: {},
    }
  }

  config.assets = {
    publicPath: '/public/',
    devServer: {
      debug: true,
      command: 'umi dev',
      port: 8000,
      env: {
        APP_ROOT: process.cwd() + '/app/web',
        BROWSER: 'none',
        ESLINT: 'none',
        SOCKET_SERVER: 'http://127.0.0.1:8000',
        PUBLIC_PATH: 'http://127.0.0.1:8000',
      },
    },
  };

  config.security = {
    csrf: false,
  };

  config.paths = {
    workspace: path.join(__dirname, '../.workspace'),
  };

  config.io = {
    namespace: {
      '/': {
        connectionMiddleware: [],
        packetMiddleware: []
      },
    }
  };

  return config;
};
