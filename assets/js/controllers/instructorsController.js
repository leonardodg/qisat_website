(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller("instructorsController",
				[ '$scope', 'Config', 'QiSatAPI', 'instrutores', 
					function(scope, Config, QiSatAPI, instructors){

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

						scope.changeCheckbox = function(){
							var keys = Object.keys(scope.areas);
				
							keys.map(function(key, index) {
						   		if( scope.areas.hasOwnProperty(key) && scope.areas[key] == "0")
						   			delete(scope.areas[key]);
							});

							keys = Object.keys(scope.areas);
							if(!keys.length)
								delete(scope.areas);
						};

						scope.changeFormacao = function(){
							if( !scope.formacao )
							 	delete(scope.formacao);
						};


						scope.filterInstructor = function(elem){
									var result, keys = [];
									if(scope.areas || scope.formacao) {
										result = false;
										if(scope.areas)
											keys = Object.keys(scope.areas);
										if (keys.length){
											keys.map(function(key, index) {
											   if(scope.areas[key] == elem.areas[key])
											  	 result = true
											});
										}

										if (scope.formacao == elem.formacao || (elem.formacao == "Outros" && scope.formacao != elem.formacao))
								   			result = true
									}else result = true;
									return result;
						};
		 }]);
})();