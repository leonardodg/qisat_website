(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('compraController', ['$scope', '$location', '$filter','authService', '$modal', 'carrinho', 'Authenticated',
					 function(scope, $location, $filter, authService, $modal, carrinho, Authenticated ) {

					 	var vm = this;

					 	if(authService.isLogged() && Authenticated)
					 		vm.user = authService.getUser();

					 	(function init(){
					 		if(carrinho.checkCarrinho())
					 			if(carrinho.checkItens())
					 				vm.itens = carrinho.getItens();
					 			else
					 				carrinho.getCarrinho().then(function(res){
					 					vm.itens = res['ecm_carrinho_item'];
					 				});
					 			// console.log(vm.itens);
					 			vm.itens = ['0'];
					 	})();	

					 	
					 	vm.modallogin = function () {
				 					var modalInstance = $modal.open({
				 							templateUrl: '/views/modal-login.html',
				 							controller : function ($scope, $modalInstance) {
															  $scope.cancel = function () {
															    $modalInstance.dismiss('cancel');
															  };
															},
											windowClass : 'loginModal'
				 						});
					 			  };


					 	vm.addItemCarrinho = function(produto) {
					 		console.log(produto);
					 		carrinho.addItem({ produto: produto.id }).then(function(itens){
					 				// console.log(itens);
					 				vm.itens = itens;
					 		});
					 	};
				 		
					 }]);
})();