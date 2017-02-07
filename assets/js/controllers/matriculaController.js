(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('matriculaController', [ '$scope','authService','Authenticated', '$filter',
					 function(scope, authService, Authenticated, $filter ) {
					 	var filterLimitName = $filter('limitName');

					 	scope.title = "Cursos em Andamento"; 
					 	scope.agendados = false;
						scope.outros = false;
						scope.filterTab = 'liberado';

					 	if(authService.isLogged() && Authenticated)
					 		scope.user = authService.getUser();

					 	authService.courses()
					 			   .then(function (res){

									 		if(res.matriculas){
										 		scope.courses = res.matriculas;
										 		scope.courses.map(function (matricula){
										 			var timestart,timeend, day, month, year;

										 			if(matricula.info)
										 				matricula.info.tituloLimit = filterLimitName(matricula.info.titulo, 100);
										 			else if (matricula.nome)
										 				matricula.nomeLimit = filterLimitName(matricula.nome, 100);

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
										 				timestart = new Date(matricula.timestart*1000);
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
					 				});

					 }]);
})();
