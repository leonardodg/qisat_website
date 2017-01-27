(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('pagamentoController', ['$scope', '$location', 'authService', '$modal', '$timeout', '$window', 'carrinhoServive', 'formasPagamentos', 'Authenticated',
					 function(scope, $location, authService, $modal, $timeout, $window, carrinhoServive, formasPagamentos, Authenticated) {

					 	var vm = this;
		 				var forma = formasPagamentos.find(function(forma){ return forma.pagamento == 'Cartão de Crédito'});
					 		vm.formasPagamentos = formasPagamentos; 
					 		vm.pagamento = 4;


					 	if(authService.isLogged() && Authenticated){

					 		vm.user = authService.getUser();
			 				if(forma) {
			 					vm.parcelas = forma.parcelas;
			 					if(vm.parcelas && vm.parcelas.length){
				 					vm.parcelas.map(function(parcela){
				 						parcela.label = parcela.qtd+'x de '+parcela.valor;
				 					});
				 					vm.nparcelas = vm.parcelas[0];
			 					}
			 				}

					 		vm.modalcontrato = function () {
		 						var modalInstance = $modal.open({
		 							templateUrl: '/views/modal-contrato.html',
		 							controller : function ($scope, $modalInstance) {
													  $scope.cancel = function () {
													    $modalInstance.dismiss('cancel');
													  };
													  var itens = carrinhoServive.getItens(), online = [], presencial = [], tipo;

													  $scope.nome = vm.user.nome;

													  itens.map(function (item){
													  	 var i = {
													  	 			enrolperiod : item.ecm_produto.enrolperiod,
													  	 			courses : []
													  	 		 };

													  	 	item.mdl_course.map(function(course){
													  	 			i.courses.push( course );
													  	 	});

													  });

													  $scope.itens = dados;

													}
		 						});
			 			    };


						 	vm.nextPagamento = function(form){
						 		vm.submitted = true;
						 		var data = {},tipoPagamento;
						 		if(!form.$error.required){
						 			vm.loading = true;
						 			data.contrato = 1;
						 			data.operadora = parseInt(vm.pagamento);
									tipoPagamento = vm.formasPagamentos.find(function (forma){ return forma.operadoras.find(function (op){ return op.index == vm.pagamento })});
									if(tipoPagamento) data.tipoPagamento = parseInt(tipoPagamento.index);
									data.valorParcelas = parseInt(vm.nparcelas.qtd);

									carrinhoServive.getCarrinho()
				 						.then(function (res){
				 								if(res.sucesso && res.carrinho){
					 								var produtos = [], itens = res.carrinho['ecm_carrinho_item'];
					 								if(itens && itens.length){
					 									itens.map(function (item){
						 									produtos.push({ produto : item.ecm_produto_id, quantidade:item.quantidade, valor : item.valor_produto_desconto });			 										
					 									});
					 									data.itens = produtos;
						 								carrinhoServive.setFormasPagamentos(data).then(function (res){ 
						 										
																if(vm.pagamento==4)
																	$location.path('/carrinho/confirmacao/'+res.venda)
																else{
																	vm.loading = false;
																	vm.redirect = res.url;
																	$timeout(function() {
																      	$window.location.href = res.url;
																      }, 10000);
																}
														});
					 								}
					 							}
			 								});
						 		}
						 	}

					 	}
					 		
				 		
					 }]);
})();