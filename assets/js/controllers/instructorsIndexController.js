(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller("instructorsIndexController",
				[ '$scope', 'Config', 'QiSatAPI', function(scope, Config, QiSatAPI){

					QiSatAPI.getInstructorsTop()
									.then( function ( response ){
											var instructors = [];
											if(response.status == 200 && response.data && response.data.success) instructors = response.data.data;

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
									});


		}]);
})();