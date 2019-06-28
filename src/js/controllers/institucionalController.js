(function () {
	'use strict';

	angular
		.module('QiSatApp')
		.controller('institucionalController', ['$modal', function ($modal) {
			var vm = this;

			vm.modalcall = function () {
				var modalInstance = $modal.open({
					templateUrl: '/views/modal-call.html',
					controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
						$scope.cancel = function () {
							$modalInstance.close();
						};
					}]
				});
			};
		}]);
})();