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
		 							controller : function ($scope, $modalInstance, QiSatAPI) {

		 											  $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;

													  $scope.cancel = function () {
													    $modalInstance.dismiss('cancel');
													  };

													  $scope.clickremember = function () {
													  	 $scope.remember = !$scope.remember;
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

														$scope.sendMail = function(email){
															var data = { email : email };
																$scope.msgLogin = "";
										 						$scope.typeMsgLogin = false;


															QiSatAPI.remember(data)
																		.then( function ( response ){
																				if(response && response.data && response.data.retorno && response.data.retorno.sucesso){ 
																					$scope.msgLogin = "Mensagem Enviada!";
														 							$scope.typeMsgLogin = "alert-box info radius";
																					delete($scope.email);
																					$scope.remember = false;
																			    }else{
																				 	if(response && response.data && response.data.retorno && response && response.data && response.data.retorno.mensagem){
																				 		$scope.msgLogin = "Falha na Solicitação!";
														 								$scope.typeMsgLogin = "alert-box alert radius";
																				 	}
																			    }
																			}, function ( response ){
																				$scope.msgLogin = "Falha na Solicitação!";
														 						$scope.typeMsgLogin = "alert-box alert radius";
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