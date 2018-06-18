(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('confirmacaoController', ['Config', 'authService', 'carrinhoServive', 'venda', 'Authenticated', 
					 function(Config, authService, carrinhoServive, venda, Authenticated) {
					 	var vm = this;
		 				var user = authService.getUser();
						var data_rd;
						var siglas = [];

					 	if(venda && (authService.isLogged() && Authenticated)){

					 		if(venda.products && venda.products.length)
					 			venda.products.map(function(prod){ siglas.push(prod.sigla); });

					 		data_rd = [
									      { name: 'email', value: user.email },
									      { name: 'nome', value: user.firstname+' '+user.lastname },
									      { name: 'phone', value: user.phone1 },
									      { name: 'cpf', value: user.numero },
									      { name: 'token_rdstation', value: Config.tokenRD },
									      { name: 'cursos', value: siglas.join(' - ') },
									      { name: 'identificador', value: 'Compra Finalizada - QiSat' }
									    ];

							if(user.idnumber) data_rd.push({ name: 'chavealtoqi', value: user.idnumber });
							if(typeof RdIntegration != 'undefined') RdIntegration.post(data_rd);

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