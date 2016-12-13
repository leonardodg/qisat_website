(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('financeiroController', ['$scope', '$location', '$filter','authService','Authenticated', 'compras',
					 function(scope, $location, $filter, authService, Authenticated, compras ) {

					 	if(authService.isLogged() && Authenticated)
					 		scope.user = authService.getUser();

					 	if(compras){
					 		compras.map(function(pedido){
					 			pedido.dataFormat = $filter('date')( pedido.data*1000, 'dd/MM/yyyy - HH:mm:ss' );
					 			pedido.valor = $filter('currency')(pedido.valor, 'R$ ');
					 		});
					 		scope.compras = compras;
					 	}

					 	scope.viewCarrinho = function(id){
					 		$location.path("/aluno/carrinho/"+id);
					 	};

					 }]);
})();