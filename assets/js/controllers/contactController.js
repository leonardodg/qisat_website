(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller("contactController", 
					[ '$scope','QiSatAPI', function($scope, QiSatAPI){
						
						$scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;

						$scope.sendMail = function(){
							var data = { type: 'send-msg', data: $scope.contato }, elemts;

							elemts = angular.element('.alert-box');
							elemts.css('display', 'none');

							QiSatAPI.sendMail(data)
										.then( function ( response ){

												elemts = angular.element('.alert-send-ok');
												elemts.css('display', 'inline-block');

											}, function ( response ){

												elemts = angular.element('.alert-send-error');
												elemts.css('display', 'inline-block');

											});
						}
				}]);
})();