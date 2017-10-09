(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('montarCarrinhoController', ['$scope', '$controller', '$location','$window', '$route', '$filter', '$modal', 'carrinhoServive', 'authService',
					 function(scope, $controller, $location, $window, $route, $filter, $modal, carrinhoServive, authService) {

					 	var vm = this;
					 	var modalController = $controller('modalController');
			 			 
						vm.modallogin = modalController.login;

						if($route && $route.current && $route.current.params && $route.current.params.produto){
								var nome = $route.current.params.produto;
								carrinhoServive.addItem({ produto: nome });
						}

					 	vm.nextCompra = function(){
					 		var auth = authService.Authenticated();

					 		function redirect(){
					 			var user = authService.getUser();
					 			if(user && (!user.email || !user.numero))
									modalController.update('/carrinho/pagamento');
								else
				 					$location.path('/carrinho/pagamento');
					 		};

							if(auth === true){
								redirect();
					 		}else if (auth === false){
					 			modalController.login('/carrinho/pagamento', false, redirect );
					 		}else{
					 			auth.then(function(res){
				 					if(res === true){
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
					 				$location.path('/carrinho/pagamento');
					 		});
					 	};

					 }]);
})();