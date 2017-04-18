(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('montarCarrinhoController', ['$scope', '$controller', '$location', '$window', '$route', '$filter', '$modal', 'carrinhoServive', 'authService',
					 function(scope, $controller, $location, $window, $route, $filter, $modal, carrinhoServive, authService) {

					 	var vm = this;
					 	var modalController = $controller('modalController');
			 			 
						vm.modallogin = modalController.login;

						var authenticated = function(){
		                      return authService.isAuth() || 
		                              authService.verifyAuth()
		                                         .then( function (res){ 
		                                                  return (res) ? true : false;
		                                                }, function (res){ 
		                                                     return false;
		                                                });

	                  	};	
	                  	authenticated();	

					 	vm.nextCompra = function(){
					 		var auth = authenticated();

							if(auth === true){
				 				$location.path('/carrinho/pagamento', '/carrinho/pagamento');
					 		}else if (auth === false){
					 			modalController.login('/carrinho/pagamento', '/carrinho/pagamento');
					 		}else{
					 			auth.then(function(res){
				 					if(auth === true){
						 				$location.path('/carrinho/pagamento', '/carrinho/pagamento');
							 		}else{
							 			modalController.login('/carrinho/pagamento', '/carrinho/pagamento');
							 		}
					 			});
					 		}

					 	};

					 	vm.cancelTransacao = function(){
					 		carrinhoServive.cancelarTransacao().then(function(res){
					 			if(res.sucesso)
					 				window.location = '/carrinho/pagamento';
					 		});
					 	};

					 }]);
})();