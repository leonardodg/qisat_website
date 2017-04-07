(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('modalController', [ '$modal',
					 function( $modal ) {
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
															  	 	$scope.dados.operadora = aux[1]
															  	 if(phone.length <= 9)
															  	 	data.telefone = phone;
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

						vm.login = function (urlBack, urlNext, callback) {
		 					var modalInstance = $modal.open({
		 							templateUrl: '/views/modal-login.html',
		 							controller : function ($scope, $modalInstance, QiSatAPI, authService) {

		 											  $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;

													  $scope.cancel = function () {
													    $modalInstance.dismiss('cancel');
													  };

													  $scope.redirectSignup = function () {
													  	 	//'/carrinho/pagamento' || '/cursos/online/gratuito'
														  	authService.setRedirect(urlBack);
														  	window.location = '/cadastro'; 
													  };

													  $scope.clickremember = function () {
													  	 $scope.remember = !$scope.remember;
													  };

													  $scope.login = function(credentials) {
														 		credentials.remember =  true; 
														 		$scope.alert = false;

																authService.login(credentials).then(function (res){
																	var url;
												 					if((res.status == 200)&&(res && res.data && res.data.retorno && res.data.retorno.sucesso)){
												 						$scope.cancel();

												 						if(url = authService.getRedirect()){
												 							authService.setRedirect();
												 							window.location = url;
												 						}else if(urlNext)
												 							window.location = urlNext;
												 						else if(typeof callback === "function")
												 							callback();

												 						return res.data.retorno.sucesso;
												 					}else{
												 						$scope.alert = { main : { title : "Falha na Autenticação!" } };
												 						$scope.loading = false;
												 					}
												 					return false;
													 			}, function(res){ 
													 				$scope.alert = { main : { title : "Falha na Autenticação!" } };
											 						$scope.loading = false;
											 						return false;
													 			});
														};

														$scope.sendMail = function(email){
															var data = { email : email };
										 						$scope.alert = false;

															QiSatAPI.remember(data)
																		.then( function ( response ){
																				if(response && response.data && response.data.retorno && response.data.retorno.sucesso){ 
																					$scope.alert = { success : true, main : { title : "Lembrete de senha enviado com Sucesso!"} };
																					delete($scope.email);
																					$scope.remember = false;
																			    }else{
																				 	if(response && response.data && response.data.retorno && response && response.data && response.data.retorno.mensagem){
																				 		$scope.alert = {  main : { title : "Falha no Envio da Mensagem."} }
																				 	}
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