(function() {
  'use strict';

  angular
    .module('QiSatApp')
    .config([ '$httpProvider', '$locationProvider', '$routeProvider',
          function ( $httpProvider, $locationProvider, $routeProvider ) {
          
            $locationProvider.html5Mode(true);    

            $routeProvider.when('/aluno', {
              templateUrl : '/views/aluno-perfil.html', 
              isAuth : true,
              controller: 'perfilController',
              resolve : {
                Authenticated : function(authService){
                      return authService.isAuth() || 
                              authService.verifyAuth().then(function (res){ return (res.data.retorno.sucesso) || false }, function (res){ return false });
                  }
              }
            });

            $routeProvider.when('/aluno/perfil', {
              templateUrl : '/views/aluno-perfil.html', 
              isAuth : true,
              controller: 'perfilController',
              resolve : {
                Authenticated : function(authService){
                      return authService.isAuth() || 
                              authService.verifyAuth().then(function (res){ return (res.data.retorno.sucesso) || false }, function (res){ return false });
                  }
              }
            });

            $routeProvider.when('/aluno/certificados', {
              templateUrl : '/views/aluno-certificados.html', 
              isAuth : true,
              controller: 'certificadoController',
              resolve : {
                Authenticated : function(authService){
                      return authService.isAuth() || 
                              authService.verifyAuth().then(function (res){ return (res.data.retorno.sucesso) || false }, function (res){ return false });
                  },
                certificados : function(authService){
                      return authService.certificados().then(function (res){ if(res.data && res.data.retorno.sucesso) return res.data.retorno.certificado; }, function (res){ return false });
                  }
              }
            });

            $routeProvider.when('/aluno/cursos', {
              templateUrl : '/views/aluno-cursos.html', 
              isAuth : true,
              controller: 'matriculaController',
              resolve : {
                Authenticated : function(authService){
                      return authService.isAuth() || 
                              authService.verifyAuth().then(function (res){ return (res.data.retorno.sucesso) || false }, function (res){ return false });
                  }
              }
            });

            $routeProvider.when('/aluno/financeiro', {
              templateUrl : '/views/aluno-financeiro.html',
              isAuth : true,
              controller: 'financeiroController',
              resolve : {
                Authenticated : function(authService){
                      return authService.isAuth() || 
                              authService.verifyAuth().then(function (res){ return (res.data.retorno.sucesso) || false }, function (res){ return false });
                  },
                compras : function(authService){
                      return authService.compras().then(function (res){ if(res.data && res.data.retorno.sucesso) return res.data.retorno.venda; }, function (res){ return false });
                  }
              }
            });

           $routeProvider.when('/aluno/carrinho/:id', {
              templateUrl : '/views/aluno-carrinho.html',
              isAuth : true,
              controller: 'alunoCarrinhoController',
              resolve : {
                Authenticated : function(authService){
                      return authService.isAuth() || 
                              authService.verifyAuth().then(function (res){ return (res.data.retorno.sucesso) || false }, function (res){ return false });
                  }
              }
            });

            $routeProvider.when('/aluno/desempenho', {
              templateUrl : '/views/aluno-desempenho.html', 
              isAuth : true,
              controller: 'userController',
              resolve : {
                Authenticated : function(authService){
                      return authService.isAuth() || 
                              authService.verifyAuth().then(function (res){ return (res.data.retorno.sucesso) || false }, function (res){ return false });
                  }
              }
            });

    }]);
})();
