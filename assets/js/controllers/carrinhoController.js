(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('carrinhoController', ['$scope', '$location', '$filter','authService', 'Config', '$modal', 'carrinhoServive', '$route', '$routeParams',
					 function(scope, $location, $filter, authService, Config, $modal, carrinhoServive, $route, $routeParams ) {

					 	var vm = this;
					 	vm.loading = true;

					 	function setValues(){
					 		vm.itens = carrinhoServive.getItens();
					 		vm.loading = false;
					 		vm.promocaoTheend = carrinhoServive.getPromocaoTheend();
					 		if(vm.itens && vm.itens.length){
		 						vm.showBuy = true;
					 			vm.qtdItens = vm.itens.length;
		 						vm.valorTotal = carrinhoServive.getValorTotal();
					 			vm.totalCarrinho = $filter('currency')(vm.valorTotal, 'R$');
		 					}else{
						 		vm.showBuy = false;
						 		vm.qtdItens = 0;
						 		vm.valorTotal = 0;
						 		vm.totalCarrinho = $filter('currency')(0.0, 'R$');
		 					}
					 	};

					 	(function init(){
					 		if(carrinhoServive.checkCarrinho() && !carrinhoServive.checkItens()){ 
				 				carrinhoServive.getCarrinho()
				 						.then(function (res){
				 								if(res.sucesso && res.carrinho)
				 									setValues();
				 								else if(!res.sucesso && res.transacao){
				 									setValues();
				 									vm.transacao = res.transacao;
				 									vm.transacao.data_envio = $filter('date')( vm.transacao.data_envio*1000, 'dd/MM/yyyy' );
				 								}
			 								});
					 		}else			 		
					 			setValues();
					 	})();

					 	vm.addItemCarrinho = function(produtoid) {
					 		vm.loading = true;
					 		carrinhoServive.addItem({ produto: produtoid })
					 				.then(function(itens){
					 						setValues();
					 					});
					 	};

					 	vm.removeItemCarrinho = function(produtoid, all) {
					 		vm.loading = true;
					 		var all = (typeof all !== 'undefined') ?  1 : 0;
					 		carrinhoServive.removeItem({ produto: produtoid , "remover_tudo" : all })
					 				.then(function(itens){
					 						setValues();
					 					});
					 	};

					 	vm.activeBuy = function(){
					 		vm.showBuy = !vm.showBuy;
					 	};
				 		
					 }]);
})();