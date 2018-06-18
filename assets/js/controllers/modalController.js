(function() {

	angular
		.module('QiSatApp')
		.controller('modalController', [ '$modal', '$q', '$controller' , 'authService', 
					 function( $modal, $q, $controller, authService ) {
					 	var vm = this;

					 	vm.termo = function () {
				 					var modalInstance = $modal.open({ 
				 							templateUrl: '/views/modal-termo-de-uso.html',
				 							controller : function ($scope, $modalInstance) {
															  $scope.cancel = function () {
															    $modalInstance.dismiss('cancel');
															  };
															}
				 						});
					 			  };

					 	vm.politica = function () {
				 					var modalInstance = $modal.open({ 
				 							templateUrl: '/views/modal-politica.html',
				 							controller : function ($scope, $modalInstance) {
															  $scope.cancel = function () {
															    $modalInstance.dismiss('cancel');
															  };
															}
				 						});
					 			  };

					 	vm.trilha = function (produto) {

									var auth = authService.Authenticated();

							 		function checkCPF(){
							 			var modalInstance;

							 			function callbackTrilha(){
					 						modalInstance = $modal.open({ 
					 							templateUrl: '/views/compra-trilha.html',
					 							windowClass: 'modalTrilha large',
												controller : 'trilhaController as trilhaCtr',
												resolve : {
															produto : function () { 
														 					return produto;
															 			}
												}
					 						});
				 						};


							 			var user = authService.getUser();
							 			if(user && (!user.email || !user.numero))
											vm.update(false, callbackTrilha );
										else
						 					callbackTrilha();
							 		};
					 				

									if(auth === true){
										checkCPF();
							 		}else if (auth === false){
							 			vm.login('/carrinho/', false, checkCPF );
							 		}else{
							 			auth.then(function(res){
						 					if(res === true){
								 				checkCPF();
									 		}else{
									 			vm.login('/carrinho/', false, checkCPF );
									 		}
							 			});
							 		}

				 			};


					 	vm.call = function () {
				 					var modalInstance = $modal.open({ 
                      						windowClass: 'call',
				 							templateUrl: '/views/modal-call.html',
				 							controller : function ($scope, $modalInstance, QiSatAPI, authService) {

															  var user = authService.getUser();
															  var regex = /\(([^)]+)\)/, operadora, aux, phone;
				 											  $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
															  $scope.submitted = false;

															  $scope.cancel = function () {
															    $modalInstance.dismiss('cancel');
															  };

															  if(user){
															  	$scope.dados = {
												  	 				nome : user.firstname+' '+user.lastname,
												  	 				email : user.email
															  	 };
															  	 
															  	 aux = user.phone1.match(regex);
															  	 phone = user.phone1.replace(/[^\d]+/g,'');
															  	 if(aux && aux.length && aux[1])
															  	 	$scope.dados.operadora = aux[1];
															  	 if(phone.length <= 9)
															  	 	$scope.dados.telefone = phone;
															  	 else
															  	 	$scope.dados.telefone = phone.substr(2);
															  }

															  $scope.solicitarContato = function(data,callForm){
															  		var dados = angular.copy(data);
															  			$scope.submitted = true;
															  		if(callForm && callForm.$valid){
															  			$scope.loading = true;
															  			dados.telefone = '('+data.operadora+") "+data.telefone;
															  			QiSatAPI.callMe(dados)
					                       									    .then(function (res){
															  						$scope.enviado = true;
															  						$scope.loading = false;
					                       									    }, function (res){
															  						$scope.enviado = true;
															  						$scope.loading = false;
					                       									    });

															  		}
															  };
															}
				 						});
					 			  };

					 	vm.questionnaire = function (question) {
				 					var modalInstance = $modal.open({
                      						windowClass: 'call',
				 							templateUrl: '/views/modal-question.html',
				 							controller : function ($window, $scope, $modalInstance, Config, authService) {
			 								 				  	var respostas;
			 								 				  	$scope.submitted = false;
			 								 				  	$scope.resp = [];
								   							    $scope.question = question.perguntas;

																$scope.cancel = function () {
																	$modalInstance.dismiss('cancel');
																};

								   							    $scope.send = function (resp, form) {
																	$scope.submitted = true;
																	respostas = {};

																	if(resp && resp.length){
																		resp.map(function(val, i){ respostas[i] = val.id });

																		authService.courseQuestion({ 
																								 wstoken : Config.tokenMoodlerespond,
																								 moodlewsrestformat : "json",
																								 wsfunction: "web_service_responder",
																								 courseid : question.curso,
																								 userid : question.user,
																								 questionnaire : question.id,
																								 respostas : JSON.stringify(respostas)
																					}).then( function (res){
																								$modalInstance.dismiss('cancel');
																								if(res && res.data && res.data.sucesso){
																									vm.alert({ success : true, main : {subtitle: "Agradecemos sua participação", title: 'Bons estudos!'}});
																								}
																								$window.location.href = question.url;
												                            		});

																	}
																};
															}
				 						});
					 			  };

					 	vm.showZopim = function(show, wait) {
                            var body = angular.element(document).find('body');
                                
                             show = (show === false) ? false : true;
                             wait = (wait === false) ? false : true;

                             if (wait) body.addClass('wait');

                            function load(){
                                var deferred = $q.defer();

                                window.$zopim||(function(d,s){var z=$zopim=function(c){z._.push(c)},$=z.s=
                                d.createElement(s),e=d.getElementsByTagName(s)[0];z.set=function(o){z.set.
                                _.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute("charset","utf-8");
                                $.src="https://v2.zopim.com/?2jhFplrC6wQCc6t1tRCcVV3LZTuli01D";z.t=+new Date;$.
                                type="text/javascript";e.parentNode.insertBefore($,e)})(document,"script");

                                $zopim(function(){
                                    if (typeof($zopim.livechat) == 'object'){
                                            $zopim.livechat.theme.setColor('#1B5485');
                                            $zopim.livechat.theme.reload(); // apply new theme settings
                                            $zopim.livechat.hideAll();
                                            deferred.resolve();
                                    }else{
                                        result.reject();
                                    }
                                });

                                return deferred.promise;
                            };


                            return load().then(function(){
                                  var user = authService.getUser();
                                  var chave;
                                  $zopim.livechat
                                        .setOnConnected(function (){
                                            $zopim.livechat.departments.setVisitorDepartment(111831);

                                            if(user){
                                            	chave = user.idnumber ? ' - '+user.idnumber : '';

                                                $zopim.livechat.set({
                                                      language: 'pt-br',
                                                      name: user.firstname+' '+user.lastname+chave,
                                                      email: user.email,
                                                      phone: user.phone1
                                                    });
                                            }

                                            if (wait) body.removeClass('wait');
                                            if (show) $zopim.livechat.window.show();
                                        });
                            });

                    }


					 	/*

							@paramts msgs = object 
											Attrs : 
												header = object 
													Attrs :
														title = string
														subtitle = string

												main = object 
													Attrs :
														title = string
														subtitle = string

												success = boolean


					 	*/
					 	vm.alert = function (msgs) {
				 					var modalInstance = $modal.open({ 
                      						windowClass: 'call',
				 							templateUrl: '/views/modal-alert.html',
				 							controller : function ($scope, $modalInstance) {
				 												$scope.msgs = msgs;

																$scope.cancel = function () {
																	$modalInstance.dismiss('cancel');
																};
															}
				 						});
					 			  };


					 	vm.interesse = function (course) {
				 					var modalInstance = $modal.open({ 
                      						windowClass: 'interesse',
				 							templateUrl: '/views/modal-interesse.html',
				 							controller : function ($scope, $modalInstance, QiSatAPI) {
				 											  $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
															  $scope.submitted = false;

															  $scope.cancel = function () {
															    $modalInstance.dismiss('cancel');
															  };

										  					if(course.isClassroom)
										  						$scope.tipo = 'presencial';
													  		else if(course.isIndividual)
													  			$scope.tipo = 'individual';
													  		else if(course.isClass)
													  			$scope.tipo = 'turma';
													  		
															  $scope.submit = function(data,form){
															  		var dados = {};
														  			$scope.submitted = true;
														  			var nome = course.nome || course.titulo || course.curso;

															  		if(form && form.$valid){

																  		dados.corpo_email = 'Prezados,<br /><br />';
																  		dados.corpo_email += '	<strong>Nome: </strong>'+data.nome+'<br />';
																  		dados.corpo_email += '	<strong>E-mail: </strong>'+data.email+'<br />';
																  		dados.corpo_email += '	<strong>Telefone: </strong>('+data.operadora+') '+data.telefone+'<br />';
																  		dados.corpo_email += '	Cliente resgistrou interesse no curso ';
																  		dados.corpo_email += ' <strong> '+nome+'</strong>';

																  		if(course.isClassroom){
															  				dados.assunto_email = '[QiSat] Registro de Interesse - Curso Presencial';
															  				dados.corpo_email += ', categoria: '+course.modalidade+'<br />';
																  		}else if(course.isIndividual){
															  				dados.assunto_email = '[QiSat] Registro de Interesse - Curso Presencial Individual';
															  				dados.corpo_email += ', categoria: '+course.modalidade+'<br />';
																  		}else if(course.isClass){
															  				dados.assunto_email = '[QiSat] Registro de Interesse - Turma Curso Presencial';
															  				dados.corpo_email += ' Turma de '+course.datauf;
																  		}else
															  				dados.assunto_email = '[QiSat] Registro de Interesse';

															  			$scope.loading = true;
															  			
															  			QiSatAPI.repasse(dados)
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


					 	vm.update = function (urlNext, callback) {
					 					var user = authService.getUser(), modalInstance;

					 					if(user && (!user.email || !user.numero)){

					 						modalInstance = $modal.open({ 
	                      						windowClass: 'interesse',
					 							templateUrl: '/views/modal-update.html',
					 							controller : function ($scope, $modalInstance, QiSatAPI, $location) {
					 											  
					 											  $scope.dados = {};
					 											  $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
																  $scope.submitted = false;
																  $scope.zopim = false;

																  $scope.cancel = function () {
																    $modalInstance.dismiss('cancel');
																  };

				 											  	  if(!user.email)
				 											  	  	$scope.getEmail = true;

				 											  	  if(!user.numero)
				 											  	  	$scope.getCpf = true;

														          $scope.showZopim = function(){
														          		vm.showZopim(false).then(function(){
														          			$zopim.livechat.say('Solicito ajuda para cadastra/atualizar CPF ou CNPJ: '+$scope.dados.cpfcnpj);
					                            							$zopim.livechat.window.show();
														          		});
														          };
				 											  	  

																  $scope.remember = function(email){
																		var data = { email : email };
																		$scope.msgRemember = '';
																		QiSatAPI.remember(data)
																					.then( function ( response ){
																							if(response && response.data && response.data.retorno && response.data.retorno.sucesso)
																								$scope.msgRemember = "Lembrete de senha enviado com Sucesso!";
																						    else
																						    	$scope.msgRemember = "Falha no Envio da Mensagem.";

																						}, function ( response ){
																							$scope.msgRemember = "Falha no Envio da Mensagem.";
																						});
																  };

																  $scope.submit = function(data,form){
																  		var newdata = {}, aux;
															  			$scope.submitted = true;
																  		if(form && form.$valid){

																	 		if(data.email && data.email !== user.email && $scope.getEmail)
																	 			newdata.email = data.email;

																	 		if( (!user.numero && data.cpfcnpj) || (data.cpfcnpj && user.numero && data.cpfcnpj !== user.numero.replace(/\D/g,"")) && $scope.getCpf ){
																	 				aux = data.cpfcnpj;
																	 				if(aux.length == 11){
																	 					if(!user.tipousuario || (user.tipousuario && user.tipousuario !== 'fisico')){ 
																				 			newdata.tipousuario = 'fisico';
																				 		}

																	 					aux = aux.replace( /(\d{3})(\d)/ , "$1.$2"); 
																					    aux = aux.replace( /(\d{3})(\d)/ , "$1.$2"); 
																					    aux = aux.replace( /(\d{3})(\d{1,2})$/ , "$1-$2");
																	 				}else{
																	 					if(!user.tipousuario || (user.tipousuario && user.tipousuario !== 'juridico')){ 
																				 			newdata.tipousuario = 'juridico';
																				 		}

																					    aux = aux.replace( /^(\d{2})(\d)/ , "$1.$2"); 
																					    aux = aux.replace( /^(\d{2})\.(\d{3})(\d)/ , "$1.$2.$3"); 
																					    aux = aux.replace( /\.(\d{3})(\d)/ , ".$1/$2");
																					    aux = aux.replace( /(\d{4})(\d)/ , "$1-$2");
																					}
																					newdata.numero = aux;
																	 		}
																	 		
																	 		authService.update(newdata)
																	 					.then(function(res){
																	 							$modalInstance.dismiss('cancel');
																	 							if(res && res.data && res.data.retorno && res.data.retorno.sucesso)
																	 								authService.verifyAuth();

																	 							if(!res || !res.data || !res.data.retorno || !res.data.retorno.sucesso)
																	 								vm.alert({ main : { title : "Falha ao atualizar dados!"}});
																	 							else if(urlNext)
																		 							$location.path(urlNext);
																		 						else if(typeof callback === "function")
																		 							callback();

																	 						}, function(res){ vm.alert({ main : { title : "Falha ao atualizar os dados!"} }) });		


																  		}
																  };


																$scope.logout = function() {
																	$modalInstance.dismiss('cancel');
																	authService.logout()
																			   .then( function (res){
																			   		vm.login('/carrinho/', '/carrinho/');
																			   });
																};

															}

					 						});
					 				}
					 			};

					 	vm.trailer = function (url, classModel) {
					 				var windowClass = classModel ? classModel : 'trailer';
				 					var modalInstance = $modal.open({ 
                      						windowClass: windowClass,
				 							templateUrl: '/views/modal-trailer.html',
				 							controller : function ($scope, $modalInstance, $sce) {
															  $scope.cancel = function () {
															    $modalInstance.dismiss('cancel');
															  };
															  $scope.video = $sce.trustAsResourceUrl(url);
															}
				 						});
					 			  };


					 	/*
						
							urlBack = retornar a página especifica após se cadastrar ou login OK
									  String or Object

							urlNext = proxima página apos realizar login OK
							callback = chamar function após login OK	

							inscricao = layout espeficico do modal inscricao	  

					 	*/
						vm.login = function (urlBack, urlNext, callback, inscricao) {
		 					var modalInstance = $modal.open({
		 							templateUrl: '/views/modal-login.html',
		 							controller : function ($scope, $modalInstance, QiSatAPI, authService, $location, vcRecaptchaService) {

		 											  $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;

													  $scope.cancel = function () {
													    $modalInstance.dismiss('cancel');
													  };

													  $scope.redirectSignup = function () {
														  	authService.setRedirect(urlBack);
														  	$modalInstance.dismiss('cancel');
														  	$location.path('/cadastro');
													  };

													  $scope.signin = function () {
													  	$scope.inscricao = false;
													  };

													  $scope.clickremember = function () {
													  	 $scope.remember = !$scope.remember;
													  };


													  $scope.clickvoltar = function () {
													  		$scope.alert = false;
								 							$scope.loading = false;
								 							$scope.remember = false;
								 							$scope.user = {};
													  };

													  if(inscricao)
													  	$scope.inscricao = inscricao;
													  

												 	// Codigo Recaptcha
									   				$scope.responseRecaptcha = null;
									                $scope.widgetId = null;
									                $scope.setResponse = function (responseRecaptcha) {
									                    $scope.responseRecaptcha = responseRecaptcha;
									                };
									                $scope.setWidgetId = function (widgetId) {
									                    $scope.widgetId = widgetId;
									                };
									                $scope.reloadRecaptcha = function() {
									                    vcRecaptchaService.reload($scope.widgetId);
									                    $scope.responseRecaptcha = null;
									                };

													  $scope.login = function(credentials) {
														 		credentials.remember =  true; 
														 		$scope.alert = false;

																authService.login(credentials).then(function (res){
																	var url;
												 					if((res.status == 200)&&(res && res.data && res.data.retorno && res.data.retorno.sucesso)){
												 						$modalInstance.dismiss('cancel');
												 						if(url = authService.getRedirect()){
												 							authService.setRedirect();

												 							if(typeof url == "object"){
												 								if("path" in url) 
												 									$location.path(url.path);
												 								if("search" in url) 
												 									$location.search(url.search);
												 							}else 
												 								$location.path(url);

												 						}else if(urlNext)
												 							$location.path(urlNext);
												 						else if(typeof callback === "function")
												 							callback();

												 						return res.data.retorno.sucesso;
												 					}else if((res.status == 200)&&(res && res.data && res.data.retorno && res.data.retorno.mensagem))
					 													$scope.alert = { main : { title : "Falha na Autenticação!", subtitle : res.data.retorno.mensagem }};
												 					else{
												 						$scope.alert = { main : { title : "Falha na Autenticação!" }};
												 						$scope.loading = false;
												 					}
												 					return false;
													 			}, function(res){ 
													 				$scope.alert = { main : { title : "Falha na Autenticação!" }};
											 						$scope.loading = false;
											 						return false;
													 			});
														};

														$scope.sendMail = function(email, recaptcha){
															var data = { email : email, recaptcha : recaptcha };
										 						$scope.alert = false;

															QiSatAPI.remember(data)
																		.then( function ( response ){
																				if(response && response.data && response.data.retorno && response.data.retorno.sucesso){ 
																					$scope.alert = { success : true, main : { title : "Lembrete de senha enviado com Sucesso!"} };
																					delete($scope.email);
																					$scope.remember = false;
																			    }else{
																				 	if(response && response.data && response.data.retorno && response && response.data && response.data.retorno.mensagem && response.data.retorno.mensagem == 'Usuário não encontrado'){
																				 		$scope.alert = {  main : { title : "Email não cadastrado!"} };
																				 	}else
																				 		$scope.alert = {  main : { title : "Falha no Envio da Mensagem."} };
																			    }
																			}, function ( response ){
																				$scope.alert = {  main : { title : "Falha no Envio da Mensagem."} };
																			});
														};

													},
									windowClass : 'loginModal'
		 						});
			 			};


					 }]);
})();