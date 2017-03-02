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

															  			console.log(dados);
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

					 	vm.trailer = function (url) {
				 					var modalInstance = $modal.open({ 
                      						windowClass: 'trailer',
				 							templateUrl: '/views/modal-trailer.html',
				 							controller : function ($scope, $modalInstance, $sce) {
															  $scope.cancel = function () {
															    $modalInstance.dismiss('cancel');
															  };
															  $scope.video = $sce.trustAsResourceUrl(url);
															}
				 						});
					 			  };

					 }]);
})();