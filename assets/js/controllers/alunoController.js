(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('alunoController', 
					 function( $scope, $location, authService ) {
					 	$scope.logout = function() {
							authService.logout()
									   .then( function (res){
												window.location = '/login';
									   });
						};
					 });
})();