(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('alunoController', 
					 function( $scope, $location, authService ) {

					 	$scope.logout = function() {
							authService.logout();
							// $location.path('/login');
							window.location = '/login';
						};

					 });
})();