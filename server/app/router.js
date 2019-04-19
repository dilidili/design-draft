'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.resources('projects', '/api/projects', controller.projects);
  router.get('*', controller.home.index);
};
