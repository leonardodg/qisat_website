(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller("contactController", 
					[ '$scope','QiSatAPI', function($scope, QiSatAPI){
						
						$scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;

						$scope.sendMail = function(){
							var data = { type: 'send-msg', data: $scope.contato }, alertBox, sendOk, error ;
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