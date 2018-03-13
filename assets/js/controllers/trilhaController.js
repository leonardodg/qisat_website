(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('trilhaController', [ '$controller', '$location', '$window', '$modal', '$modalInstance', '$filter' ,'authService', 'carrinhoServive', 'QiSatAPI', 'vcRecaptchaService', 'produto',
					 function( $controller, $location, $window, $modal, $modalTrilha, $filter, authService,  carrinhoServive, QiSatAPI, vcRecaptchaService, produto ) {
					 	var vm = this;
					 	var modalController = $controller('modalController');
					 		vm.showZopim = modalController.showZopim;

		 				carrinhoServive.getFormas({ produto : produto.id })
                                       .then(function (formas){
                                      		var formasCartao;
								 			formas = formas.reverse(); 

											if(formas){
							 					formasCartao = formas.filter(function(forma){ return forma.tipo && forma.tipo.indexOf('cartao')>=0 });

							 					if(formasCartao){
								 					formasCartao.map(function(forma){
								 						if(forma && forma.operadoras){
								 							forma.isCard = true;
									 						forma.operadoras = forma.operadoras.map(function(op){
									 							if(op.img && op.img.nome)
									 								op.img.nome = op.img.nome.replace('.png', '').toUpperCase();
									 							return op;
									 						});

									 						if(forma.parcelas && forma.parcelas.length){
											 					forma.parcelas = forma.parcelas.map(function(parcela){
											 						parcela.label = parcela.qtd+'x de '+parcela.valor;
											 						return parcela;
											 					});
											 					forma.nparcelas = forma.parcelas[0];
										 					}
								 						}
								 					});
							 					}
							 				}
							 				vm.formasPagamentos = formas;
                                      });

                        var itens = carrinhoServive.getItens();
						if(itens && itens.length){
							  	vm.item = itens.find(function (item){
											  	 	return item.isSetup;
											 });
							  	if(vm.item){
								  	vm.item.modalidade = vm.item.modalidade;
					  	 			vm.item.nome = vm.item.ecm_produto.nome;
					  	 			vm.item.valor =  $filter('currency')(vm.item.ecm_produto.valor_parcelado, 'R$') + ' x '+ vm.item.ecm_produto.parcelas;
					  	 		}
						}


						vm.anoVencimento = [ '2018','2019','2020','2021','2022','2023','2024', '2025','2026','2027','2028','2029', '2030'];
						vm.mesVencimento = [ '01','02','03','04','05','06','07','08','09','10','11','12' ];

						vm.cancel = function () {
							$modalTrilha.dismiss('cancel');
							$location.path('/carrinho');
						};

						vm.selectForma = function(forma, pagamento){
							vm.pagamento = pagamento;
							vm.forma = forma;
							vm.nparcelas = null;
							vm.error = false;
						};

				 		vm.modalcontrato = function () {
	 						var modalContrato = $modal.open({
	 							templateUrl: '/views/modal-contrato.html',
	 							controller : function ($scope, $modalInstance) {
												  $scope.cancel = function () {
												    $modalInstance.close();
												  };
												  
												  var itens = carrinhoServive.getItens(), online = [], presencial = [];

												  if(vm.user) $scope.nome = vm.user.nome;

												  if(itens && itens.length){
												  	itens.map(function (item){
												  			var dados = { id: item.id };
													  	 	if(item.ecm_produto && item.isSetup){

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

													  	 		online.push(dados);
													  	 	}
													  });

													  $scope.online = online;
												  }
												}
	 						});
		 			    };

					 	vm.nextPagamento = function(){
					 		var data = {},tipoPagamento;
					 			vm.submitted = true;

								if(vm.pagamento){
									if(vm.forma.tipo =='cartao_recorrencia')
										if(!vm.cartao || !vm.cartao.nome || !vm.cartao.numero || !vm.cartao.mesSelect || !vm.cartao.anoSelect || !vm.contrato)
											return;
									
						 			vm.loading = true;
						 			vm.error = false;
						 			data.contrato = 1;
						 			data.operadora = parseInt(vm.pagamento);
									tipoPagamento = vm.formasPagamentos.find(function (forma){ return forma.operadoras.find(function (op){ return op.index == vm.pagamento })});
									if(tipoPagamento && tipoPagamento.tipos) 
										data.tipoPagamento = parseInt(tipoPagamento.tipos[0].index);
									data.valorParcelas = (vm.nparcelas) ? parseInt(vm.nparcelas.qtd) : 1;
									data.cartao = vm.cartao;

									carrinhoServive.setFormasPagamentos(data)
			 									   .then(function (res){
			 									   		vm.loading = false;
			 									   		if(res && res.sucesso){
			 									   			if(res.venda && (vm.forma.tipo =='cartao_recorrencia' || vm.forma.tipo =='boleto') ){
																$location.path('/carrinho/confirmacao/'+res.venda);
																$modalTrilha.dismiss('cancel');
			 									   			}else if(res.url)
			 									   				$window.location.href = res.url;
			 									   			else
																vm.error = true;
			 									   		}else
			 									   			vm.error = true;
													}, function (res){
														vm.loading = false;
														vm.error = true;
													});
							}

					 	};

					 }]);
})();