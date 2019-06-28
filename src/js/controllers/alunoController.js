(function () {
	'use strict';

	angular
		.module('QiSatApp')
		.controller('alunoController', ['$scope', '$location', 'Config', 'authService',
			function ($scope, $location, Config, authService) {
				var user = authService.getUser();
				$scope.logout = function () {
					authService.logout()
						.then(function (res) {
							$location.path('/login');
						});
				};

				if ((user && typeof user !== "undefined" && user !== "undefined") && (user.funcionarioqisat)) {
					$scope.showliks = Config.url;
				}
			}]);
})();