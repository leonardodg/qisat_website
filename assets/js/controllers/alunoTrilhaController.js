(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('alunoTrilhaController', [ '$scope', '$filter',  'authService', 'Config', 'Authenticated',
					 function( scope, $filter, authService, Config, Authenticated) {

					 	var vm = this;
 						var filterLimitName = $filter('limitName');
 						var zpad = $filter('zpad');
 						moment.locale('pt-BR');


					 	vm.abaProjeto = 'estrutural';
					 	vm.abaConteudo = 'sobre'; 
					 	vm.loading = false;

					 	vm.setConteudo = function (value) {
					 		vm.abaConteudo = value;

					 		if(value == 'estudo' && vm.abaProjeto == 'estrutural')
					 			getTrilhas(3); // idTipo
					 		else if(value == 'desempenho' && vm.abaProjeto == 'estrutural'){
					 			vm.loading1 = true;
					 			vm.loading2 = true;
					 			vm.loading3 = true;
					 			vm.loading4 = true;

						 		authService.ranking(3)
							 			   .then(function (res){
							 			   				vm.loading1 = false;
							 			   				vm.sucesso1 = res.sucesso;
							 			   				if(res.ranking && res.ranking.length){
							 			   					vm.ranking = [];
							 			   					res.ranking.map(function(item){
							 			   						vm.ranking.push({ value : item.ranking.toFixed(2) +"%", nome : item.mdl_user.firstname });
							 			   					});
							 			   				}
							 			   			});

						 		authService.concluidoTrilha(3)
							 			   .then(function (res){
							 			   				vm.loading2 = false;
							 			   				vm.sucesso2 = res.sucesso;
							 			   				vm.concluidoTrilha = parseInt(res.concluidoTrilha);
							 			   			});

						 		authService.cursosFeitos(3)
							 			   .then(function (res){
							 			   				vm.loading3 = false;
							 			   				vm.sucesso3 = res.sucesso;
							 			   				vm.cursosConcluidos = res.cursos_concluidos;
							 			   				vm.totalCursos = res.total_cursos; 
							 			   				vm.cursosText = zpad(vm.cursosConcluidos, 2)+"/"+zpad(vm.totalCursos, 2);
							 			   			});

						 		authService.tempoConclusao(3)
							 			   .then(function (res){
							 			   				vm.loading4 = false;
							 			   				vm.sucesso4 = res.sucesso;
							 			   				vm.diasPercorridos = res.dias_percorridos;
							 			   				vm.totalDias = res.total_dias;
							 			   				vm.diasText = vm.diasPercorridos +"/"+vm.totalDias+ " Dias";
							 			   			});
					 		}
					 		
					 	}

					 	vm.setProjeto = function (value) {
					 		vm.abaProjeto = value;
					 		vm.abaConteudo = 'sobre'; 
					 	}


						if(Authenticated)
					 		vm.user = authService.getUser();

					 	function getTrilhas(tipo){
					 		authService.trilhas(tipo)
						 			   .then(function (res){
						 			   			vm.fases = [];
						 			   			vm.loading = true;
										 		if(res.sucesso && res.trilha){
												 	res.trilha.map(function (trilha){
						 			   					var fase = { nome : trilha.fase };
													 	fase.matriculas = trilha.matriculas.map(function (matricula){
													 			var timestart,timeend, day, month, year, imagemFile, dependencias;

													 			matricula.andamento = parseInt(matricula.andamento);

													 			if(!matricula.imagem)
																	matricula.imagem = Config.imgCursoUrlDefault;

																if(matricula.dependencias && matricula.dependencias.length){
																	dependencias = matricula.dependencias.filter(function(dep){
																		return !dep.completo;
																	});

																	if(dependencias.length > 0)
																		matricula.blocked = true;
																	else
																		matricula.blocked = false;
																}

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
													 			}

													 			return matricula;
									 						});
													 		vm.fases.push(fase);
													});
										 		}
						 				});
					 	}

					 }]);
})();
