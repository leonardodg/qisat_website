(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('pagamentoController', ['$scope', '$location', 'authService', '$modal', '$timeout', '$window', '$controller', 'carrinhoServive', 'formasPagamentos', 'Authenticated', 
					 function(scope, $location, authService, $modal, $timeout, $window, $controller, carrinhoServive, formasPagamentos, Authenticated) {

					 	var modalController = $controller('modalController');
					 	var vm = this;
					 		moment.locale('pt-BR');

						vm.anoVencimento = [ '2018','2019','2020','2021','2022','2023','2024', '2025','2026','2027','2028','2029', '2030'];
						vm.mesVencimento = [ '01','02','03','04','05','06','07','08','09','10','11','12' ];

		 				if(formasPagamentos){
		 					formasPagamentos.map(function(forma){

		 						if(forma.tipo && forma.tipo.indexOf('cartao') >= 0 )
		 							forma.isCard = true;
		 						
		 						if(forma && forma.operadoras){
			 						forma.operadoras = forma.operadoras.map(function(op){
			 							if(op.img && op.img.nome)
			 								op.img.nome = op.img.nome.replace('.png', '').toUpperCase();
			 							return op;
			 						}); 
		 						}

			 					if(forma.parcelas && forma.parcelas.length){
				 					forma.parcelas.map(function(parcela){
				 						parcela.label = parcela.qtd+'x de '+parcela.valor;
				 					});
			 					}
		 					});

				 			vm.formasPagamentos = formasPagamentos.reverse();
		 				}

						vm.selectForma = function(forma, pagamento){
							vm.pagamento = pagamento;
							vm.forma = forma;
							if(vm.forma && vm.forma.parcelas && vm.forma.parcelas.length){
								vm.parcelas = vm.forma.parcelas;
								vm.nparcelas = null;
							}

							vm.error = false;
						};

					 	if(Authenticated){

							carrinhoServive.getCarrinho();
												 
					 		vm.user = authService.getUser();
					 		if(vm.user && (!vm.user.email || !vm.user.numero)){
					 			modalController.update('/carrinho/pagamento');
			 					$location.path('/carrinho/');
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
														  	 		}else if((item.isSerie || item.isPack) && !item.isSetup ){
														  	 			dados.isPack = true;
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

								if(vm.pagamento && (vm.nparcelas || (vm.forma.tipo =='boleto' && !vm.nparcelas)) && (vm.contrato || (!vm.contrato && !carrinhoServive.showContract()))){
									if(vm.forma.tipo =='cartao_recorrencia')
										if(!vm.cartao || !vm.cartao.nome || !vm.cartao.numero || !vm.cartao.mesSelect || !vm.cartao.anoSelect || (!vm.contrato && carrinhoServive.showContract()))
											return;
										else
											data.cartao = vm.cartao;

						 			vm.loading = true;
						 			vm.error = false;
						 			data.contrato = 1;
									data.operadora = parseInt(vm.pagamento);
									tipoPagamento = vm.formasPagamentos.find(function (forma){ return forma.operadoras && forma.operadoras.find(function (op){ return op.index == vm.pagamento })});
									// melhorar solução para quando forma de pogamento possuir mais de um tipo ativo
									if(tipoPagamento && tipoPagamento.tipos) 
										data.tipoPagamento = parseInt(tipoPagamento.tipos[0].index);
									data.valorParcelas = (vm.nparcelas) ? parseInt(vm.nparcelas.qtd) : 1;

									carrinhoServive.getCarrinho()
				 						.then(function (res){
				 								if(res && res.carrinho && res.carrinho['ecm_carrinho_item']){
					 								var produtos = [], itens = res.carrinho['ecm_carrinho_item'];
					 								if(itens && itens.length){
					 									itens.map(function (item){
					 										if(!item.isSetup)
						 										produtos.push({ produto : item.ecm_produto_id, quantidade:item.quantidade, valor : item.valor_produto_desconto });			 										
					 									});
					 									data.itens = produtos;
						 								carrinhoServive.setFormasPagamentos(data).then(function (res){ 
						 										if(res.sucesso){
																	vm.loading = false;
							 										if(res.venda && (tipoPagamento.tipo =='cartao_recorrencia' || tipoPagamento.tipo =='boleto') ){
																		$location.path('/carrinho/confirmacao/'+res.venda);
					 									   			}else if(res.url){
																		vm.redirect = res.url;

				 									   					$timeout(function() {
																		      	$window.location.href = res.url;
																		      }, 10000);
					 									   			}
					 									   		}else{
						 											vm.loading = false;
				 									   				modalController.alert({ error : true, main : { title : "Falha no sistema de Pagamento!", subtitle : "Entre em contato com a nossa Central de Inscrições - (48) 3332-5000" } });
				 									   			}
														}, function() {
															vm.loading = false;
															modalController.alert({ error : true, main : { title : "Falha no sistema de Pagamento!", subtitle : "Entre em contato com a nossa Central de Inscrições - (48) 3332-5000" } });
														});
					 								}
					 							}
			 								}, function() {
			 									vm.loading = false;
			 									modalController.alert({ error : true, main : { title : "Falha no sistema de Pagamento!", subtitle : "Tente novamente!" } });
			 								});
						 		}
						 	}

 						 	vm.cancelTransacao = function(){
						 		carrinhoServive.cancelarTransacao().then(function(res){
					 				$window.location.reload();
						 		});
						 	};

					 	}else
					 		$location.path('/carrinho');
					 }]);
})();