(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller("contactController", 
					[ '$scope','QiSatAPI', '$modal', '$controller', 'authService', function($scope, QiSatAPI, $modal, $controller, authService){
						
						var modalController = $controller('modalController');
							$scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
							$scope.modalcall = modalController.call;
			                $scope.submitted = false;
			                $scope.isDisabled = true;
			                $scope.zopim = false;

			            $scope.showZopim = function(){
			            	 var user = authService.getUser();
			            	 $zopim.livechat.setOnConnected (function (){
                            						
                            						$zopim.livechat.departments.setVisitorDepartment(111831);

                            						if(user){
	                            						$zopim.livechat.set({
														      language: 'pt-br',
														      name: user.firstname+' '+user.lastname,
														      email: user.email,
														      phone: user.phone1
														    });
                            						}

                            						$zopim.livechat.window.show();
					                			});
			            };

			            $scope.addNew = function(){
			                      $scope.submitted = true;
			                      if($scope.emailNew){
			                        $scope.isDisabled = false;
			                        QiSatAPI.newsletter($scope.emailNew).then(function (res){
			                            if(res && res.data && res.data.retorno && res.data.retorno.sucesso){
			                              $scope.submitted = false;
			                              $scope.isDisabled = true;
			                              delete($scope.emailNew);
			                              $scope.newForm.$setPristine();
			                            }
			                        });
			                      }
			            };

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
						};
				}]);
})();