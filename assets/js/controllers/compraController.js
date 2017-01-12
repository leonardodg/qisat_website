(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('compraController', ['$scope', '$location', '$filter','authService', '$modal',
					 function(scope, $location, $filter, authService, $modal ) {

					 	var vm = this;

					 	if(authService.isLogged() && Authenticated)
					 		vm.user = authService.getUser();

					 	
					 	vm.modallogin = function () {
				 					var modalInstance = $modal.open({
				 							templateUrl: '/views/modal-login.html',
				 							controller : function ($scope, $modalInstance) {
															  $scope.cancel = function () {
															    $modalInstance.dismiss('cancel');
															  };
															},
											windowClass : 'loginModal'
				 						});
					 			  };
				 		
					 }]);
})();