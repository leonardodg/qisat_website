(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('trilhaController', [ '$controller', '$location', '$window', '$modalInstance', 'authService', 'carrinhoServive', 'QiSatAPI', 'vcRecaptchaService', 'produto',
					 function( $controller, $location, $window, $modalInstance, authService,  carrinhoServive, QiSatAPI, vcRecaptchaService, produto ) {
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




						vm.anoVencimento = [ '2017','2018','2019','2020','2021','2022','2023','2024', '2025','2026','2027','2028','2029', '2030'];
						vm.mesVencimento = [ '01','02','03','04','05','06','07','08','09','10','11','12' ];

						vm.cancel = function () {
							$modalInstance.dismiss('cancel');
							$location.path('/carrinho');
						};

						vm.selectForma = function(forma, pagamento){
							vm.pagamento = pagamento;
							vm.forma = forma;
							vm.nparcelas = null;
						}


					 	vm.nextPagamento = function(){
					 		var data = {},tipoPagamento;
					 			vm.submitted = true;

								if(vm.pagamento){
									if(vm.forma.tipo =='cartao_recorrencia')
										if(!vm.cartao || !vm.cartao.nome || !vm.cartao.numero || !vm.cartao.mesSelect || !vm.cartao.anoSelect )
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
			 									   			if(res.url)
			 									   				$window.location.href = res.url;
			 									   			else if(res.venda && (vm.forma.tipo =='cartao_recorrencia' || vm.forma.tipo =='boleto') ){
																$location.path('/carrinho/confirmacao/'+res.venda);
																$modalInstance.dismiss('cancel');
			 									   			}else
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