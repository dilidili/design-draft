'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io } = app;
  router.resources('projects', '/api/projects', controller.projects);
  router.resources('drafts', '/api/drafts', controller.drafts);
  router.resources('objects', '/api/oss/objects', controller.ossObjects);
  router.resources('babel', '/api/babel', controller.babel);
  router.get('*', controller.home.index);

  io.of('/').route('exchange', controller.nsp.exchange);
};
