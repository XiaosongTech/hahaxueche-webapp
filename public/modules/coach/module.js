import angular from 'angular';
import 'angular-ui-router';

// Controllers
import CoachCtrl from './controllers/coach';

// Hmmm... what's the right way to do this
// so this module doesn't have to know where it lives?
let path = './modules/coach/';

/**
 * @ngdoc object
 * @name OneModule
 * @description
 * A module skeleton.
 * @example
 * ```
    import OneModule from './<path to here>/module.js';
    let AppModule = angular.module('app', ['OneModule']);
 * ```
 */
let CoachModule = angular.module('CoachModule', [
    'ui.router'
  ])

  // Controllers
  .controller('CoachCtrl', CoachCtrl)

  // Routes
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('coach', {
        url: '/about/coach',
        controller: 'CoachCtrl',
        templateUrl: path + 'views/coach.html',
        controllerAs: 'vm'
      });
  }]);

export default CoachModule;
