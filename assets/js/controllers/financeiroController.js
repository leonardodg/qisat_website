(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('financeiroController', ['$rootScope', '$scope', '$location', '$filter','authService','Authenticated',
					 function($rootScope, scope, $location, $filter, authService, Authenticated ) {

					 	$rootScope.loading = true;
				 		scope.currentPage = 1;
				 		scope.startPage = 1;
				 		scope.itemsPerPage = 10;

					 	if(Authenticated){
					 		scope.user = authService.getUser();
					 		authService.compras()
					 		 		   .then( function (res){ 
					 		 		   			if(res.data && res.data.retorno.sucesso){
					 		 		   				scope.compras = res.data.retorno.venda; 
				 		 		   					scope.compras.map(function(pedido){
											 			pedido.dataFormat = $filter('date')( pedido.data*1000, 'dd/MM/yyyy - HH:mm:ss' );
											 			pedido.valor = $filter('currency')(pedido.valor, 'R$ ');
											 		});
											 		scope.totalItems = scope.compras.length;
					 		 		   			}

					 		 		   			$rootScope.loading = false;
					 		 		   	});
						}

						scope.onSelectPage = function(page){
				 			if(page==1)
				 				scope.startPage = 1;
				 			else
				 				scope.startPage = scope.itemsPerPage*(page-1);
				 		};

					 	scope.viewCarrinho = function(id){
					 		$location.path("/aluno/carrinho/"+id);
					 	};

					 }]);
})();