import angular from 'angular';
import 'angular-ui-router';

// Controllers
import StudentCtrl from './controllers/student';

// Hmmm... what's the right way to do this
// so this module doesn't have to know where it lives?
let path = './modules/student/';

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
let StudentModule = angular.module('StudentModule', [
    'ui.router'
  ])

  // Controllers
  .controller('StudentCtrl', StudentCtrl)

  // Routes
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('student', {
        url: '/student',
        controller: 'StudentCtrl',
        templateUrl: path + 'views/student.html',
        controllerAs: 'vm'
      });
  }]);

export default StudentModule;