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

						scope.setFilterTab = function(val){
							scope.filterTab = val;
						}

					 	if(Authenticated){
					 		scope.user = authService.getUser();

						 	authService.courses()
						 			   .then(function (res){

										 		if(res.matriculas){
											 		scope.courses = res.matriculas;
											 		scope.courses.map(function (matricula){
											 			var timestart,timeend, day, month, year, imagemFile;

											 			if(matricula.imagem && matricula.imagem.length){
															imagemFile = matricula.imagem.find(function(img) { return img.descricao == 'Imagens - Capa' });
															if(imagemFile){
																 if(imagemFile.src.indexOf('upload/http://')>=0)
																		imagemFile.src = imagemFile.src.replace('upload/http://', 'http://');
																matricula.imgSrc = imagemFile.src;
															}
														}else
															matricula.imgSrc = Config.imgCursoUrlDefault;

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
											 				timeend = new Date(matricula.data_conclusao*1000);
											 				day = timeend.getDate();
															month = timeend.getMonth()+1;
															year = timeend.getFullYear();
											 				matricula.msg = "Concluído em "+day+"/"+month+"/"+year;
											 				matricula.filter = 'finalizado';
											 			}else if(matricula.status == "Curso Agendado"){
											 				timestart = new Date(matricula.timestart*1000);
											 				day = timestart.getDate();
															month = timestart.getMonth()+1;
															year = timestart.getFullYear();
											 				matricula.msg = " Data de Inicío "+day+"/"+month+"/"+year;
											 				matricula.filter = 'agendado';
											 				if(!scope.agendados) scope.agendados = true;
											 			}else if(matricula.status == "Liberado para Acesso"){
											 				matricula.enable = true;
											 				timestart = new Date(matricula.timeend*1000);
											 				day = timestart.getDate();
															month = timestart.getMonth()+1;
															year = timestart.getFullYear();
											 				matricula.msg = "Expira em "+day+"/"+month+"/"+year;
											 				matricula.filter = 'liberado';
											 			}else if(matricula.status == "Prazo Encerrado"){
											 				matricula.filter = 'encerrado';
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
