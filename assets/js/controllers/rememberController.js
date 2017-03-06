(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('rememberController', ['$scope', '$location', 'QiSatAPI',
					 function(scope, $location, QiSatAPI ) {

					 	scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
					 	scope.sendMail = function(){
							var data = { email : scope.email }, alertBox, sendOk, error ;
								alertBox = angular.element(document.querySelectorAll('.alert-box'));
								sendOk = angular.element(document.querySelector('.alert-send-ok'));
								error = angular.element(document.querySelector('.alert-send-error'));
								alertBox.css('display', 'none');

							QiSatAPI.remember(data)
										.then( function ( response ){
												if(response && response.data && response.data.retorno && response.data.retorno.sucesso){ 
													sendOk.css('display', 'inline-block');
													delete(scope.email);
											    }else{
												 	error.css('display', 'inline-block');
												 	if(response && response.data && response.data.retorno && response && response.data && response.data.retorno.mensagem)
												 		error.append('<br/> <span>'+response.data.retorno.mensagem+' </span>');
											    }
											}, function ( response ){
												error.css('display', 'inline-block');
											});
						}

					 }]);
})();
