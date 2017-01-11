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
					 		scope.currentPage = 1;
					 		scope.startPage = 1;
					 		scope.itemsPerPage = 10;
					 		scope.totalItems = compras.length;
					 		scope.onSelectPage = function(page){
					 			if(page==1)
					 				scope.startPage = 1;
					 			else
					 				scope.startPage = scope.itemsPerPage*(page-1);
					 		};
					 	}

					 	scope.viewCarrinho = function(id){
					 		$location.path("/aluno/carrinho/"+id);
					 	};

					 }]);
})();