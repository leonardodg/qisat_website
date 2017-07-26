(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('loginController', [ '$scope', '$controller', '$location', 'authService',
					 function(scope, $controller, $location, authService ) {

					 		var modalController = $controller('modalController');

						 	scope.remember_me = true;
						 	scope.login = function(credentials) {
						 		scope.loading = true;

					 			if(scope.loginForm && scope.loginForm.$valid){
					 				credentials.username = credentials.username.replace(/^\s+|\s+$/g,"");
					 				credentials.password = credentials.password.replace(/^\s+|\s+$/g,"");
							 		credentials.remember = (scope.remember_me) ? true : false; 
									authService.login(credentials).then(function (res){
										var url;
					 					if((res.status == 200)&&(res && res.data && res.data.retorno && res.data.retorno.sucesso)){
					 						if(url = authService.getRedirect()){
					 							authService.setRedirect();
					 							$location.path(url);
					 						}else
					 							$location.path('/aluno/cursos');

					 					}else if((res.status == 200)&&(res && res.data && res.data.retorno && res.data.retorno.mensagem)){
					 						modalController.alert({  error : true, main : { title : "Falha na Autenticação!", subtitle : res.data.retorno.mensagem } });
					 						scope.loading = false;
					 					}
					 					else{
					 						modalController.alert({ error : true, main : { title : "Falha na Autenticação!" } });
					 						scope.loading = false;
					 					}
					 					
					 					return res;
						 			}, function(){ scope.loading = false; modalController.alert({error : true}); });
								}
			 					
							};
					 }]);
})();
