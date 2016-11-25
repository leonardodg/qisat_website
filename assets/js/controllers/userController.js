(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('userController', ['$scope', '$location', 'QiSatAPI', 'authService','Authenticated', 'postmon',
					 function(scope, $location, QiSatAPI, authService, Authenticated, postmon ) {

					 	if(authService.isLogged() && Authenticated)
					 		scope.user = authService.getUser();

					 }]);
})();