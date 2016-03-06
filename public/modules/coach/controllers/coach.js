import angular from 'angular';
import $ from 'jquery';

class controller {

  constructor($stateParams, $http) {
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.play = false;

    this.init();
  }

  init() {
  }

  openVideo() {
    this.showVideo = true;
    $('#coach_video').get(0).play();
  }

  turnOnOffVideo() {
    if(this.play) {
      $('#coach_video').get(0).play();
    } else {
      $('#coach_video').get(0).pause();
    }
    this.play = !this.play;
  }

  turnOffVideo() {
    $('#coach_video').get(0).pause();
  }
}

// Strict DI for minification (order is important)
controller.$inject = ['$stateParams', '$http'];

export default controller;
