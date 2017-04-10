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
		                        		$scope.submitted = false;
			                            $scope.isDisabled = true;
			                            delete($scope.emailNew);
			                            $scope.newForm.$setPristine();

			                            if(res && res.data && res.data.retorno && res.data.retorno.sucesso)
			                            	modalController.alert({ success : true, main : { title : "Obrigado, seu intersse foi cadastrado!", subtitle : " Em breve enviaremos novidades pelo E-mail." } });
			                          	else
			                          		modalController.alert();
			                            
			                        });
			                      }
			            };

						$scope.sendMail = function(){
							var dados = {};
							
							if($scope.contatoForm.$valid){
								$scope.send = true;
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
													$scope.contato = {};
													$scope.send = false;
													$scope.contatoForm.$setPristine();

													if(response.statusText=="OK")
														modalController.alert({ success : true, main : { title : "Obrigado, por entra em contato!", subtitle : " Em breve enviamos sua resposta." } });
													else
														modalController.alert({ main : { title : "Falha no envio do E-mail!" }});
													
												}, function ( response ){
													modalController.alert();
												});
							}
						};
				}]);
})();