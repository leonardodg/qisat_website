(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller("instructorController",
				[ '$scope', '$sce', 'Config', 'QiSatAPI', 'instrutor', '$filter', 
					function(scope, $sce, Config, QiSatAPI, instructor, $filter){

							var filterLimitName = $filter('nameInstructor');

								if(instructor){
									instructor.nome = filterLimitName(instructor.nome,200);

									if(!instructor.imagem)
										instructor.imagem = Config.imagensUrlDefault;

									if(instructor.redes_sociais){
										instructor.linkedin = instructor.redes_sociais.find(function (el){
												return el.descricao == 'Linkedin';
										});
									}

									if(instructor.descricao)
										instructor.descricao = $sce.trustAsHtml(instructor.descricao);

									scope.instructor = instructor;
								}
		 }]);
})();