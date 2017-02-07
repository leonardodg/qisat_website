(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller("contactController", 
					[ '$scope','QiSatAPI', '$modal', function($scope, QiSatAPI, $modal){
						
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

						$scope.modalcall = function () {
				 					var modalInstance = $modal.open({ 
                      						windowClass: 'call',
				 							templateUrl: '/views/modal-call.html',
				 							controller : function ($scope, $modalInstance, QiSatAPI) {

				 											  $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
															  $scope.submitted = false;

															  $scope.cancel = function () {
															    $modalInstance.dismiss('cancel');
															  };

															  $scope.solicitarContato = function(data,callForm){
															  		var dados = angular.copy(data);
															  			$scope.submitted = true;
															  		if(callForm && callForm.$valid){
															  			$scope.loading = true;
															  			dados.telefone = '('+data.operadora+") "+data.telefone;
															  			QiSatAPI.callMe(data)
					                       									    .then(function (res){
															  						$scope.enviado = true;
															  						$scope.loading = false;
					                       									    }, function (res){
															  						$scope.enviado = true;
															  						$scope.loading = false;
					                       									    });

															  		}
															  }
															}
				 						});
					 			  };
				}]);
})();