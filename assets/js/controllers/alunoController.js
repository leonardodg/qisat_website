(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('alunoController', 
					 function( $scope, $location, Config, authService ) {
					 	var user;
					 	$scope.logout = function() {
							authService.logout()
									   .then( function (res){
												window.location = '/login';
									   });
						};

						if(user = authService.getUser()){
							if(user.funcionarioqisat)
								$scope.showliks = Config.url;
						}
					 });
})();