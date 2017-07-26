(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller("convenioController", 
					[ '$scope', '$controller', '$filter' ,'$location', 'QiSatAPI', 'Config', 
						function($scope, $controller, $filter, $location, QiSatAPI, Config ){

						var vm = this, modalController = $controller('modalController');
							vm.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;


						if($location.hash() == 'cadastro')
							vm.openAdd = true;

						if($location.path() == '/institucional/convenios/conselhos')
							vm.type = 3;
						else if($location.path() == '/institucional/convenios/preduc/entidade')
							vm.type = 2;
						else if($location.path() == '/institucional/convenios/preduc/ensino')
							vm.type = 1;

						vm.open = function (){
							vm.openAdd = true;
						};

						vm.alert = function(){
							if(!vm.linkDownload){
								modalController.alert({ error : true, main : { title : "Preencha o termo de adesão." }});
								vm.openAdd = true;
								vm.openDownload = false;
							}
						};

						vm.addInstitution = function(type){
							var data = { };

							if( (vm.cadastroConselhoForm && vm.cadastroConselhoForm.$valid) ||
								(vm.cadastroInstituicaoForm && vm.cadastroInstituicaoForm.$valid) ||
								(vm.cadastroEntidadeForm && vm.cadastroEntidadeForm.$valid)){

								vm.send = true;

								if(type == 1)
									data = vm.institution;
								else if(type == 2){
									data = vm.entidade;
									data.cargo = 'Presidente';
								}else if(type == 3)
									data = vm.conselho;
								else return;

								data.ecm_convenio_tipo_instituicao_id = type;

								QiSatAPI.addInstitution(data)
											.then( function ( response ){
													vm.send = false;
													if(response.data.retorno.sucesso){

														if(vm.cadastroConselhoForm){
															vm.cadastroConselhoForm.$setPristine();
															vm.conselho = {};
														}else if(vm.cadastroInstituicaoForm){
															vm.cadastroInstituicaoForm.$setPristine();
															vm.institution = {};
															vm.openAdd = false;
															vm.openDownload = true;
															vm.linkDownload = response.data.retorno.link;
														}else if(vm.cadastroEntidadeForm){
															vm.cadastroEntidadeForm.$setPristine();
															vm.entidade = {};
															vm.openAdd = false;
															vm.openDownload = true;
															vm.linkDownload = response.data.retorno.link;
														}
														
														if(type == 1 || type == 2)
															modalController.alert({ success : true, main : { title : "Obrigado! Os dados foram registrados.", subtitle : "Faça o download do termo de adesão e da lista de alunos e professores. A equipe QiSat entrará em contato em breve." } });
														else
															modalController.alert({ success : true, main : { title : "Obrigado! Sua solicitação foi enviada.", subtitle : "A equipe QiSat entrará em contato em breve." } });

													}else
														modalController.alert({ error : true, main : { title : "Falha na Solicitação de Cadastro." }});

												}, function ( response ){
													modalController.alert({error : true});
												});
							}
						};

			}]);
})();
