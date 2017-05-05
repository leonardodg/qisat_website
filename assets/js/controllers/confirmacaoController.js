(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('confirmacaoController', [ '$location', '$analytics', 'authService', 'carrinhoServive', 'venda', 'Authenticated', 
					 function( $location, $analytics, authService,  carrinhoServive, venda, Authenticated) {
					 	var vm = this;
					 	$analytics.pageTrack($location.path());

					 	if(venda && (authService.isLogged() && Authenticated)){
					 		if(venda.forma_pagamento == 'Boleto'){
					 			vm.pagamento = 'boleto';
					 			vm.linkBoleto = venda.boleto;
					 		}else
					 			vm.pagamento = 'cartao';

					 		vm.venda = venda.id;
					 		carrinhoServive.destroyCarrinho();
					 	}else
					 		vm.pedido = false;
					 }]);
})();