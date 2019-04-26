'use strict';

// had enabled by egg
// exports.static = true;

exports.assets = {
  enable: true,
  package: 'egg-view-assets',
};

exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks',
};

exports.validate = {
  enable: true,
  package: 'egg-validate',
};

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

exports.oss = {
  enable: true,
  package: 'egg-oss',
}
