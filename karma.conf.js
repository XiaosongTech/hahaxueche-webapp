/* global module */
module.exports = function (config) {
  'use strict';
  config.set({
    autoWatch: true,
    singleRun: true,

    // Use either phantomjs-shim OR include below browser-polyfill.js to add bind() support to browser.
    frameworks: ['jspm', 'jasmine'],

    files: [
      // polyfill needed for karma-babel-preprocessor < v6.0.
      'node_modules/karma-babel-preprocessor/node_modules/babel-core/browser-polyfill.js',
    ],

    // preprocess matching files before serving them to the browser
    preprocessors: {
      'public/app.js': ['babel', 'coverage'],
      'public/app-controller.js': ['babel', 'coverage'],
      'public/modules/**/*.js': ['babel', 'coverage']
    },

    jspm: {
      config: 'public/config.js',
      paths: {
        '*': '*.js',
        'github:*': 'public/jspm_packages/github/*',
        'npm:*': 'public/jspm_packages/npm/*',
        'ge:*': 'public/jspm_packages/ge/*',
        'process': 'public/jspm_packages/npm/process@0.10.1.js'  //Threw error when lodash was added because relative path between jspm modules not working.
      },
      loadFiles: [
        'public/bower_components/lodash/dist/lodash.js',
        'public/main.js',
        'public/app-controller.js',
        'public/modules/**/*.js',
        'public/test/*.spec.js'
      ],
      serveFiles: [
        '!(*spec).js'
      ]
    },

    proxies: {
      '/public/': '/base/public/'
    },

    browsers: ['PhantomJS'],

    reporters: ['progress', 'junit', 'coverage'],

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Configure the reporter
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },

    /**
     * JUnit Reporter options
     */
    junitReporter: {
        outputDir: 'junit/',
        outputFile: '../junit.xml',
        suite: 'unit'
    }


  });

};
