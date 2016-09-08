(function() {
  'use strict';

  angular.module('QiSatApp')
    .config( function ($locationProvider) {

                // $routeProvider
                //       .when('/online', {
                //         templateUrl: '<p>filter online</p>'
                //       })
                //       .when('/presenciais', {
                //         templateUrl: '<p>filter presencial</p>'
                //       }).otherwise({
                //         redirectTo: '/cursos'
                //       });

                // use the HTML5 History API

                $locationProvider.html5Mode({
                                              enabled: true, 
                                              requireBase: false,
                                              rewriteLinks: 'internal'
                                            });      

                // $locationProvider.html5Mode(true).hashPrefix('!');            
            });
})();