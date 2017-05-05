(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('montarCarrinhoController', ['$scope', '$controller', '$location', '$analytics' ,'$window', '$route', '$filter', '$modal', 'carrinhoServive', 'authService',
					 function(scope, $controller, $location,$analytics, $window, $route, $filter, $modal, carrinhoServive, authService) {

					 	var vm = this;
					 	var modalController = $controller('modalController');
			 			 
						vm.modallogin = modalController.login;
						$analytics.pageTrack($location.path());

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

					 		function redirect(){
					 			var user = authService.getUser();
					 			if(user && (!user.email || !user.numero))
									modalController.update('/carrinho/pagamento');
								else
				 					$location.path('/carrinho/pagamento');
					 		}

							if(auth === true){
								redirect();
					 		}else if (auth === false){
					 			modalController.login('/carrinho/pagamento', false, redirect );
					 		}else{
					 			auth.then(function(res){
				 					if(auth === true){
						 				redirect();
							 		}else{
							 			modalController.login('/carrinho/pagamento', false, redirect );
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