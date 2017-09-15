(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('rememberController', ['$scope', '$controller', '$location',  'QiSatAPI', 'vcRecaptchaService',
					 function(scope, $controller, $location, QiSatAPI, vcRecaptchaService ) {

					 	var  modalController = $controller('modalController');
					 	scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
					 	scope.loading = false;
					 	scope.submit = false;

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


					 	scope.sendMail = function(){
					 		scope.submit = true;
							var data = { email : scope.email, recaptcha : scope.gRecaptchaResponse };

							if(scope.rememberForm.$valid){
					 			scope.loading = true;
									QiSatAPI.remember(data)
											.then( function ( response ){
													scope.submit = false;
												    scope.loading = false;
													scope.reloadRecaptcha();
													if(response && response.data && response.data.retorno && response.data.retorno.sucesso){
														delete(scope.email);
														$location.path('/login');
														modalController.alert({ success : true, main : { title : "Lembrete de senha enviado com Sucesso!"} });
												    }else if((response.status == 200)&&(response && response.data && response.data.retorno && response.data.retorno.erro == "nao-localizado"))
						 								modalController.alert({  error : true,  main : { title : "Email não cadastrado!"} });
												    else if((response.status == 200)&&(response && response.data && response.data.retorno && response.data.retorno.erro == "sem-dados"))
												    	modalController.alert({  error : true, main : { title : "Preencha todos os dados Solicitados."} });
												    else if((response.status == 200)&&(response && response.data && response.data.retorno && response.data.retorno.erro == "envio-email"))
												    	modalController.alert({  error : true, main : { title : "Falha no Envio do Email."} });
												    else if((response.status == 200)&&(response && response.data && response.data.erro == "captcha-invalido"))
												    	modalController.alert({  error : true, main : { title : "Falha no Envio do Email.", subtitle : "Favor realizar a verificação." } });
												    else
														modalController.alert({  error : true, main : { title : "Falha na Solicitação."} });
												}, function ( response ){
													modalController.alert({  error : true, main : { title : "Falha na Solicitação."} });
													scope.loading = false;
													scope.submit = false;
													scope.reloadRecaptcha();
												});
							}else
								modalController.alert({  error : true, main : { title : "Verifique os dados Solicitados!"} });
						}

					 }]);
})();
