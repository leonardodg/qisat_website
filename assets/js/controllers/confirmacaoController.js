(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('confirmacaoController', [ 'authService', 'carrinhoServive', 'venda', 'Authenticated', 
					 function( authService,  carrinhoServive, venda, Authenticated) {
					 	var vm = this;
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