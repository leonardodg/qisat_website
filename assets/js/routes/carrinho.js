(function() {
  'use strict';

  angular
    .module('QiSatApp')
    .config([ '$httpProvider', '$locationProvider', '$routeProvider',
          function ( $httpProvider, $locationProvider, $routeProvider ) {
            $locationProvider.html5Mode(true); 

            $routeProvider.when('/carrinho', {
              templateUrl : '/views/carrinho-montar.html',
              controller : 'montarCarrinhoController as vm'
            });

            $routeProvider.when('/carrinho/pagamento', {
              templateUrl : '/views/carrinho-pagamento.html',
              controller : 'pagamentoController as vm',
              resolve : {
                  Authenticated : function(authService){
                      return authService.isAuth() || 
                              authService.verifyAuth()
                                         .then( function (res){ 
                                                  if(res) return true; else $location.path('/carrinho'); 
                                                }, function (res){ 
                                                      $location.path('/carrinho');
                                                });
                  },
                  Itens : function(carrinhoServive){
                          if(carrinhoServive.checkCarrinho() && !carrinhoServive.checkItens()){
                              return carrinhoServive.getCarrinho()
                                             .then(function (res){
                                                    return carrinhoServive.getItens();
                                              });
                          }else         
                              return carrinhoServive.getItens();
                  },
                  formasPagamentos : function (carrinhoServive){
                         return carrinhoServive.getFormas()
                                         .then(function (formas){ 
                                            return formas;
                                          });
                  }
              }
            });

            $routeProvider.when('/carrinho/confirmacao/:id', {
              templateUrl : '/views/carrinho-confirmacao.html',
              controller : 'confirmacaoController as vm',
              resolve : {
                  Authenticated : function(authService){
                      return authService.isAuth() || 
                              authService.verifyAuth()
                                         .then( function (res){ 
                                                  if(res) return true; else $location.path('/carrinho'); 
                                                }, function (res){ 
                                                      $location.path('/carrinho');
                                                });
                  },
                  venda : function (carrinhoServive, $route){
                          if(carrinhoServive.checkCarrinho())
                              return carrinhoServive.getVenda($route.current.params.id)
                                           .then(function (res){ 
                                              if(res.sucesso)
                                                return res.venda;
                                            });
                          else
                               return false;
                    }
              }

            });

            $routeProvider.otherwise('/carrinho');
    }]);
})();



