(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('matriculaController', [ '$scope','authService','Authenticated',
					 function(scope, authService, Authenticated ) {

					 	if(authService.isLogged() && Authenticated)
					 		scope.user = authService.getUser();

					 	authService.courses().then(function (res){

					 		scope.courses = res.data;
					 		scope.courses.map(function (matricula){
					 			var timestart,timeend, day, month, year;

					 			if(matricula.data_conclusao){
					 				timeend = new Date(matricula.data_conclusao);
					 				day = timeend.getDate();
									month = timeend.getMonth()+1;
									year = timeend.getFullYear();
					 				matricula.msg = "Concluído em "+day+"/"+month+"/"+year;
					 			}else if(matricula.status == "Curso Agendado"){
					 				timestart = new Date(matricula.data_inicio_curso);
					 				day = timestart.getDate();
									month = timestart.getMonth()+1;
									year = timestart.getFullYear();
					 				matricula.msg = " Data de Inicío "+day+"/"+month+"/"+year;
					 			}else if(matricula.status == "Liberado para Acesso"){
					 				matricula.enable = true;
					 				timestart = new Date(matricula.data_inicio_curso);
					 				day = timestart.getDate();
									month = timestart.getMonth()+1;
									year = timestart.getFullYear();
					 				matricula.msg = "Expira em "+day+"/"+month+"/"+year;
					 			}
					 		});

					 	});

					 }]);
})();