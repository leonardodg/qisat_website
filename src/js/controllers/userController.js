(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('userController', ['$scope', 'QiSatAPI', 'authService','Authenticated', 
					 function(scope, QiSatAPI, authService, Authenticated ) {
					 	if(authService.isLogged() && Authenticated)
					 		scope.user = authService.getUser();
					 }]);
})();