(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller("convenioController", 
					[ '$scope','$filter' ,'QiSatAPI', 'Config', function($scope,$filter, QiSatAPI, Config ){

						$scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
						$scope.states = Config.states;

						$scope.addInstitution = function(type){
							var data = { type: 'add-institution-'+type }, elemts;

							if(type == 1) {
								data = $scope.institution;
								data.ecm_convenio_tipo_instituicao_id = 'Instituição de Ensino';
							} else if(type == 2) {
								data = $scope.entidade;
								data.ecm_convenio_tipo_instituicao_id = 'Entidade de Classe';
								data.cargo = 'Presidente';
							} else if(type == 3) {
								data = $scope.conselho;
								data.ecm_convenio_tipo_instituicao_id = 'Conselho';
							} else return;

							data.typeid = type;
							elemts = angular.element('.alert-box');
							elemts.css('display', 'none');

							QiSatAPI.addInstitution(data)
										.then( function ( response ){
												if(response.data.retorno.sucesso){
													elemts = angular.element('.alert-'+type+'-ok');
													elemts.css('display', 'inline-block');
												}else{
													elemts = angular.element('.alert-'+type+'-error');
													elemts.css('display', 'inline-block');
												}
											}, function ( response ){
												elemts = angular.element('.alert-'+type+'-error');
												elemts.css('display', 'inline-block');
											});
						}

						$scope.institutionDiscount = function(){
							var data = $scope.desconto, elemts;

							data.id = data.institution.id;

							elemts = angular.element('.alert-box');
							elemts.css('display', 'none');

							QiSatAPI.addInteresse(data)
										.then( function ( response ){
												if(response.data.retorno.sucesso){
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

						QiSatAPI.getConvenios()
										.then( function ( response ){
												var data = [];
												if(response.status == 200) data = response.data.retorno.ecmConvenio;
												data.map(function (el){
													el.dataFim = $filter('date')( el.timeend*1000, 'dd/MM/yy' );
												});
												$scope.institutions = data;
												$scope.selectInstitution = data;

											});

			}]);
})();
