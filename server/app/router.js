'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.resources('projects', '/api/projects', controller.projects);
  router.resources('objects', '/api/oss/objects', controller.ossObjects);
  router.get('*', controller.home.index);
};
