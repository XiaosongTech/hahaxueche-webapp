import angular from 'angular';
class controller {

  constructor(){
    this.init();
  }

  init(){
    console.log('app-controller initialized');
  }

  openVideo() {
  	console.log('asdasdas')
  }
}

// Strict DI for minification (order is important)
controller.$inject = [];

export default controller;
