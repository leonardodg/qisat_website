(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller("instructorsController",
				[ '$scope', 'Config', 'QiSatAPI', 'instrutores', 
					function(scope, Config, QiSatAPI, instructors){
						console.log(instructors);
						if(instructors){
							instructors.map( function (instructor) {
								if(instructor)
									if(!instructor.imagem)
										instructor.imagem = Config.imagensUrlDefault;

									if(instructor.redes_sociais){
										instructor.linkedin = instructor.redes_sociais.find(function(el){
												return el.descricao == 'Linkedin';
										});
									}

							});
							scope.instructors = instructors;
						}
		 }]);
})();