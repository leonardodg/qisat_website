(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('carrinhoController', [ '$rootScope', '$scope', '$controller' ,'$filter', '$location', 'Config', 'carrinhoServive', 'authService',
					 function( $rootScope, scope, $controller, $filter, $location, Config, carrinhoServive, authService) {

					 	var vm = this;
						var modalController = $controller('modalController');

						vm.loading = true;
					 	if($location.path().indexOf('/proposta') >=0)
					 		vm.editCarrinho = false;
					 	else
					 		vm.editCarrinho = true;

					 	function setValues(){
					 		vm.itens = carrinhoServive.getItens();
					 		vm.loading = false;
					 		vm.hasTrilha = carrinhoServive.hasTrilha();
					 		vm.showContract = carrinhoServive.showContract();
					 		vm.promocaoTheend = carrinhoServive.getPromocaoTheend();
							vm.transacao = carrinhoServive.getTransacao();
							carrinhoServive.getCupom().then(function(cupom){
								scope.cupom = vm.cupom = cupom;
							});

					 		if(vm.itens && vm.itens.length){
					 			
					 			if(vm.hasTrilha){
					 				vm.trilhas = [];
						 			vm.itens = vm.itens.map(function(item){
						 				if(item.isSetup)
						 					vm.trilhas.push(item);
						 				else
						 					return item;
						 			});

						 			vm.itens = vm.itens.filter(function(item){ return item });

						 			vm.valorTotal = vm.itens.reduce(function(a, b){
						 				return a + b.total;
						 			}, 0);

					 			}else
		 							vm.valorTotal = carrinhoServive.getValorTotal();


					 			vm.qtdItens = vm.itens.reduce(function(a, b){
					 				return a + b.quantidade;
					 			}, 0);

					 			vm.totalCarrinho = $filter('currency')(vm.valorTotal, 'R$');

		 					}else{
						 		vm.qtdItens = 0;
						 		vm.valorTotal = 0;
						 		vm.totalCarrinho = $filter('currency')(0.0, 'R$');
		 					}

		 					if(vm.transacao){
		 						vm.editCarrinho = false;
		 						if( vm.transacao.status == 'aguardando_pagamento'){
									vm.transacaoOpen = vm.transacao;
								}else if( vm.transacao.status == 'negada' ){
									modalController.alert({ error : true, main : { title : "Pagamento Negado!", subtitle : vm.transacao.mensagem } });
								}else if( vm.transacao.status == 'erro' ){
									modalController.alert({ error : true, main : { title : "Pagamento não Realizado!", subtitle : vm.transacao.erro || vm.transacao.mensagem } });
								}else if( vm.transacao.status == 'cancelada'){
									modalController.alert({ error : true, main : { title : "Pagamento não Realizado!", subtitle : "Operação foi cancelada!" } });
								}
		 					}
					 	};

					 	(function init(){
					 		authService.Authenticated().then(function(res){
						 		if(carrinhoServive.checkCarrinho()){
					 				carrinhoServive.getCarrinho()
					 						.then(function (res){
					 								if((res.sucesso && res.carrinho) || (!res.sucesso && res.carrinho))
					 									setValues();
				 								});
						 		}else			 		
						 			setValues();
					 		});
					 	})();

					 	vm.addItemCarrinho = function(produto, qtd, turma) {

					 			var user = authService.getUser();
								var auth = authService.Authenticated();
								var data_rd;

								if(auth === true){
									data_rd = [
											      { name: 'email', value: user.email },
											      { name: 'nome', value: user.firstname+' '+user.lastname },
											      { name: 'phone', value: user.phone1 },
											      { name: 'cpf', value: user.numero },
											      { name: 'curso', value: produto.sigla },
											      { name: 'token_rdstation', value: Config.tokenRD },
											      { name: 'identificador', value: 'Adicionou Curso - QiSat' }
											    ];

									if(user.idnumber) data_rd.push({ name: 'chavealtoqi', value: user.idnumber });
									if(typeof RdIntegration != 'undefined') RdIntegration.post(data_rd);
								}

					 		vm.loading = true;

					 		if(($location.path() != '/carrinho') || ($location.path().indexOf('/proposta') >=0))
						 		vm.showBuy = true;

					 		var data = { produto: produto.id };
					 		if(qtd && typeof qtd !== 'undefined' ) data.quantidade = qtd;
					 		if(turma) data.presencial = turma;

					 		carrinhoServive.addItem(data)
					 				.then(function(itens){
					 						setValues();
					 					});
					 	};

					 	vm.trilha = function(produto) {
					 		var data = { produto: produto.id };
					 		carrinhoServive.addItem(data)
					 				.then(function(itens){
					 						setValues();
					 						modalController.trilha(produto);
					 					});
					 	};

					 	vm.removeItemCarrinho = function(produtoid, all, turma) {
					 		vm.loading = true;
					 		var data = { produto: produtoid };
					 		if(typeof turma !== 'undefined') data.presencial = turma;
					 		data.remover_tudo = (all && typeof all !== 'undefined') ?  1 : 0;

					 		carrinhoServive.removeItem(data)
					 				.then(function(itens){
					 						setValues();
					 					});
					 	};

					 	vm.activeBuy = function(){
					 		vm.showBuy = !vm.showBuy;
					 	};

						vm.validCupom = function(cupom){
							if( (((cupom && cupom != '')&& (cupom != vm.cupom)) || (cupom=='' && vm.cupom) ) ) {
								carrinhoServive.validCupom(cupom).then(function(res){
									carrinhoServive.getCarrinho()
					 						.then(function (res){
					 								if((res && res.sucesso && res.carrinho) || (res && !res.sucesso && res.carrinho) || (res === false))
					 									setValues();
				 								});
								})
							}
						};

					 	$rootScope.$watch( function(){ return carrinhoServive.getItens(); },
											function(val){ setValues(); }, true);
				 								
					 }]);
})();