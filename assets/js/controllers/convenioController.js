(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller("convenioController", 
					[ '$scope','$filter' ,'QiSatAPI', 'Config', function($scope,$filter, QiSatAPI, Config ){

						$scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;

						$scope.addInstitution = function(type){
							var data = { }, elemts, alert = '.alert-'+type+'-ok', error = '.alert-'+type+'-error';

							if( ($scope.cadastroConselhoForm && $scope.cadastroConselhoForm.$valid) ||
								($scope.cadastroInstituicaoForm && $scope.cadastroInstituicaoForm.$valid) ||
								($scope.cadastroEntidadeForm && $scope.cadastroEntidadeForm.$valid)){

								if(type == 1)
									data = $scope.institution;
								else if(type == 2){
									data = $scope.entidade;
									data.cargo = 'Presidente';
								}else if(type == 3)
									data = $scope.conselho;
								else return;

								data.ecm_convenio_tipo_instituicao_id = type;
								elemts = angular.element('.alert-box');
								elemts.css('display', 'none');

								QiSatAPI.addInstitution(data)
											.then( function ( response ){
													if(response.data.retorno.sucesso){
														elemts = angular.element(alert);
														elemts.css('display', 'inline-block');
														if($scope.cadastroConselhoForm){
															$scope.cadastroConselhoForm.$setPristine();
															$scope.conselho = {};
														}else if($scope.cadastroInstituicaoForm){
															$scope.cadastroInstituicaoForm.$setPristine();
															$scope.institution = {};
														}else if($scope.cadastroEntidadeForm){
															$scope.cadastroEntidadeForm.$setPristine();
															$scope.entidade = {};
														}
													}else{
														elemts = angular.element(error);
														elemts.css('display', 'inline-block');
													}
												}, function ( response ){
													elemts = angular.element(error);
													elemts.css('display', 'inline-block');
												});
							}
						}

						$scope.institutionDiscount = function(){
							var data = angular.copy($scope.desconto), elemts;

							elemts = angular.element('.alert-box');
							elemts.css('display', 'none');

							if($scope.descontoForm && $scope.descontoForm.$valid){
								data.ecm_convenio_id = data.institution.id;
								delete(data.institution);

								QiSatAPI.addInteresse(data)
											.then( function ( response ){
													if(response.data.retorno.sucesso){
														$scope.desconto = {};
														$scope.descontoForm.$setPristine();
														elemts = angular.element('.alert-discount-ok');
														elemts.css('display', 'inline-block');
													}else{
														elemts = angular.element('.alert-discount-error');
														elemts.css('display', 'inline-block');
													}
												}, function ( response ){
													elemts = angular.element('.alert-discount-error');
													elemts.css('display', 'inline-block');
												});
							}
						}

			}]);
})();
