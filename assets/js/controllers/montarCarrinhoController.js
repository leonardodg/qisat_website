(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('montarCarrinhoController', ['$scope', '$controller', '$location','$window', '$route', '$filter', '$modal', '$timeout', 'carrinhoServive', 'authService',
					 function(scope, $controller, $location, $window, $route, $filter, $modal, $timeout, carrinhoServive, authService) {

					 	var vm = this;
					 	var modalController = $controller('modalController');
			 			 
						vm.modallogin = modalController.login;

						if($route && $route.current && $route.current.params && $route.current.params.produto){
								var nome = $route.current.params.produto;
								carrinhoServive.addItem({ produto: nome });
						}

					 	vm.nextCompra = function(){
					 		var auth = authService.Authenticated();

					 		function callback(){
					 			var user = authService.getUser();
					 			if(user && (!user.email || !user.numero))
									modalController.update('/carrinho/pagamento');
								else
				 					$location.path('/carrinho/pagamento');
					 		};

							if(auth === true){
								callback();
					 		}else if (auth === false){
					 			modalController.login('/carrinho/pagamento', false, callback );
					 		}else{
					 			auth.then(function(res){
				 					if(res === true){
						 				callback();
							 		}else{
							 			modalController.login('/carrinho/pagamento', false, callback );
							 		}
					 			});
					 		}

					 	};

					 	vm.cancelTransacao = function(){
					 		carrinhoServive.cancelarTransacao().then(function(res){
				 				$window.location.reload();
					 		});
					 	};

					 }]);
})();