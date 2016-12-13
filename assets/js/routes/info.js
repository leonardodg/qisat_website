(function() {
  'use strict';

  angular
    .module('QiSatApp')
    .config([ '$httpProvider', '$locationProvider', '$routeProvider',
          function ( $httpProvider, $locationProvider, $routeProvider ) {
          
            $locationProvider.html5Mode(true);    

            $routeProvider.when('/curso/presencial/:course', {
              controller: 'infoController'
            });

            $routeProvider.when('/curso/online/:course', {
              controller: 'infoController'
            });

    }]);
})();