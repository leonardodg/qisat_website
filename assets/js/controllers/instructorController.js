(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller("instructorController",
				[ '$scope', '$sce', 'Config', 'QiSatAPI', 'instrutor', 
					function(scope, $sce, Config, QiSatAPI, instructor){
						console.log(instructor);

								if(instructor){
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