(function () {
	'use strict';

	angular
		.module('QiSatApp')
		.controller('trilhaController', ['$controller', '$location', '$window', '$modal', '$modalInstance', '$filter', 'authService', 'carrinhoServive', 'QiSatAPI', 'vcRecaptchaService', 'produto',
			function ($controller, $location, $window, $modal, $modalTrilha, $filter, authService, carrinhoServive, QiSatAPI, vcRecaptchaService, produto) {
				var vm = this;
				var modalController = $controller('modalController');
				vm.showZopim = modalController.showZopim;

				carrinhoServive.getFormas({ produto: produto.id })
					.then(function (formas) {
						var formasCartao;
						formas = formas.reverse();

						if (formas) {
							formasCartao = formas.filter(function (forma) { return forma.tipo && forma.tipo.indexOf('cartao') >= 0 });

							if (formasCartao) {
								formasCartao.map(function (forma) {
									if (forma && forma.operadoras) {
										forma.isCard = true;
										forma.operadoras = forma.operadoras.map(function (op) {
											if (op.img && op.img.nome)
												op.img.nome = op.img.nome.replace('.png', '').toUpperCase();
											return op;
										});

										if (forma.parcelas && forma.parcelas.length) {
											forma.parcelas = forma.parcelas.map(function (parcela) {
												parcela.label = parcela.qtd + 'x de ' + parcela.valor;
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
				if (itens && itens.length) {
					vm.item = itens.find(function (item) {
						return item.ecm_produto_id == produto.id;
					});
					if (vm.item) {
						vm.item.modalidade = vm.item.modalidade;
						vm.item.nome = vm.item.ecm_produto.nome;
						vm.item.valor = $filter('currency')(vm.item.ecm_produto.valor_parcelado, 'R$') + ' x ' + vm.item.ecm_produto.parcelas;
					}
				}


				vm.anoVencimento = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'];
				vm.mesVencimento = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

				vm.cancel = function () {
					$modalTrilha.close();
					$location.path('/carrinho');
				};

				vm.selectForma = function (forma, pagamento) {
					vm.pagamento = pagamento;
					vm.forma = forma;
					vm.nparcelas = null;
					vm.error = false;
				};

				vm.classOperadora = function(op) {

					var opEnable = ['Visa','MasterCard','American Express','Diners Club','Discover','JCB','Elo'];
					var notvalid = opEnable.find(function(el){ return op == el });

					return {
							'card-number': !op, 
							'visa': (op == 'Visa'),
							'master-card': (op == 'MasterCard'),
							'american-express' : (op =='American Express'),
							'dinners-club' : (op =='Diners Club'),
							'discover' : (op == 'Discover'),
							'jcb' : (op =='JCB'),
							'elo' : (op =='Elo'),
							'card-notvalid': (notvalid) ? false : true
						 }
				}

				vm.modalContratoLab = function (fase) {
					vm.user = authService.getUser();
					var contactLab = (fase == 2) ? 55 : 54; // id tipo produto do LAB I e LAB II;
					var modalContrato = $modal.open({
						templateUrl: (fase == 2) ? '/views/modal-contrato-altoqilab2.html' : '/views/modal-contrato-altoqilab.html',
						controller: ['$scope', '$modalInstance',
							function ($scope, $modalInstance) {
								$scope.cancel = function () {
									$modalInstance.close();
								};

								$scope.datanow = moment().format('D [de] MMMM [de] YYYY');

								if (vm.user) $scope.nome = vm.user.firstname + ' ' + vm.user.lastname;
							}]
					});
				};

				vm.nextPagamento = function () {
					var data = {}, tipoPagamento;
					var contactLab = (vm.item.isLab1) ? 54 : 55; // id tipo produto do LAB I e LAB II;

					vm.submitted = true;
					vm.error = false;
					vm.mensagem = '';

					if (vm.pagamento && (vm.nparcelas || (vm.forma.tipo == 'boleto' && !vm.nparcelas) || (vm.forma.tipo == 'checkout' && !vm.nparcelas)) && vm.contrato) {
						if (vm.forma.tipo == 'cartao_recorrencia')
							if (!vm.cartao || !vm.cartao.nome || !vm.cartao.numero || !vm.cartao.mesSelect || !vm.cartao.anoSelect || !vm.contrato)
								return;

						vm.loading = true;
						data.contrato = 1;
						data.operadora = parseInt(vm.pagamento);
						tipoPagamento = vm.formasPagamentos.find(function (forma) { return forma.operadoras.find(function (op) { return op.index == vm.pagamento }) });
						if (tipoPagamento && tipoPagamento.tipos)
							data.tipoPagamento = parseInt(tipoPagamento.tipos[0].index);
						data.valorParcelas = (vm.nparcelas) ? parseInt(vm.nparcelas.qtd) : 1;
						data.cartao = vm.cartao;

						carrinhoServive.setFormasPagamentos(data)
							.then(function (res) {
								vm.loading = false;
								if (res && res.sucesso) {
									if (res.venda && (vm.forma.tipo == 'cartao_recorrencia' || vm.forma.tipo == 'boleto' || vm.forma.dataname == 'api')) {
										$location.path('/carrinho/confirmacao/' + res.venda);
										$modalTrilha.close();
									} else if (res.url)
										$window.location.href = res.url;
									else
										vm.error = true;
								} else {
									vm.error = true;
									if (res && res.mensagem)
										vm.mensagem = res.mensagem;
								}

							}, function (res) {
								vm.loading = false;
								vm.error = true;
							});
					}

				};

			}]);
})();