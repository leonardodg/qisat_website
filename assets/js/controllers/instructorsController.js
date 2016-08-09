var QiSatApp = angular.module('QiSatApp');

QiSatApp.controller("instructorsController",
			function($scope, QiSatAPI, Config){
						QiSatAPI.getInstructorsTop()
								.then( function ( response ){
									var instructors = [];
									if(response.status == 200) instructors = response.data;
									instructors.map( function (instructor) {
										if(instructor)
											if(!instructor.imagem)
												instructor.imagem = Config.imagensUrlDefault;
											else
												instructor.imagem = Config.imagensUrl+instructor.imagem;

											if(instructor.redes_sociais){
												instructor.linkedin = instructor.redes_sociais.find(function(el){
														return el.descricao == 'Linkedin';
												});
											}

									});
									$scope.instructors = instructors;
								 });
			});