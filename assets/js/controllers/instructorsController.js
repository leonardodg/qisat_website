(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller("instructorsController",
				[ '$scope', 'Config', 'QiSatAPI', 'instrutores', '$filter',
					function(scope, Config, QiSatAPI, instructors, $filter){
						var filterLimitName = $filter('nameInstructor');
				 		scope.currentPage = 1;
				 		scope.startPage = 0;
				 		scope.itemsPerPage = 10;

				 		scope.onSelectPage = function(page){
				 			if(page==1)
				 				scope.startPage = 0;
				 			else
				 				scope.startPage = scope.itemsPerPage*(page-1);
				 		};

						if(instructors){
							instructors.map( function (instructor) {
								if(instructor){
									instructor.nome = filterLimitName(instructor.nome);
									if(!instructor.imagem)
										instructor.imagem = Config.imagensUrlDefault;

									if(instructor.redes_sociais){
										instructor.linkedin = instructor.redes_sociais.find(function(el){
												return el.descricao == 'Linkedin';
										});
									}
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

						scope.$watch('filtered', function() {
							 if(  scope.formacao || scope.searchName || (scope.areas && Object.keys(scope.areas).length))
						     	scope.totalItems = scope.filtered.length;
						     else
								scope.totalItems = scope.instructors.length;
						});

						scope.filterInstructor = function(elem){
									var result, keys = [], formacoes = ['Arquiteto', 'Eng. Agronomo', 'Eng. Civil', 'Eng. Eletricista', 'Eng. Sanitarista'];
									if(scope.areas || scope.formacao) {
										result = false;
										if(scope.areas)
											keys = Object.keys(scope.areas);
										if (keys.length){
											keys.map(function(key, index) {
											   if(scope.areas[key] == elem.areas[key])
											  	 result = true;
											});
										}

										if (scope.formacao == elem.formacao || (scope.formacao == "Outros" && formacoes.indexOf(elem.formacao) < 0))
								   			result = true;
									}else result = true;
									return result;
						};
		 }]);
})();