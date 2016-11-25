(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('rememberController', ['$scope', '$location', 'QiSatAPI', 'authService',
					 function(scope, $location, QiSatAPI, authService ) {

					 	scope.sendMail = function(){
							var data = { type: 'remember-me', data: { email : scope.email } }, alertBox, sendOk, error ;
								alertBox = angular.element(document.querySelectorAll('.alert-box'));
								sendOk = angular.element(document.querySelector('.alert-send-ok'));
								error = angular.element(document.querySelector('.alert-send-error'));
								alertBox.css('display', 'none');

							QiSatAPI.sendMail(data)
										.then( function ( response ){
											console.log(response);
												if(response.statusText=="OK")
													sendOk.css('display', 'inline-block');
											    else
												 	error.css('display', 'inline-block');
											}, function ( response ){
												error.css('display', 'inline-block');
											});
						}

					 }]);
})();