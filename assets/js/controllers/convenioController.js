(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller("convenioController", 
					[ '$scope','$filter' ,'$location','QiSatAPI', 'Config', function($scope,$filter, $location, QiSatAPI, Config ){

						var vm = this;
						vm.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;

						if($location.hash() == 'cadastro')
							vm.openAdd = true;

						vm.open = function (){
							vm.openAdd = true;
						};

						vm.addInstitution = function(type){
							var data = { }, elemts, alert = '.alert-'+type+'-ok', error = '.alert-'+type+'-error';

							if( (vm.cadastroConselhoForm && vm.cadastroConselhoForm.$valid) ||
								(vm.cadastroInstituicaoForm && vm.cadastroInstituicaoForm.$valid) ||
								(vm.cadastroEntidadeForm && vm.cadastroEntidadeForm.$valid)){

								if(type == 1)
									data = vm.institution;
								else if(type == 2){
									data = vm.entidade;
									data.cargo = 'Presidente';
								}else if(type == 3)
									data = vm.conselho;
								else return;

								data.ecm_convenio_tipo_instituicao_id = type;
								elemts = angular.element('.alert-box');
								elemts.css('display', 'none');

								QiSatAPI.addInstitution(data)
											.then( function ( response ){
													if(response.data.retorno.sucesso){
														elemts = angular.element(alert);
														elemts.css('display', 'inline-block');
														if(vm.cadastroConselhoForm){
															vm.cadastroConselhoForm.$setPristine();
															vm.conselho = {};
														}else if(vm.cadastroInstituicaoForm){
															vm.cadastroInstituicaoForm.$setPristine();
															vm.institution = {};
														}else if(vm.cadastroEntidadeForm){
															vm.cadastroEntidadeForm.$setPristine();
															vm.entidade = {};
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
						};

			}]);
})();
