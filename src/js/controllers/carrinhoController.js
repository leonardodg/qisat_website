(function () {
	'use strict';

	angular
		.module('QiSatApp')
		.controller('carrinhoController', ['$rootScope', '$scope', '$controller', '$filter', '$window', '$location', 'Config', 'carrinhoServive', 'authService',
			function ($rootScope, scope, $controller, $filter, $window, $location, Config, carrinhoServive, authService) {

				var vm = this;
				var modalController = $controller('modalController');

				vm.loading = true;

				function setValues() {
					vm.itens = carrinhoServive.getItens();
					vm.loading = false;
					vm.licenca = "";
					vm.hasTrilha = carrinhoServive.hasTrilha();
					vm.showContractOnline = carrinhoServive.showContract(2);
					vm.showContractEberick = carrinhoServive.showContract(56);
					vm.showContractQiBuilder = carrinhoServive.showContract(57);
					vm.promocaoTheend = carrinhoServive.getPromocaoTheend();
					vm.transacao = carrinhoServive.getTransacao();
					carrinhoServive.getCupom().then(function (cupom) {
						scope.cupom = vm.cupom = cupom;
					});

					if (vm.itens && vm.itens.length) {

						if (vm.hasTrilha) {
							vm.trilhas = [];
							vm.itens = vm.itens.map(function (item) {
								if (item.isSetup)
									vm.trilhas.push(item);
								else
									return item;
							});

							vm.itens = vm.itens.filter(function (item) { return item });

							vm.valorTotal = vm.itens.reduce(function (a, b) {
								return a + b.total;
							}, 0);

						} else{
							vm.valorTotal = carrinhoServive.getValorTotal();

							if(carrinhoServive.checkRenovacao()){
								vm.itens.map(function (item) {

									if(item.isEberick && item.modulos.length > 0){
										item.modulos.find(function (mod) { vm.licenca = mod.licenca }); 
									}
	
									if(item.isQibuilder && item.apps.length > 0 && vm.licenca == "" ){
										item.apps.find(function (app) { vm.licenca = app.licenca }); 
									}
								});
							}
						}


						vm.qtdItens = vm.itens.reduce(function (a, b) {
							return a + b.quantidade;
						}, 0);

						vm.totalCarrinho = $filter('currency')(vm.valorTotal, 'R$');

					} else {
						vm.qtdItens = 0;
						vm.valorTotal = 0;
						vm.totalCarrinho = $filter('currency')(0.0, 'R$');
					}

					if (vm.transacao) {
						vm.editCarrinho = false;
						if (vm.transacao.status == 'aguardando_pagamento') {
							vm.transacaoOpen = vm.transacao;
						} else if (vm.transacao.status == 'negada') {
							modalController.alert({ error: true, main: { title: "Pagamento Negado!", subtitle: vm.transacao.mensagem } });
						} else if (vm.transacao.status == 'erro') {
							modalController.alert({ error: true, main: { title: "Pagamento não Realizado!", subtitle: vm.transacao.erro || vm.transacao.mensagem } });
						} else if (vm.transacao.status == 'cancelada') {
							modalController.alert({ error: true, main: { title: "Pagamento não Realizado!", subtitle: "Operação foi cancelada!" } });
						}
					}
				}

				(function init() {
					authService.Authenticated().then(function (res) {
						if (carrinhoServive.checkCarrinho()) {
							carrinhoServive.getCarrinho()
								.then(function (res) {
									if ((res.sucesso && res.carrinho) || (!res.sucesso && res.carrinho))
										setValues();
								});
						} else
							setValues();
					});
				})();

				vm.addItemCarrinho = function (produto, qtd, turma) {

					var user = authService.getUser();
					var auth = authService.Authenticated();
					var data_rd;

					if (Config.environment == 'production') {
						$window.fbq('track', 'AddToCart');
					}

					if (auth === true && Config.environment == 'production') {
						data_rd = [
							{ name: 'email', value: user.email },
							{ name: 'nome', value: user.firstname + ' ' + user.lastname },
							{ name: 'phone', value: user.phone1 },
							{ name: 'cpf', value: user.numero },
							{ name: 'curso', value: produto.sigla },
							{ name: 'token_rdstation', value: Config.tokens.rdstation },
							{ name: 'identificador', value: 'Adicionou Curso - QiSat' }
						];

						if (typeof user !== "undefined" && user.idnumber) data_rd.push({ name: 'chavealtoqi', value: user.idnumber });
						if (typeof RdIntegration !== "undefined") RdIntegration.post(data_rd);
					}

					if (typeof dataLayer !== "undefined" && Config.environment == 'production') {

						var price = (typeof produto.preco == 'string') ? produto.preco.replace(/^(R\$)(\d+)?.?(\d+),([0-9]{2})$/g, '$2$3.$4') : produto.preco;

						dataLayer.push({
							'event': 'ecommerce.add',
							'ecommerce': {
								'add': {
									'products': [{
										'name': produto.sigla,
										'id': produto.id,
										'price': price,
										'category': produto.modalidade,
										'quantity': qtd || 1,
									}]
								}
							}
						});
					}

					vm.loading = true;

					/*if (($location.path() != '/carrinho') || ($location.path().indexOf('/proposta') >= 0) || ($location.path().indexOf('/renovacao') >= 0) ){
						vm.showBuy = true;
					}*/

					var data = { produto: produto.id };
					if (qtd && typeof qtd !== 'undefined') data.quantidade = qtd;
					if (turma) data.presencial = turma;

					carrinhoServive.addItem(data)
						.then(function (itens) {
							carrinhoServive.getFormas().then(function (formas) {
								if (formas) {
									formas.forEach(function (forma) { 
										if(forma.controller == "PagarMe"){
											modalController.isPagarme = true;
											modalController.maxInstallments = forma.parcelas.length;
											var installments = document.getElementById("installments");
											if(installments)
												installments.textContent = modalController.maxInstallments;
											return false;
										}
									});
									if(modalController.isPagarme){ 
										if(authService.isLogged())
											modalController.pagarme();
										else if(document.getElementById("pagarme-checkout-ui") == null)
											vm.modal = modalController.login();
									} else if (($location.path() != '/carrinho') || ($location.path().indexOf('/proposta') >= 0) || ($location.path().indexOf('/renovacao') >= 0) ){
										vm.showBuy = true;
									}
								}
								vm.formasPagamentos = formas;
							});
							setValues();
						});
				};

				vm.trilha = function (produto) {
					var data = { produto: produto.id };
					carrinhoServive.addItem(data)
						.then(function (itens) {
							setValues();
							modalController.trilha(produto);
						});
				};

				vm.removeItemCarrinho = function (item, all, turma) {
					vm.loading = true;

					if (typeof dataLayer !== "undefined" && Config.environment == 'production') {

						var price = (typeof item.valor_produto_desconto == 'string') ? item.valor_produto_desconto.replace(/^(R\$)(\d+)?.?(\d+),([0-9]{2})$/g, '$2$3.$4') : item.valor_produto_desconto;

						dataLayer.push({
							'event': 'ecommerce.remove',
							'ecommerce': {
								'remove': {
									'products': [{
										'name': item.ecm_produto.sigla,
										'id': item.ecm_produto_id,
										'price': price,
										'category': item.modalidade,
										'quantity': item.quantidade || 1,
									}]
								}
							}
						});

					}

					var data = { produto: item.ecm_produto_id };
					if (typeof turma !== 'undefined') data.presencial = turma;
					data.remover_tudo = (all && typeof all !== 'undefined') ? 1 : 0;

					carrinhoServive.removeItem(data)
						.then(function (itens) {
							carrinhoServive.getFormas().then(function (formas) {
								if (formas) {
									formas.forEach(function (forma) { 
										if(forma.controller == "PagarMe"){
											var installments = document.getElementById("installments");
											if(installments)
												installments.textContent = forma.parcelas.length;
											return false;
										}
									});
								}
							});
							setValues();
							if(!vm.valorTotal)
								document.getElementById("pagarme-checkout-close-link").click();
						});
				};

				vm.activeBuy = function () {
					vm.showBuy = !vm.showBuy;
				};

				vm.validCupom = function (cupom) {
					if ((((cupom && cupom != '') && (cupom != vm.cupom)) || (cupom == '' && vm.cupom))) {
						carrinhoServive.validCupom(cupom).then(function (res) {
							carrinhoServive.getCarrinho()
								.then(function (res) {
									if ((res && res.sucesso && res.carrinho) || (res && !res.sucesso && res.carrinho) || (res === false))
										setValues();
								});
						})
					}
				};

				$rootScope.$watch(function () { return carrinhoServive.getItens(); },
					function (val) { setValues(); }, true);

				$rootScope.$watch(function () {
									return carrinhoServive.checkProposta(); 
									},
								  function (val) { 
										vm.editCarrinho = carrinhoServive.checkProposta() ? false :  true;
									}, true);

				$rootScope.$watch( function () { 
										return carrinhoServive.checkRenovacao(); 
									} ,
									function (val) { 
										vm.renovacao = carrinhoServive.checkRenovacao();
									}, true);

			}]);
})();
