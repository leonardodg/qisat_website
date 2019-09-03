(function () {
	'use strict';

	angular
		.module('QiSatApp')
		.controller('montarCarrinhoController', ['$scope', '$controller', '$location', '$window', '$route', '$filter', '$modal', '$timeout', 'Config', 'carrinhoServive', 'authService',
			function (scope, $controller, $location, $window, $route, $filter, $modal, $timeout, Config, carrinhoServive, authService) {

				var vm = this;
				var modalController = $controller('modalController');
				var itens = carrinhoServive.getItens(), products = [];

				vm.modallogin = modalController.login;

				if ($route && $route.current && $route.current.params && $route.current.params.produto) {
					var nome = $route.current.params.produto;

					if ('turma' in $route.current.params)
						carrinhoServive.addItem({ produto: nome, quantidade: 1, presencial: $route.current.params.turma });
					else
						carrinhoServive.addItem({ produto: nome });
				}

				if (typeof dataLayer !== "undefined" && itens && itens.length > 0 && Config.environment == 'production') {

					itens.map(function (item) {
						products.push({
							"name": item.ecm_produto.sigla,
							"price": item.valor_produto_desconto,
							"quantity": item.quantidade,
							'category': item.modalidade,
						});
					});

					dataLayer.push({
						'event': 'ecommerce.checkout',
						'channel': carrinhoServive.isProposta ? 'comercial' : 'self-service',                      // self-service ou comercial
						'ecommerce': {
							'checkout': {
								'products': products
							}
						}
					});
				}

				vm.nextCompra = function () {
					var auth = authService.Authenticated();

					function callback() {
						var user = authService.getUser();
						if (user && (!user.email || !user.numero))
							modalController.update('/carrinho/pagamento');
						else
							$location.path('/carrinho/pagamento');
					}

					if (auth === true) {
						callback();
					} else if (auth === false) {
						modalController.login('/carrinho/pagamento', false, callback);
					} else {
						auth.then(function (res) {
							if (res === true) {
								callback();
							} else {
								modalController.login('/carrinho/pagamento', false, callback);
							}
						});
					}

				};

				vm.cancelTransacao = function () {
					carrinhoServive.cancelarTransacao().then(function (res) {
						if (res && res.sucesso)
							$window.location.reload();
						else
							console.log('Falha Cancelamento!');
					});
				};

			}]);
})();