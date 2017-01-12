(function() {
  'use strict';

  angular
    .module('QiSatApp')
    .config([ '$httpProvider', '$locationProvider', '$routeProvider',
          function ( $httpProvider, $locationProvider, $routeProvider ) {
            $locationProvider.html5Mode(true); 

            $routeProvider.when('/carrinho', {
              templateUrl : '/views/carrinho-montar.html',
              controller : 'compraController as vm',
              resolve : {
                Authenticated : function(authService){
                      return authService.isAuth() || 
                              authService.verifyAuth().then(function (res){ return (res.data.success) || false }, function (res){ return false });
                  }
              }
            });

            $routeProvider.when('/carrinho/pagamento', {
              templateUrl : '/views/carrinho-pagamento.html',
              controller : 'compraController',
              resolve : {
                Authenticated : function(authService){
                      return authService.isAuth() || 
                              authService.verifyAuth().then(function (res){ return (res.data.success) || false }, function (res){ return false });
                  }
              }
            });

            $routeProvider.when('/carrinho/confirmacao', {
              templateUrl : '/views/carrinho-confirmacao.html',
              controller : 'compraController',
              resolve : {
                Authenticated : function(authService){
                      return authService.isAuth() || 
                              authService.verifyAuth().then(function (res){ return (res.data.success) || false }, function (res){ return false });
                  }
              }
            });

            $routeProvider.otherwise('/carrinho');
    }]);
})();