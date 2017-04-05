(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('montarCarrinhoController', ['$scope', '$controller', '$location', '$window', '$route', '$filter', '$modal', 'carrinhoServive', 'authService', 'Authenticated',
					 function(scope, $controller, $location, $window, $route, $filter, $modal, carrinhoServive, authService, Authenticated) {

					 	var vm = this;
					 	var modalController = $controller('modalController');
			 			 
						vm.modallogin = modalController.login;

					 	vm.nextCompra = function(){
					 		if(!Authenticated)
					 			vm.modallogin('/carrinho/pagamento', '/cadastro');
					 		else
					 			$location.path('/carrinho/pagamento');
					 	};

					 	vm.cancelTransacao = function(){
					 		carrinhoServive.cancelarTransacao().then(function(res){
					 			if(res.sucesso)
					 				window.location = '/carrinho/pagamento';
					 		});
					 	};

					 }]);
})();