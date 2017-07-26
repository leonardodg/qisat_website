(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('rememberController', ['$scope', '$controller', '$location',  'QiSatAPI',
					 function(scope, $controller, $location, QiSatAPI ) {

					 	var  modalController = $controller('modalController');
					 	
					 	scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
					 	scope.sendMail = function(){
					 		scope.loading = true;
							var data = { email : scope.email }
							QiSatAPI.remember(data)
										.then( function ( response ){
												if(response && response.data && response.data.retorno && response.data.retorno.sucesso){
													delete(scope.email);
													$location.path('/login');
													modalController.alert({ success : true, main : { title : "Lembrete de senha enviado com Sucesso!"} });
											    }else if((response.status == 200)&&(response && response.data && response.data.retorno && response.data.retorno.mensagem))
					 								modalController.alert({  error : true, main : { title : "Falha no Envio da Mensagem.", subtitle : response.data.retorno.mensagem } });
											    else
											    	modalController.alert({  error : true, ain : { title : "Falha no Envio da Mensagem."} });
											    scope.loading = false;
											}, function ( response ){
												modalController.alert({  error : true, main : { title : "Falha no Envio da Mensagem."} });
												scope.loading = false;
											});
						}

					 }]);
})();
