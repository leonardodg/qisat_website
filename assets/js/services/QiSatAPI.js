(function() {
    'use strict';

    /*
		QiSatAPI - Service Data Objects
    */

	 angular
	 	.module('QiSatApp')
	 	.factory("QiSatAPI", [ '$http', '$filter', 'Config', 
	 			function($http, $filter, Config){

					var sdo = {

		                        createUser : function (data) {

		                            var promise = $http({ 
		                                                    method: 'post', 
		                                                    url: Config.baseUrl+'/user/',
		                                                    data: data
		                                                        });

		                            return promise.then( function(res){ 
		                                                    return res; 
		                                                }, function(res){ 
		                                                    return res; 
		                                                });
		                        },

		                        checkByEmail : function (email) {

		                            var promise = $http({ 
		                                                    method: 'post', 
		                                                    url: Config.baseUrl+'/user/checkEmail',
		                                                    data: { email: email }
		                                                        });

		                            return promise.then( function(res){ 
		                                                    return res; 
		                                                }, function(res){ 
		                                                    return res; 
		                                                });
		                        },

		                    	checkByCPF : function (cpf) {

		                            var promise = $http({ 
		                                                    method : 'post', 
		                                                    url : Config.baseUrl+'/user/checkCPF',
		                                                    data : { cpf: cpf }
		                                                        });

		                            return promise.then( function(res){ 
		                                                    return res; 
		                                                }, function(res){ 
		                                                    return res; 
		                                                });
		                        },

							getInstructorsTop : function () {
									var promise = $http({ 
														cache: true, 
														method: 'GET', 
														url: Config.baseUrl+'/instrutores/top'
													});

										promise.then( handleSuccess, handleError );

									return promise;
							},

							getStates : function () {
									var promise = $http({ 
														cache: true, 
														method: 'GET', 
														url: Config.baseUrl+'/moodle/estados'
													});

										promise.then( handleSuccess, handleError );

									return promise;
							},

							getCourseStates : function () {
									var promise = $http({ 
															cache: true, 
															method: 'GET', 
															url: Config.baseUrl+'/moodle/eventos/estados'
														});

										promise.then( handleSuccess, handleError );

									return promise;
							},

							getCoursesTop : function () {
									var promise = $http({ 
															cache: true, 
															method: 'GET', 
															url: Config.baseUrl+'/moodle/produtos/top'
														});

										promise.then( handleSuccess, handleError );

									return promise;
							},

							getInfo : function (course) {
									
									var promise = $http({ 
															cache: true, 
															method: 'GET', 
															url: Config.baseUrl+'/info/'+course
														});

										return promise.then( function successCallback( res ){
											if(res.status == 200) 
												return res.data;
										});
							},


							getCourses : function () {
									var promise = $http({ 
													cache: true, 
													method: 'GET', 
													url: Config.baseUrl+'/moodle/produtos'
												});

										promise.then( function successCallback( response ){
													var courses = [];
													var filterTypes = $filter('byTypes'),
														filterZpad = $filter('zpad'),
														filterLimitName = $filter('limitName');

													if(response.status == 200) courses = response.data;
													courses.map( function (course, i) {
														var imagemFile;
														if(course){

															course.valorTotal = course.preco;
															course.preco = $filter('currency')(course.preco, 'R$');
															course.imgSrc = Config.imgCursoUrlDefault;
															
															if(course.info){
																if(course.info.files){
																	imagemFile = course.info.files.find(function(img) { return img.tipo == '5' });
																	if(imagemFile) course.imgSrc =  Config.baseUrl+imagemFile.path.replace(/["\\"]/g,'/').replace( "public" ,'');
																}

																course.nome = filterLimitName(course.info.titulo);

																//serie, pack, classroom, events, single, releases, free, online
																if( course.categorias.find(function(tipo){ return tipo.id == 32 })) { // Séries
																	course.modalidade = "Série Online";
																	course.isSerie = true;
																	course.link =  "/curso/online/"+course.info.seo.url ;
																	course.info.conteudos.map( function (conteudo){
																				 var aux =  conteudo.titulo.split('-');
																				 conteudo.capitulo = aux[0];
																				 conteudo.nome = aux[1];
																				});
																}else if( course.categorias.find(function(tipo){ return tipo.id == 17 })){ // Pacotes
																	course.modalidade = "Pacote de Cursos Online";
																	course.isPack = true;
																	course.link =  "/curso/online/"+course.info.seo.url ;
																}else if( course.categorias.find(function(tipo){ return tipo.id == 40 })){ // PALESTRAS
																	course.modalidade = "Palestra Online";
																	course.isLecture = true;
																	course.link =  "/curso/online/"+course.info.seo.url ;
																}else if( course.categorias.find(function(tipo){ return tipo.id == 12 })){ // Presenciais Individuais
																	course.modalidade = "Curso Presencial - individual";
																	course.isIndividual = true;
																	course.link =  "/curso/presencial/"+course.info.seo.url ;
																}else if( course.categorias.find(function(tipo){ return tipo.id == 10 })){ // Presencial
																	course.modalidade = "Curso Presencial";
																	course.isClassroom = true;
																	course.link = "/curso/presencial/"+course.info.seo.url;
																}else if( course.categorias.find(function(tipo){ return tipo.id == 2 })){ // A Dinstancia
																	course.modalidade = "Curso Online";
																	course.isOnline = true;
																	course.link = "/curso/online/"+course.info.seo.url ;
																}
															}
														}
													});
													return courses;
												}, handleError );
									return promise;
							},

							

							getFilterData : function () {
										var promise = $http({ 
															cache: true, 
															method: 'GET', 
															url: Config.baseUrl+'/moodle/tipo/dados'
														});

										promise.then( handleSuccess, handleError );

										return promise;
							},

							sendMail : function (data) {
									var promise = $http({ 
															method: 'POST', 
															url: Config.baseUrl+'/sendmail',
															data: data
														});

											promise.then( handleSuccess, handleError );

									return promise;
							},

							getConvenios : function () {
								var promise = $http({ 
															cache: true, 
															method: 'GET', 
															url: Config.baseUrl+'/moodle/convenios'
														});

											promise.then( handleSuccess, handleError );

										return promise;

							},

							login : function (data) {
								var promise = $http({ 
															method: 'POST', 
															url: Config.baseUrl+'/moodle/login',
															data: data
														});

										promise.then( handleSuccess, handleError );

										return promise;

							}
						};

				return sdo;
				
			  	// private functions
				function handleSuccess(res) {
				    return res.data;
				}

				function handleError(error) {
				    return function () {
				        return { success: false, error: error };
				    };
				}
			}]);
}());