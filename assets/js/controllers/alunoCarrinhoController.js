(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('alunoCarrinhoController', ['$scope', '$filter','authService','Authenticated', '$routeParams', 
					 function(scope, $filter, authService, Authenticated, $routeParams ) {

					 	if(Authenticated){
					 		scope.user = authService.getUser();

						 	if($routeParams.id){ 
						 		authService.carrinho($routeParams.id)
						 				   .then(function (res){ 
						 				   			var dadosCarrinho;
						 				   			if(res.data && res.data.retorno && res.data.retorno.sucesso){

						 				   				dadosCarrinho = res.data.retorno.venda;
							 				   			dadosCarrinho.dataFormat = $filter('date')( dadosCarrinho.data*1000, 'dd/MM/yyyy - HH:mm:ss' );
							 							dadosCarrinho.total = $filter('currency')(dadosCarrinho.total, 'R$ ');
							 							dadosCarrinho.valor_parcelas = $filter('currency')(dadosCarrinho.valor_parcelas, 'R$ ');

							 							if(dadosCarrinho.forma_pagamento == 'Boleto')
							 								dadosCarrinho.dadosPagamento = "À vista no Boleto";
							 							else 
							 								dadosCarrinho.dadosPagamento = dadosCarrinho.numero_parcelas+"x de "+dadosCarrinho.valor_parcelas+" no "+dadosCarrinho.operadora;

							 							if(dadosCarrinho.products.length){
							 								dadosCarrinho.products.map(function(prod){
							 								    prod.preco = $filter('currency')(prod.preco, 'R$ ');
							 								    prod.total = $filter('currency')(prod.total, 'R$ ');
							 								});
							 							}

							 							if(dadosCarrinho.promotions && dadosCarrinho.promotions.length ){
										 					dadosCarrinho.promotions.map(function(promo){
											 					promo.datafimFormat = $filter('date')( promo.datafim*1000, 'dd/MM/yyyy' );
											 					promo.datainicioFormat = $filter('date')( promo.datainicio*1000, 'dd/MM/yyyy' );
											 					if(promo.descontovalor)
											 						promo.desconto = $filter('currency')(promo.descontovalor, 'R$ ');
											 					else
											 						promo.desconto = promo.descontoporcentagem+'%';
											 				});
											 			}

							 							scope.dadosCarrinho = dadosCarrinho;
							 						}
						 				   		});
						 	}
					 	}
				 		
					 }]);
})();
