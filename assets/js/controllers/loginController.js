(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('loginController', ['$rootScope', '$scope', '$location', 'authService',
					 function($rootScope, scope, $location, authService ) {

					 	scope.remember_me = true;
					 	scope.login = function(credentials) {

						 		credentials.remember = (scope.remember_me) ? true : false; 
								authService.login(credentials).then(function (res){
				 					if(res.data.success)
				 						$location.path('/aluno/perfil');
				 					else{
				 						scope.msgLogin = "Falha na Autenticação!";
				 						scope.typeMsgLogin = "alert-box alert radius";
				 					}
				 					
				 					return res;
					 			});
						};

						
					 }]);
})();