(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('rememberController', ['$scope', '$controller', '$location', 'QiSatAPI',
					 function(scope,$controller, $location, QiSatAPI ) {

					 	var  modalController = $controller('modalController');
					 	scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
					 	scope.sendMail = function(){
							var data = { email : scope.email }
							QiSatAPI.remember(data)
										.then( function ( response ){
												if(response && response.data && response.data.retorno && response.data.retorno.sucesso){
													modalController.alert({ success : true, main : { title : "Lembrete de senha enviado com Sucesso!"} });
													delete(scope.email);
											    }else{
											    	modalController.alert({  main : { title : "Falha no Envio da Mensagem."} });
											    }
											}, function ( response ){
												modalController.alert({  main : { title : "Falha no Envio da Mensagem."} });
											});
						}

					 }]);
})();
