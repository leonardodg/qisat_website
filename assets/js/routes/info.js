(function() {
  'use strict';

  angular
    .module('QiSatApp')
    .config([ '$httpProvider', '$locationProvider', '$routeProvider',
          function ( $httpProvider, $locationProvider, $routeProvider ) {
          
            $locationProvider.html5Mode(true); 
            $locationProvider.hashPrefix('!');

            $routeProvider.when('/curso/online/:id', {
              template : '',
              resolve : {
                    Info : function (QiSatAPI, $route){
                              return QiSatAPI.getInfo ('curso/online/'+$route.current.params.id)
                                             .then(function (info){
                                                  return info;
                                             });
                        }
              }
            });


    }]);
})();