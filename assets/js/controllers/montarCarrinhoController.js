(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('montarCarrinhoController', ['$scope', '$location',  '$filter', '$modal','carrinhoServive', 'authService', 'Authenticated',
					 function(scope, $location, $filter, $modal, carrinhoServive, authService, Authenticated) {

					 	var vm = this;
			 			 
						vm.modallogin = function () {
		 					var modalInstance = $modal.open({
		 							templateUrl: '/views/modal-login.html',
		 							controller : function ($scope, $modalInstance) {
													  $scope.cancel = function () {
													    $modalInstance.dismiss('cancel');
													  };

													  $scope.login = function(credentials) {
														 		credentials.remember =  true; 
														 		$scope.msgLogin = "";
										 						$scope.typeMsgLogin = false;
										 						$scope.loading = true;

																authService.login(credentials).then(function (res){
												 					if((res.status == 200)&&(res && res.data && res.data.retorno && res.data.retorno.sucesso)){
												 						$scope.cancel();
												 						$location.path('/carrinho/pagamento');
												 					}else{
												 						$scope.msgLogin = "Falha na Autenticação!";
												 						$scope.typeMsgLogin = "alert-box alert radius";
												 						$scope.loading = false;
												 					}
												 					return res;
													 			});
														};

													},
									windowClass : 'loginModal'
		 						});
			 			};

					 	vm.nextCompra = function(){
					 		if(!Authenticated)
					 			vm.modallogin();
					 		else
					 			$location.path('/carrinho/pagamento');
					 	};
				 		
					 }]);
})();