(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('matriculaController', [ '$scope', '$rootScope', 'authService','Authenticated', '$filter', 'Config',
					 function( scope, $rootScope, authService, Authenticated, $filter, Config) {
					 	var filterLimitName = $filter('limitName');

						$rootScope.loading = true;
					 	scope.title = "Cursos em Andamento"; 
					 	scope.agendados = false;
						scope.outros = false;
						scope.filterTab = 'liberado';
						moment.locale('pt-BR');

						scope.setFilterTab = function(val){
							scope.filterTab = val;
						}

					 	if(Authenticated){
					 		scope.user = authService.getUser();

						 	authService.courses()
						 			   .then(function (res){
						 			   			scope.courses = [];
										 		if(res.matriculas){
											 		scope.courses = res.matriculas;
											 		scope.courses.map(function (matricula){
											 			var timestart,timeend, day, month, year, imagemFile;

											 			if(!matricula.imagem)
															matricula.imagem = Config.imgCursoUrlDefault;

											 			if(matricula.produto){
											 				matricula.nome = matricula.produto.nome;
											 				matricula.nomeLimit = filterLimitName(matricula.produto.nome, 100);
											 			}else if(matricula.info){
											 				matricula.nome = matricula.info.titulo;
											 				matricula.nomeLimit = filterLimitName(matricula.info.titulo, 100);
											 			}else if (matricula.curso){
											 				matricula.nome = matricula.curso;
											 				matricula.nomeLimit = filterLimitName(matricula.curso, 100);
											 			}

											 			if(matricula.data_conclusao){
											 				timeend = moment.unix(matricula.data_conclusao);
											 				if(timeend.isValid())
											 					matricula.msg = "Certificado em "+timeend.format('DD/MM/YYYY' );

											 				if(moment.unix(matricula.timeend).isAfter()){
											 					matricula.enable = true;
											 					matricula.filter = 'liberado';
											 				}else
											 					matricula.filter = 'finalizado';
											 		
											 			}else if(matricula.status == "Curso Agendado"){
															timestart = moment.unix(matricula.timestart);
															if(timestart.isValid()) 
																matricula.msg = " Data de Inicío "+timestart.format('DD/MM/YYYY' );
											 				matricula.filter = 'agendado';
											 				if(!scope.agendados) scope.agendados = true;
											 			}else if(matricula.status == "Liberado para Acesso"){
											 				matricula.enable = true;

											 				if(matricula.timeend){
												 				timeend = moment.unix(matricula.timeend);
												 				if(timeend.isValid()) 
												 					matricula.msg = "Expira em "+timeend.format('DD/MM/YYYY');
											 				}

											 				matricula.filter = 'liberado';
											 			}else if(matricula.status == "Prazo Encerrado"){
											 				matricula.filter = 'encerrado';
											 				if(matricula.timeend){
											 					timestart = moment.unix(matricula.timestart);
												 				timeend = moment.unix(matricula.timeend);
												 				if(timeend.isValid() && timestart.isValid())
												 					matricula.msg = "Liberado "+timestart.format('DD/MM/YYYY')+" - Expirou em "+timeend.format('DD/MM/YYYY');
											 				}

											 			}else{
											 				matricula.filter = 'outros';
											 				if(!scope.outros) scope.outros = true;
											 			}
							 						});
										 		}
												$rootScope.loading = false;
						 				});
						}

					 }]);
})();
