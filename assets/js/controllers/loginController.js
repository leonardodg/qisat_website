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
				 					if((res.status == 200)&&(res && res.data && res.data.retorno && res.data.retorno.sucesso)){
				 						window.location = '/aluno/cursos';
				 					}else{
				 						$rootScope.msgLogin = "Falha na Autenticação!";
				 						$rootScope.typeMsgLogin = "alert-box alert radius";
				 					}
				 					return res;
					 			});
						};
					 }]);
})();
