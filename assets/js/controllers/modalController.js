(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('modalController', [ '$modal',
					 function( $modal ) {
					 	var vm = this;

					 	vm.termo = function () {
				 					var modalInstance = $modal.open({ 
				 							templateUrl: '/views/modal-termo-de-uso.html',
				 							controller : function ($scope, $modalInstance) {
															  $scope.cancel = function () {
															    $modalInstance.dismiss('cancel');
															  };
															}
				 						});
					 			  };

					 	vm.politica = function () {
				 					var modalInstance = $modal.open({ 
				 							templateUrl: '/views/modal-politica.html',
				 							controller : function ($scope, $modalInstance) {
															  $scope.cancel = function () {
															    $modalInstance.dismiss('cancel');
															  };
															}
				 						});
					 			  };

					 	vm.call = function () {
				 					var modalInstance = $modal.open({ 
                      						windowClass: 'call',
				 							templateUrl: '/views/modal-call.html',
				 							controller : function ($scope, $modalInstance, QiSatAPI) {

				 											  $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
															  $scope.submitted = false;

															  $scope.cancel = function () {
															    $modalInstance.dismiss('cancel');
															  };

															  $scope.solicitarContato = function(data,callForm){
															  		var dados = angular.copy(data);
															  			$scope.submitted = true;
															  		if(callForm && callForm.$valid){
															  			$scope.loading = true;
															  			dados.telefone = '('+data.operadora+") "+data.telefone;
															  			QiSatAPI.callMe(data)
					                       									    .then(function (res){
															  						$scope.enviado = true;
															  						$scope.loading = false;
					                       									    }, function (res){
															  						$scope.enviado = true;
															  						$scope.loading = false;
					                       									    });

															  		}
															  }
															}
				 						});
					 			  };


					 	vm.interesse = function () {
				 					var modalInstance = $modal.open({ 
                      						windowClass: 'interesse',
				 							templateUrl: '/views/modal-interesse.html',
				 							controller : function ($scope, $modalInstance, QiSatAPI) {

				 											  $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
															  $scope.submitted = false;

															  $scope.cancel = function () {
															    $modalInstance.dismiss('cancel');
															  };

															}
				 						});
					 			  };

					 	vm.trailer = function (url) {
				 					var modalInstance = $modal.open({ 
                      						windowClass: 'trailer',
				 							templateUrl: '/views/modal-trailer.html',
				 							controller : function ($scope, $modalInstance) {
															  $scope.cancel = function () {
															    $modalInstance.dismiss('cancel');
															  };
															  $scope.video = $sce.trustAsResourceUrl(url);
															}
				 						});
					 			  };

					 }]);
})();