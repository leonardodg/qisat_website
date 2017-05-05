(function() {
  'use strict';

  angular
    .module('QiSatApp')
    .config([ '$httpProvider', '$locationProvider', '$routeProvider',
          function ( $httpProvider, $locationProvider, $routeProvider ) {
          
            $locationProvider.html5Mode(true); 

            function Authenticated(authService){
                      return authService.isAuth() || 
                              authService.verifyAuth()
                                         .then( function (res){ 
                                                  if(res) return true; else window.location = '/login'; 
                                                }, function (res){ 
                                                      window.location = '/login'; 
                                                });
            };

            $routeProvider.when('/aluno', {
              templateUrl : '/views/aluno-cursos.html', 
              isAuth : true,
              controller: 'matriculaController',
              resolve : {
                Authenticated : Authenticated
              }
            });

            $routeProvider.when('/aluno/perfil', {
              templateUrl : '/views/aluno-perfil.html', 
              isAuth : true,
              controller: 'perfilController',
              resolve : {
                 Authenticated : Authenticated
              }
            });

            $routeProvider.when('/aluno/certificados', {
              templateUrl : '/views/aluno-certificados.html', 
              isAuth : true,
              controller: 'certificadoController',
              resolve : {
                 Authenticated : Authenticated
                  
              }
            });

            $routeProvider.when('/aluno/cursos', {
              templateUrl : '/views/aluno-cursos.html', 
              isAuth : true,
              controller: 'matriculaController',
              resolve : {
                 Authenticated : Authenticated
              }
            });

            $routeProvider.when('/aluno/financeiro', {
              templateUrl : '/views/aluno-financeiro.html',
              isAuth : true,
              controller: 'financeiroController',
              resolve : {
                 Authenticated : Authenticated
              }
            });

           $routeProvider.when('/aluno/carrinho/:id', {
              templateUrl : '/views/aluno-carrinho.html',
              isAuth : true,
              controller: 'alunoCarrinhoController',
              resolve : {
                 Authenticated : Authenticated
              }
            });

    }]);
})();
