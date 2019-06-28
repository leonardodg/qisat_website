(function () {
	'use strict';

	angular
		.module('QiSatApp')
		.controller('confirmacaoController', ['Config', '$window', '$analytics', 'authService', 'carrinhoServive', 'venda', 'Authenticated',
			function (Config, $window, $analytics, authService, carrinhoServive, venda, Authenticated) {
				var vm = this;
				var user = authService.getUser();
				var data_rd;
				var siglas = [];

				if (venda && (authService.isLogged() && Authenticated)) {


					if (Config.environment == 'production') {

						$analytics.eventTrack('conversion', {
							transaction_id: venda.id
						});

						if (venda.products && venda.products.length)
							venda.products.map(function (prod) { siglas.push(prod.sigla); });

						data_rd = [
							{ name: 'email', value: user.email },
							{ name: 'nome', value: user.firstname + ' ' + user.lastname },
							{ name: 'phone', value: user.phone1 },
							{ name: 'cpf', value: user.numero },
							{ name: 'token_rdstation', value: Config.tokens.rdstation },
							{ name: 'cursos', value: siglas.join(' - ') },
							{ name: 'identificador', value: 'Compra Finalizada - QiSat' }
						];

						if (typeof user != 'undefined' && user.idnumber) data_rd.push({ name: 'chavealtoqi', value: user.idnumber });
						if (typeof RdIntegration != 'undefined') RdIntegration.post(data_rd);
						$window.fbq('track', 'Purchase');
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
