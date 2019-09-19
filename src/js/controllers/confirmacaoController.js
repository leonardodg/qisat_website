(function () {
	'use strict';

	angular
		.module('QiSatApp')
		.controller('confirmacaoController', ['Config', '$window', '$analytics', 'authService', 'carrinhoServive', 'venda', 'Authenticated',
			function (Config, $window, $analytics, authService, carrinhoServive, venda, Authenticated) {
				var vm = this;
				var user = authService.getUser();
				var data_rd;
				var siglas = [], products = [], coupons = [], promotions = [];

				if (venda && (authService.isLogged() && Authenticated)) {

					if (Config.environment == 'production') {

						$analytics.eventTrack('conversion', {
							transaction_id: venda.id
						});

						if (venda.products && venda.products.length) {
							venda.products.map(function (prod) {
								siglas.push(prod.sigla);
								products.push({
									"name": prod.sigla,
									"price": prod.valor_produto_desconto,
									"quantity": prod.quantidade
								});

								if (typeof prod.ecm_promocao_id !== 'undefined') {
									promotions.push(prod.ecm_promocao_id);
								}

								if (typeof prod.ecm_cupom_id !== 'undefined') {
									coupons.push(prod.ecm_cupom_id);
								}
							});

							promotions = promotions.filter(function (el, index, arr) {
								return index == arr.indexOf(el);
							});

							coupons = coupons.filter(function (el, index, arr) {
								return index == arr.indexOf(el);
							});

							coupons = coupons.join();
							promotions = promotions.join();

						}

						data_rd = [
							{ name: 'email', value: user.email },
							{ name: 'nome', value: user.firstname + ' ' + user.lastname },
							{ name: 'phone', value: user.phone1 },
							{ name: 'cpf', value: user.numero },
							{ name: 'token_rdstation', value: Config.tokens.rdstation },
							{ name: 'cursos', value: siglas.join(' - ') },
							{ name: 'identificador', value: 'Compra Finalizada - QiSat' }
						];

						if (typeof user !== 'undefined' && user.idnumber) data_rd.push({ name: 'chavealtoqi', value: user.idnumber });
						if (typeof RdIntegration !== 'undefined') RdIntegration.post(data_rd);

						var price = (typeof venda.total == 'string') ? venda.total.replace(/^(R\$)(\d+)?.?(\d+),([0-9]{2})$/g, '$2$3.$4') : venda.total;

						if (typeof dataLayer !== "undefined") {

							dataLayer.push({
								'event': 'ecommerce.purchase',
								'promotions': promotions,
								'ecommerce': {
									'purchase': {
										'actionField': {
											'id': venda.id,
											'revenue': price,
											'coupon': coupons
										},
										'products': products
									}
								}
							});
						}

						if ($window.fbq != undefined) {
							$window.fbq('track', 'Purchase');
						}
					}

					if (venda.forma_pagamento && venda.forma_pagamento.toLocaleLowerCase().indexOf('boleto') >= 0) {
						vm.pagamento = 'boleto';
						vm.linkBoleto = venda.boleto;
					} else
						vm.pagamento = 'cartao';

					vm.venda = venda.id;
					carrinhoServive.destroyCarrinho();
				} else
					vm.pedido = false;
			}]);
})();
