(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('pagamentoController', ['$scope', '$location', 'authService', '$modal', '$timeout', '$window', '$controller', 'carrinhoServive', 'formasPagamentos', 'Authenticated', 'Itens',
					 function(scope, $location, authService, $modal, $timeout, $window, $controller, carrinhoServive, formasPagamentos, Authenticated, Itens) {

					 	var modalController = $controller('modalController');
					 	var vm = this, forma;
				 		vm.pagamento = 1;
					 	moment.locale('pt-BR');

		 				if(formasPagamentos){
		 					forma = formasPagamentos.find(function(forma){ return forma.pagamento == 'Cartão de Crédito'});
		 					formasPagamentos.map(function(forma){ 
		 						if(forma && forma.operadoras){
			 						forma.operadoras = forma.operadoras.map(function(op){
			 							if(op.img && op.img.nome)
			 								op.img.nome = op.img.nome.replace('.png', '').toUpperCase();
			 							return op;
			 						}); 
		 						}
		 					});
				 			vm.formasPagamentos = formasPagamentos.reverse(); 
		 				}


					 	if(Authenticated && Itens){
					 		vm.user = authService.getUser();
					 		if(vm.user && (!vm.user.email || !vm.user.numero)){
					 			modalController.update('/carrinho/pagamento');
			 					$location.path('/carrinho/');
					 		}

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
													  var itens = carrinhoServive.getItens(), online = [], presencial = [];

													  if(vm.user) $scope.nome = vm.user.nome;

													  if(itens && itens.length){
													  	itens.map(function (item){
													  			var dados = { id: item.id };
														  	 	if(item.ecm_produto){

														  	 		if(item.ecm_produto.enrolperiod){
															  	 		dados.enrolperiod = item.ecm_produto.enrolperiod.toString();
															  	 		dados.enrolperiod = dados.enrolperiod +' ('+dados.enrolperiod.extenso()+') '+' Dias';
														  	 		}

														  	 		dados.modalidade = item.modalidade;
														  	 		dados.nome = item.ecm_produto.nome;

														  	 		if(item.ecm_produto.mdl_course){
														  	 			dados.courses = [];
														  	 			item.ecm_produto.mdl_course.map(function(course){
														  	 				var aux = { id: course.id };
														  	 				if(course.fullname) aux.nome = course.fullname;
														  	 				if(course.timeaccesssection ){
														  	 					aux.time = course.timeaccesssection.toString();
														  	 					aux.time = aux.time +' ('+aux.time.extenso()+') '+' Horas';
														  	 				}
														  	 				dados.courses.push(aux);
														  	 			});
														  	 		}

														  	 		if(item.isOnline || item.isLecture ){
														  	 			dados.isOnline = true;
														  	 			online.push(dados);
														  	 		}else if(item.isSerie || item.isPack ){
														  	 			dados.isOnline = true;
														  	 			online.push(dados);
														  	 		}else if( item.isClassroom ){
														  	 			item.isClassroom = true;

														  	 			if(item.estado && item.cidade)
														  	 				dados.local = item.cidade +' - '+item.estado;

														  	 			if(item.datas && item.datas.length){
														  	 				dados.datas = [];
														  	 				item.datas.map(function(data){
														  	 					dados.datas.push(moment.unix(data.data_inicio).format('DD/MM/YYYY' ));
														  	 				});
														  	 			}
														  	 			presencial.push(dados);
														  	 		}
														  	 	}
														  });

														  $scope.online = online;
														  $scope.presencial = presencial;
													  }
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
									// melhorar solução para quando forma de pogamento possuir mais de um tipo ativo
									if(tipoPagamento && tipoPagamento.tipos) 
										data.tipoPagamento = parseInt(tipoPagamento.tipos[0].index);
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
						 										if(res.venda && (tipoPagamento.tipo =='cartao_recorrencia' || tipoPagamento.tipo =='boleto') ){
																	$location.path('/carrinho/confirmacao/'+res.venda);
				 									   			}else if(res.url){
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

 						 	vm.cancelTransacao = function(){
						 		carrinhoServive.cancelarTransacao().then(function(res){
						 			if(res.sucesso)
						 				$window.location.reload();
						 		});
						 	};

					 	}else
					 		$location.path('/carrinho');
					 }]);
})();