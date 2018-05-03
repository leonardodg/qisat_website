(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('carrinhoController', [ '$rootScope', '$controller' ,'$filter', '$location', 'Config', 'carrinhoServive', 'authService',
					 function( $rootScope, $controller, $filter, $location, Config, carrinhoServive, authService) {

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
					 		vm.promocaoTheend = carrinhoServive.getPromocaoTheend();
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
					 	};

					 	(function init(){
					 		if(carrinhoServive.checkCarrinho() && !carrinhoServive.checkItens()){ 
				 				carrinhoServive.getCarrinho()
				 						.then(function (res){
				 							  	var valor, transacao;
				 								if(res.sucesso && res.carrinho)
				 									setValues();
				 								else if(!res.sucesso && res.transacao){
				 									vm.editCarrinho = false;
				 									setValues();
			 										transacao = res.transacao;
				 									
				 									if( transacao.status == 'erro'){
				 										vm.transacaoErro = transacao;
				 										modalController.alert({ error : true, main : { title : "Ocorreu uma Falha no pagamento!", subtitle : "Tente novamente!" } });
				 									}else if( transacao.status == 'aguardando_pagamento'){
					 									transacao.data_envio = $filter('date')( transacao.data_envio*1000, 'dd/MM/yyyy' );
					 									if(transacao.numero_parcelas	 > 1){
					 										valor = transacao.valor / ransacao.numero_parcelas;
					 										valor = $filter('currency')(valor, 'R$');
					 									}else
					 										valor = $filter('currency')(transacao.valor, 'R$');
					 									transacao.parcelas = transacao.numero_parcelas+'x de '+valor;

		 												vm.transacaoOpen = transacao;
				 									}
				 								}
			 								});
					 		}else			 		
					 			setValues();
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
									if(RdIntegration) RdIntegration.post(data_rd);
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

					 	$rootScope.$watch( function(){ return carrinhoServive.checkCarrinho(); },
					 					   function(val){ setValues(); }, true);
				 		
					 }]);
})();