(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller("contactController", 
					[ '$scope','QiSatAPI', '$modal', function($scope, QiSatAPI, $modal){
						
						$scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;

						$scope.sendMail = function(){
							var alertBox, sendOk, error, dados = {};
								alertBox = angular.element(document.querySelectorAll('.alert-box'));
								sendOk = angular.element(document.querySelector('.alert-send-ok'));
								error = angular.element(document.querySelector('.alert-send-error'));
								alertBox.css('display', 'none');

								if($scope.contatoForm.$valid){
									dados.assunto_email = '[QiSat] Mensagem enviada através da página de contato';
									dados.corpo_email = '<b>Nome:</b> '+$scope.contato.name+' <br/>';
									dados.corpo_email += '<b>E-mail:</b> '+$scope.contato.email+' <br/>';
									dados.corpo_email += '<b>telefone:</b> '+$scope.contato.phone+' <br/>';
									dados.corpo_email += '<b>Origem:</b> QiSat <br/><br/>';
									dados.corpo_email += ' <b>Assunto:</b> '+$scope.contato.subject+' <br />';
									dados.corpo_email += ' <b>Mensagem:</b><br />';
									dados.corpo_email += ' <p>'+$scope.contato.msg+' </p>';

									QiSatAPI.repasse(dados)
												.then( function ( response ){
														if(response.statusText=="OK"){
															$scope.contato = {};
															$scope.contatoForm.$setPristine();
															sendOk.css('display', 'inline-block');
														}else
														 	error.css('display', 'inline-block');
													}, function ( response ){
														error.css('display', 'inline-block');
													});
								}
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