(function() {
	'use strict';

	angular
		.module('QiSatApp')
		.controller('confirmarCadastroController', [ '$scope', '$controller', '$location', '$analytics', 'authService','$route', 'vcRecaptchaService',
			function(scope, $controller, $location, $analytics, authService, $route, vcRecaptchaService) {

				var modalController = $controller('modalController');
				var token = $route.current.params.token;
				var email = window.localStorage.getItem('email');
				var credentials;

				$analytics.pageTrack($location.path());
				scope.loading = false;
				scope.submit = false;
				scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;


			 	// Codigo Recaptcha
   				scope.responseRecaptcha = null;
                scope.widgetId = null;
                scope.setResponse = function (responseRecaptcha) {
                    scope.responseRecaptcha = responseRecaptcha;
                };
                scope.setWidgetId = function (widgetId) {
                    scope.widgetId = widgetId;
                };
                scope.reloadRecaptcha = function() {
                    vcRecaptchaService.reload(scope.widgetId);
                    scope.responseRecaptcha = null;
                };


				scope.solicitarEmail = function(credentials) {
					scope.submit = true;

					if(scope.confirmarCadastroForm.$valid){
						scope.loading = true;
						credentials.recaptcha = scope.gRecaptchaResponse;
						authService.solicitarEmail(credentials).then(function (res){
							scope.loading = false;
							if((res.status == 200)&&(res && res.data && res.data.retorno)){
								scope.status = res.data.retorno.status;
								if(scope.status == 'cadastre-se') {
									modalController.alert({ error: true, main : { title : "O email informado não se encontra em nossa base de dados.", subtitle : "Favor, realize seu cadastro." } });
								} else if (scope.status == 'confirmado'){
									modalController.alert({ success: true, main : { title : "O cadastro já encontra-se confirmado em nossa base de dados." } });
									$location.path('/login');
								}else if ( scope.status == 'enviado') {
									modalController.alert({ success: true, main : { title : "A confirmação de cadastro foi enviada com sucesso.", subtitle : "Favor, verifique seu email." } });
									$location.path('/login');
								}
							} else if((res.status == 200)&&(res && res.data && res.data.erro == "captcha-invalido"))
						    	modalController.alert({  error : true, main : { title : "Falha no Envio do Email.", subtitle : "Favor realizar a verificação." } });
						}, function(){ scope.loading = false; modalController.alert({  error : true, main : { title : "Falha na Requisição!"} }); });
					}else
						modalController.alert({  error : true, main : { title : "Verifique os dados Solicitados!"} });
				};

				scope.confirmarCadastro = function(credentials) {
					scope.loading = true;
					authService.confirmarCadastro(credentials).then(function (res){
						scope.loading = false;
						if((res.status == 200)&&(res && res.data && res.data.retorno)){
							scope.status = res.data.retorno.status;
							
							if(scope.status == 'valido' ){
								modalController.alert({ success: true, main : { title : "Cadastro validado com sucesso. Favor, realize seu acesso." } });
								$location.path('/login');
							}else if ( scope.status == 'confirmado') {
								modalController.alert({ success: true, main : { title : "O cadastro já encontra-se confirmado em nossa base de dados." } });
								$location.path('/login');
							}else if ( scope.status == 'enviado') {
								modalController.alert({ success: true, main : { title : "A confirmação de cadastro foi enviada com sucesso. Favor, verifique seu email." } });
								$location.path('/login');
							}else if ( scope.status == 'expirado') {
								modalController.alert({ error: true, main : { title : "O email de confirmação expirou.", subtitle: "Favor, solicite novamento o email de confirmação!" } });
							}else if ( scope.status == 'invalido') {
								modalController.alert({ error: true, main : { title : "Verificação de confirmação de cadastro inválida." } });
							}else if ( scope.status == 'erro') {
								modalController.alert({ error: true, main : { title : "O email informado não se encontra em nossa base de dados. Favor, realize seu cadastro." } });
							}else if(scope.status == 'cadastre-se') {
								modalController.alert({ error: true, main : { title : "O email informado não se encontra em nossa base de dados. Favor, realize seu cadastro." } });
							}
						}
					}, function(){ scope.loading = false; modalController.alert({ error: true }); });
				};

				if(token && typeof token !== "undefined" && token !== "undefined" ){
					credentials = { token : token };
					scope.confirmarCadastro(credentials);
				}

			}]);
})();
