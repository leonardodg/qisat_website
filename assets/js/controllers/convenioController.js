(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller("convenioController", 
					[ '$scope','$filter' ,'QiSatAPI', 'Config', function($scope,$filter,  QiSatAPI, Config ){

						$scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
						var cursos = [], descontos = Config.convenio, cursosSoftware, cursosTeoricos;
						var filterTypes = $filter('byTypes');

						$scope.addInstitution = function(type){
							var data = { type: 'add-institution-'+type }, elemts;

							if(type == 1) data.data = $scope.institution;
							else if(type == 2) data.data = $scope.entidade;
							else if(type == 3) data.data = $scope.conselho;
							else return;

							data.data.typeid = type;
							elemts = angular.element('.alert-box');
							elemts.css('display', 'none');

							QiSatAPI.sendMail(data)
										.then( function ( response ){
												elemts = angular.element('.alert-'+type+'-ok');
												elemts.css('display', 'inline-block');
											}, function ( response ){
												elemts = angular.element('.alert-'+type+'-error');
												elemts.css('display', 'inline-block');
											});
						}

						$scope.institutionDiscount = function(){
							var data = { type: 'institution-discount', data : $scope.desconto }, elemts;

							elemts = angular.element('.alert-box');
							elemts.css('display', 'none');

							QiSatAPI.sendMail(data)
										.then( function ( response ){
												elemts = angular.element('.alert-discount-ok');
												elemts.css('display', 'inline-block');
											}, function ( response ){
												elemts = angular.element('.alert-discount-error');
												elemts.css('display', 'inline-block');
											});
						}

						QiSatAPI.getConvenios()
										.then( function ( response ){
												var data = [];
												if(response.status == 200) data = response.data;
												data.map(function (el){
													el.dataFim = $filter('date')( el.timeend*1000, 'dd/MM/yy' );
												});
												$scope.institutions = data.filter(function(el){return el.typeid == 1});
												$scope.entidades = data.filter(function(el){return el.typeid == 2});
												$scope.selectInstitution = data;
											});

						 QiSatAPI.getCourses(function (data){

						 	data.map(function(course){
						 		var valor = course.valorTotal-(course.valorTotal*(descontos.descontoAluno/100));
									course.valorAluno = $filter('currency')(valor, 'R$');
									valor = course.valorTotal-(course.valorTotal*(descontos.descontoAssociado/100));
									course.valorAssociado = $filter('currency')(valor, 'R$');
									valor = course.valorTotal-(course.valorTotal*(descontos.descontoProfessor/100));
									course.valorProfessor = $filter('currency')(valor, 'R$');
									valor = course.valorTotal-(course.valorTotal*(descontos.descontoCREAS/100));
									course.valorCREAs = $filter('currency')(valor, 'R$');

						 	})

						 	cursosSoftware = filterTypes(data, 23);
						 	cursosTeoricos = filterTypes(data, 24);

						 	cursosTeoricos = cursosTeoricos.filter(function(el){ return el.info});
						 	cursosSoftware = cursosSoftware.filter(function(el){ return el.info});

						 	cursosSoftware.sort(function (a, b) {
							  if (a.nome > b.nome) {
							    return 1;
							  }
							  if (a.nome < b.nome) {
							    return -1;
							  }
							  return 0;
							});

							cursosTeoricos.sort(function (a, b) {
							  if (a.nome > b.nome) {
							    return 1;
							  }
							  if (a.nome < b.nome) {
							    return -1;
							  }
							  return 0;
							});

						 	$scope.cursosSoftware = cursosSoftware;
						 	$scope.cursosTeoricos = cursosTeoricos;
						 });

				}]);
})();