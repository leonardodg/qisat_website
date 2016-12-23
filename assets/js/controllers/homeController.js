(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('homeController', [ '$modal',
					 function( $modal ) {
					 	var vm = this;

					 	vm.modaltermo = function () {
				 					var modalInstance = $modal.open({ 
				 							templateUrl: '/views/modal-termo-de-uso.html',
				 							controller : function ($scope, $modalInstance) {
															  $scope.cancel = function () {
															    $modalInstance.dismiss('cancel');
															  };
															}
				 						});
					 			  };

					 	vm.modalpolitica = function () {
				 					var modalInstance = $modal.open({ 
				 							templateUrl: '/views/modal-politica.html',
				 							controller : function ($scope, $modalInstance) {
															  $scope.cancel = function () {
															    $modalInstance.dismiss('cancel');
															  };
															}
				 						});
					 			  };


					 }]);
})();