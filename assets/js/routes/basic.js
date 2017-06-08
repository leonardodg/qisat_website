(function() {
  'use strict';

  angular
    .module('QiSatApp')
    .config([ '$httpProvider', '$locationProvider', '$routeProvider',
          function ( $httpProvider, $locationProvider, $routeProvider ) {
            $locationProvider.html5Mode(true); 
            $locationProvider.hashPrefix('!');

            $routeProvider.when('/termos-de-uso', {
                templateUrl : '/views/modal-termo-de-uso.html'
            });

            $routeProvider.when('/politica-de-privacidade', {
                templateUrl : '/views/modal-politica.html'
            });
    }]);
})();