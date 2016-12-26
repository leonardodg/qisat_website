(function() {
  'use strict';

  angular
    .module('QiSatApp')
    .config([ '$httpProvider', '$locationProvider', '$routeProvider',
          function ( $httpProvider, $locationProvider, $routeProvider ) {
          
            $locationProvider.html5Mode(true); 

            $routeProvider.when('/cadastro', {
              templateUrl : '/views/cadastro.html',
              controller : 'singupController',
              isAuth : false
            });

            $routeProvider.when('/lembrete-de-senha', {
              templateUrl : '/views/lembrete-de-senha.html',
              controller : 'rememberController',
              isAuth : false
            });

            $routeProvider.when('/login', {
              templateUrl : '/views/login.html',
              controller: 'loginController',
              isAuth : false
            });

            $routeProvider.otherwise('/login');
    }]);
})();