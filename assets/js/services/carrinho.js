(function() {
    'use strict';

	 angular
	 	.module('QiSatApp')
	 	.factory("carrinho", [ '$http', 'Config', 
	 			function($http, Config){

	 				var carrinho = false, itens;

		 			(function load(){
		 				if(!carrinho){
							carrinho = window.sessionStorage.getItem('carrinho');
		 					if(carrinho && !itens) getCarrinho();
		 				}
					})();

					function checkCarrinho(){
						return (carrinho) ? true : false;
					};

					function checkItens(){
						return (itens && itens.length) ? true : false;
					};

					function getItens(){
						return itens;
					};

					function saveCarrinho(){
						carrinho = true;
						window.sessionStorage.setItem('carrinho', carrinho);
					};

					function destroyCarrinho() {
						carrinho = false;
						window.sessionStorage.removeItem('carrinho');
					};

					function addItem(data) {

		                            var promise = $http({ 
		                                                    method: 'post', 
		                                                    url: 'http://local-ecommerce.qisat.com.br:83/carrinho/wsc-carrinho/add',
		                                                    data: data
		                                                        });

		                            return promise.then( function(res){ 
		                            						if(res.status == 200 && res.data && res.data.retorno && res.data.retorno.sucesso){
		                            							saveCarrinho();
		                            							itens = res.data.retorno.carrinho['ecm_carrinho_item'];
		                            							return itens;
		                            						}else
		                                                    	return res; 
		                                                }, function(res){ 
		                                                    return res; 
		                                                });
		                        };


					function getCarrinho() {

		                            var promise = $http({ 
		                                                    method: 'post', 
		                                                    url: 'http://local-ecommerce.qisat.com.br:83/carrinho/wsc-carrinho/listar'
		                                                        });

		                            return promise.then( function(res){ 
		                            	console.log(res);
		                            						if(res.status == 200 && res.data && res.data.retorno && res.data.retorno.sucesso)
		                            							itens = res.data.retorno.carrinho['ecm_carrinho_item'];
		                            						else
		                            							destroyCarrinho();
		                            						
		                                                    if(res && res.data && res.data.retorno && res.data.retorno.carrinho)
		                                                    	return res.data.retorno.carrinho; 
		                                                    else
		                                                    	res;
		                                                }, function(res){ 
		                                                    return res; 
		                                                });
		                        };

					function removeItem(data) {

		                            var promise = $http({ 
		                                                    method: 'post', 
		                                                    url: Config.baseUrl+'/user/',
		                                                    data: data
		                                                        });

		                            return promise.then( function(res){ 
		                                                    return res; 
		                                                }, function(res){ 
		                                                    return res; 
		                                                });
		                        };



					var sdo = {
		                        addItem : addItem,
		                        removeItem : removeItem,
		                        getItens : getItens,
		                        checkItens : checkItens,
		                        destroyCarrinho : destroyCarrinho,
		                        checkCarrinho : checkCarrinho,
		                        getCarrinho : getCarrinho
						};

				return sdo;

			}]);
}());