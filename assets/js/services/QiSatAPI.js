(function() {
    'use strict';

    /*
		QiSatAPI - Service Data Objects
    */

	 angular
	 	.module('QiSatApp')
	 	.factory("QiSatAPI", [ '$http', '$q','$filter', '$location', 'Config', 
	 			function($http, $q, $filter, $location, Config){

	 				var sdo, courses, coursesList = [], dataCoursesFilter = [], dataCoursesStates = [];

					sdo = {

		                        createUser : function (data) {

		                            var promise = $http({ 
		                                                    method: 'post',
		                                                    loading : true,
		                                                    url: Config.baseUrl+'/wsc-user/createUser',
		                                                    data: data
		                                                        });

		                            return promise.then( function(res){ 
		                                                    return res; 
		                                                }, function(res){ 
		                                                    return res; 
		                                                });
		                        },

		                        callMe : function(data){

		                        	var promise = $http({ 
		                                                    method: 'POST',
		                                                    loading : true,
		                                                    url: Config.baseUrl+'/repasse/wsc-ligamos-para-voce/salvar',
		                                                    data: data
		                                                        });

		                            return promise.then( function(res){ 
		                                                    return res; 
		                                                }, function(res){ 
		                                                    return res; 
		                                                });

		                        },

		                        repasse : function(data){

		                        	var promise = $http({ 
		                                                    method: 'POST', 
		                                                    loading : true,
		                                                    url: Config.baseUrl+'/repasse/wsc-repasse/salvar',
		                                                    data: data
		                                                        });

		                            return promise.then( function(res){ 
		                                                    return res; 
		                                                }, function(res){ 
		                                                    return res; 
		                                                });

		                        },


		                        contact : function(data){

		                        	var promise = $http({ 
		                                                    method: 'POST', 
		                                                    loading : true,
		                                                    url: Config.baseUrl+'/repasse/contato',
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
		                                                    loading : true,
		                                                    url: Config.baseUrl+'/wsc-user/checkEmail',
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
		                                                    loading : true,
		                                                    url : Config.baseUrl+'/wsc-user/checkCPF',
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
														url: Config.baseUrl+'/instrutor/wsc-instrutor/top',
														headers : {
															      'Content-Type' : 'application/json; charset=utf-8'
															      }
													});

										promise.then( handleSuccess, handleError );

									return promise;
							},

							getInstructors : function () {
									var promise = $http({ 
														cache: true, 
														method: 'GET', 
														url: Config.baseUrl+'/instrutor/wsc-instrutor/listar'
													});

										promise.then( handleSuccess, handleError );

									return promise;
							},

							getInstructor : function (id) {
									var promise = $http({ 
														cache: true, 
														loading : true,
														method: 'GET', 
														url: Config.baseUrl+'/instrutor/wsc-instrutor/get/'+id
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
									var deferred = $q.defer(), promise,
										inputStates, filter;

									
									if( Array.isArray(dataCoursesStates) && dataCoursesStates.length ){
											deferred.resolve( dataCoursesStates );
											return deferred.promise;
									}else{

										promise = $http({ 
												cache: true, 
												method: 'GET', 
												url: Config.baseUrl+'/curso-presencial/wsc-curso-presencial/estados-edicoes'
											});

										return promise.then( function (response){
													if(response && response.status == 200 && response.data && response.data.retorno){
														dataCoursesStates = response.data.retorno;

														if( Array.isArray(dataCoursesStates) && dataCoursesStates.length){

															inputStates = Config.filters.presencial.find(function (el){ return el.name == 'estado' })
															if(inputStates){
																dataCoursesStates.map(function (el){
																		var id = el.estado.toLowerCase();
												     						id = '#'+id.split(' ').map(function(e){ return e.charAt(0).toUpperCase() + e.slice(1); }).join('_');	
																		el.id = id;
																		inputStates.inputs.push(el);
																});
															}

															deferred.resolve( dataCoursesStates );
														}else 
															deferred.reject([]);
													} else 
														deferred.reject([]);

													return deferred.promise;
												}, function (response) {
													deferred.reject( response );
													return deferred.promise;
												});

									}

							},

							getCoursesTop : function () {
									var promise = $http({ 
															cache: true, 
															method: 'GET', 
															url: Config.baseUrl+'/produto/wsc-produto/destaques',
															headers : {
															      'Content-Type' : 'application/json; charset=utf-8'
															      }
														});

										promise.then( handleSuccess, handleError );

									return promise;
							},

							getInfo : function (course) {

									var promise = $http({ 
															cache: true, 
															loading : true,
															method: 'POST',
															data : { id : course },
															url: Config.baseUrl+'/produto/wsc-produto/get-info/'
														});

										return promise.then( function successCallback( res ){
											if(res && res.status == 200 && res.data && res.data.retorno && !Array.isArray(res.data.retorno) && res.data.retorno.sucesso !== false ) 
												return res.data.retorno;
											else
												return false;
										}, function(){ return false; });
							},


							getCourses : function () {
									var deferred = $q.defer(), promise,
										filterLimitName = $filter('limitName');

									if(Array.isArray(courses) && courses.length){
										deferred.resolve( courses );
										return deferred.promise;
									}else{
										
										promise = $http({ 
													cache: true, 
													loading : true,
													method: 'GET', 
													url: Config.baseUrl+'/produto/wsc-produto/listar'
												});

										return promise.then( function ( response ){

														if(response && response.status == 200 && response.data && response.data.retorno){
															courses = response.data.retorno;

															if( Array.isArray(courses) && courses.length){

																courses = courses.map( function (course, i) {
																	if(course && course.info){
																		var imagemFile, tipo, produto, itens, valorItens = 0, videoDemo;

																		course.imgSrc = Config.imgCursoUrlDefault;
																		course.nomeLimit = filterLimitName(course.info.titulo, 48);

																		//serie, pack, classroom, events, single, releases, free, online
																		if(tipo = course.categorias.find(function(tipo){ return tipo.id == 32 })) { // Séries
																			course.modalidade = tipo.nome;
																			course.isSerie = true;
																		}else if(tipo = course.categorias.find(function(tipo){ return tipo.id == 47 })) { // Fase Trilha
																			course.modalidade = tipo.nome;
																			course.isSetup = true;
																		}else if(tipo = course.categorias.find(function(tipo){ return tipo.id == 17 })){ // Pacotes
																			course.modalidade = tipo.nome;
																			course.isPack = true;
																		}else if(tipo = course.categorias.find(function(tipo){ return tipo.id == 40 })){ // PALESTRAS
																			course.modalidade = tipo.nome;
																			course.isLecture = true;
																		}else if(tipo = course.categorias.find(function(tipo){ return tipo.id == 12 })){ // Presenciais Individuais
																			course.modalidade = tipo.nome;
																			course.isIndividual = true;
																		}else if(tipo = course.categorias.find(function(tipo){ return tipo.id == 10 })){ // Presencial
																			course.modalidade = tipo.nome;
																			course.isClassroom = true;
																		}else if(tipo = course.categorias.find(function(tipo){ return tipo.id == 2 })){ // A Dinstancia
																			course.modalidade = tipo.nome;
																			course.isOnline = true;
																		}

																		if(course.imagens && course.imagens.length){
																			imagemFile = course.imagens.find(function(img) { return img.type == 'Imagens - Capa' });
																			if(imagemFile) course.imgSrc = imagemFile.src;
																		}

																		if(course.isSerie && course.produtos && course.produtos.length){
																			
																			course.id = [];
																			course.conteudos = [];

																			produto = course.produtos.find(function (prod){
																				if(prod && prod.categorias)
																					return prod.categorias.find(function(tipo){ return tipo.id == 41 });
																			});

																			itens = course.produtos.filter(function (prod){
																											if(prod && prod.categorias)
																												return prod.categorias
																															.find(function(tipo){ return tipo.id == 33 });
																										});

																			if(itens && itens.length){
																					itens.map( function (prod){
																									valorItens += prod.preco; 
																									course.id.push(prod.id);
																									if(prod){
																										prod.valor = $filter('currency')(prod.preco, 'R$');
																										course.conteudos.push(prod);
																									}
																							 	});
																			}

																			if(produto){
			 																	course.id = produto.id;
																				course.precoTotal =  $filter('currency')(produto.preco, 'R$');
																				if(produto.promocao){
																					course.preco = $filter('currency')(produto.valorTotal, 'R$');
																					course.promocaoDateend = $filter('date')( produto.promocao.datafim*1000, 'dd/MM/yyyy' );
																				}else
																					course.preco = $filter('currency')(produto.preco, 'R$');
																			}else{
																				course.precoTotal =  $filter('currency')(valorItens, 'R$');
																				course.preco =  $filter('currency')(valorItens, 'R$');
																			}
																		}else{
																			course.precoTotal =  $filter('currency')(course.preco, 'R$');
																			if(course.promocao){
																				course.preco = $filter('currency')(course.valorTotal, 'R$');
																				course.promocaoDateend = $filter('date')( course.promocao.datafim*1000, 'dd/MM/yyyy' );
																			}else
																				course.preco = $filter('currency')(course.preco, 'R$');

																			if(course.isSetup){
																				course.precoParcelado = $filter('currency')(course.valor_parcelado, 'R$');
																				if(course.promocao)
																					course.precoTotal = $filter('currency')( (course.valorTotal / course.parcelas), 'R$');
																			}	
																		}

																		return course;
																	}
																});

																deferred.resolve( courses );
															}else 
																deferred.reject([]);
														} else 
															deferred.reject([]);

														return deferred.promise;
										}, function (response) {
											 deferred.reject(response);
											 return deferred.promise;
										});

									}
								
							},

						getCourseList : function(){
							var  series, packages, classroom, events, single, releases, free, online,
								list, listOnline, listSeries, listPacks, listSingle, listEvents, listClass,
								filter, elemts, elem, inputs, selected, show, tipo, len, filterTypes = $filter('byTypes'),
								ordem = ['Online','Eventos','Series','Pacotes','Individual','Presencial'], auxiliar = [];


							if(courses.length){

								filter = coursesList.filter(function (list){ return list.show || list.selected });
								filter.map( function (list){ list.show = false; list.selected = false; });


								if($location.path() == '/certificacoes'){
									list = coursesList.find(function (list){ return list.type == 43 });
									if(!list) {
										if(tipo = dataCoursesFilter.find(function(el){ return el.id == 43 })){
											releases = filterTypes(courses, 43);
											show = (releases && releases.length) ? true : false;
											list = { id: coursesList.length+1, title: tipo.nome, courses: releases, type: 43, card: 'online', show: show };
											coursesList.push(list);
										}
									}else list.show = true;

									list = coursesList.find(function (list){ return list.type == 44 });
									if(!list) {
										if(tipo = dataCoursesFilter.find(function(el){ return el.id == 44 })){
											releases = filterTypes(courses, 44);
											show = (releases && releases.length) ? true : false;
											list = { id: coursesList.length+1, title: tipo.nome, courses: releases, type: 44, card: 'online', show: show };
											coursesList.push(list);
										}
									}else list.show = true;

								}else if($location.path() == '/altoqi-lab'){
									list = coursesList.find(function (list){ return list.type == 47 });
									if(!list) {
										if(tipo = dataCoursesFilter.find(function(el){ return el.id == 47 })){
											releases = filterTypes(courses, 47);
											show = (releases && releases.length) ? true : false;
											list = { id: coursesList.length+1, title: tipo.nome, courses: releases, type: 47, card: 'pacotes', show: show };
											coursesList.push(list);
										}
									}else list.show = true;
								}else if($location.path() == '/cursos/lancamentos'){
									list = coursesList.find(function (list){ return list.type == 39 });
									if(!list) {
										if(tipo = dataCoursesFilter.find(function(el){ return el.id == 39 })){
											releases = filterTypes(courses, 39);
											show = (releases && releases.length) ? true : false;
											list = { id: coursesList.length+1, title: tipo.nome, courses: releases, type: 39, card: 'online', show: show };
											coursesList.push(list);
										}
									}else list.show = true;
								}else if($location.path() == '/cursos/online/gratuito') {
									list = coursesList.find(function (list){ return list.type == 8 });
									if(!list) {
										if(tipo = dataCoursesFilter.find(function(el){ return el.id == 8 })){
											free = filterTypes(courses, 8);
											show = (free && free.length) ? true : false;
											list = { id: coursesList.length+1, title: tipo.nome, courses: free, type: 8, card: 'online', show: show };
											coursesList.push(list);
										}
									}else list.show = true;
								}else if($location.path().indexOf('/cursos/online')>=0){
									listOnline = coursesList.find(function (list){ return list.type == 2 });
									if(!listOnline) {
										if(tipo = dataCoursesFilter.find(function(el){ return el.id == 2 })){
											online = filterTypes(courses, 2);
											online = online.filter(function (course){ if(!course.categorias.find(function (tipo){ return (tipo.id == 32 || tipo.id == 33 || tipo.id == 17 || tipo.id == 22  || tipo.id == 9 || tipo.id == 8) })) return true; });
											show = (online && online.length) ? true : false;
											listOnline = { id: coursesList.length+1, title: tipo.nome, courses: online, type: 2, card: 'online', name: 'Online', show: show };
											coursesList.push(listOnline);
										}
									}else listOnline.show = true;

									listSeries = coursesList.find(function (list){ return list.type == 32 });
									if(!listSeries) {
										if(tipo = dataCoursesFilter.find(function(el){ return el.id == 32 })){
											series = filterTypes(courses, 32);
											show = (series && series.length) ? true : false;
											listSeries = { id: coursesList.length+1, title: tipo.nome, courses: series, type: 32, card: 'serie', name: 'Series', show: show };
											coursesList.push(listSeries);
										}
									}else listSeries.show = true;

									listPacks = coursesList.find(function (list){ return list.type == 17 });
									if(!listPacks) {
										if(tipo = dataCoursesFilter.find(function(el){ return el.id == 17 })){
											packages = filterTypes(courses, 17);
											show = (packages && packages.length) ? true : false;
											listPacks = { id: coursesList.length+1, title: tipo.nome, courses: packages, type: 17, card: 'pacotes', name: 'Pacotes', show: show };
											coursesList.push(listPacks);
										}
									}else listPacks.show = true;

									if($location.path() == '/cursos/online/serie')
										list = listSeries;
									else if($location.path() == '/cursos/online/pacote')
										list = listPacks;
									else
										list = listOnline;

								}else if($location.path().indexOf('/cursos/presenciais')>=0){

									if($location.path() == '/cursos/presenciais/individuais'){

										listSingle = coursesList.find(function (list){ return list.type == 12 });
										if(!listSingle) {
											single = filterTypes(courses, 12);
											show = (single && single.length) ? true : false;
											listSingle = { id: coursesList.length+1, title: 'Cursos Presencial - Individual ', courses: single, type: 12, card: 'online', name: 'Individual', show: show };
											coursesList.push(listSingle);
										}else listSingle.show = true;

										listEvents = coursesList.find(function (list){ return list.type == 'eventos' });
										classroom = filterTypes(courses, 10);
										events = classroom.filter(function (course){ return course.eventos && course.eventos.length });
										if(!listEvents && events){
											events.map( function (course){
												course.eventos.map( function (edicao){
													if(edicao.cidade && edicao.cidade.estado) {
														edicao.show = true;
														edicao.timestart = $filter('date')( edicao.data_inicio*1000, 'dd/MM/yy' );
														edicao.timeend   = $filter('date')( edicao.data_fim*1000, 'dd/MM/yy' );
														edicao.cidadeuf  = edicao.cidade.nome + ' - ' +edicao.cidade.estado.uf;
														edicao.uf = edicao.cidade.estado.uf;
													}
												});
											});
											show = (events && events.length) ? true : false;
											listEvents = { id: coursesList.length+1, title: 'Cursos Presencial - Eventos', courses: events, type: 'eventos', card: 'eventos', name: 'Eventos', show: show };
											coursesList.push(listEvents);
										}else if(listEvents) listEvents.show = true;


									}else{

										listEvents = coursesList.find(function (list){ return list.type == 'eventos' });
										classroom = filterTypes(courses, 10);
										events = classroom.filter(function (course){ return course.eventos && course.eventos.length });
										if(!listEvents && events){
											events.map( function (course){
												course.eventos.map( function (edicao){
													if(edicao.cidade && edicao.cidade.estado) {
														edicao.show = true;
														edicao.timestart = $filter('date')( edicao.data_inicio*1000, 'dd/MM/yy' );
														edicao.timeend   = $filter('date')( edicao.data_fim*1000, 'dd/MM/yy' );
														edicao.cidadeuf  = edicao.cidade.nome + ' - ' +edicao.cidade.estado.uf;
														edicao.uf = edicao.cidade.estado.uf;
													}
												});
											});
											show = (events && events.length) ? true : false;
											listEvents = { id: coursesList.length+1, title: 'Cursos Presencial - Eventos', courses: events, type: 'eventos', card: 'eventos', name: 'Eventos', show: show };
											coursesList.push(listEvents);
										}else if(listEvents) listEvents.show = true;

										listSingle = coursesList.find(function (list){ return list.type == 12 });
										if(!listSingle) {
											single = filterTypes(courses, 12);
											show = (single && single.length) ? true : false;
											listSingle = { id: coursesList.length+1, title: 'Cursos Presencial - Individual ', courses: single, type: 12, card: 'online', name: 'Individual', show: show };
											coursesList.push(listSingle);
										}else listSingle.show = true;

									}

									listClass = coursesList.find(function (list){ return list.type == 10 });
									if(!listClass) {
										classroom = classroom.filter(function (course){ return !course.eventos });
										classroom = classroom.filter( function (course){ if(!course.categorias.find(function(tipo){ return tipo.id == 12 })) return true; });
										show = (classroom && classroom.length) ? true : false;
										listClass = { id: coursesList.length+1, title: 'Cursos Presencial', courses: classroom, type: 10, card: 'online', name: 'Presencial', show: show};
										coursesList.push(listClass);
									}else listClass.show = true;


								}else{

									listOnline = coursesList.find(function (list){ return list.type == 2 });
									if(!listOnline) {
										if(tipo = dataCoursesFilter.find(function(el){ return el.id == 2 })){
											online = filterTypes(courses, 2);
											online = online.filter(function (course){ if(!course.categorias.find(function (tipo){ return (tipo.id == 32 || tipo.id == 33 || tipo.id == 17 || tipo.id == 22  || tipo.id == 9 || tipo.id == 8) })) return true; });
											show = (online && online.length) ? true : false;
											listOnline = { id: coursesList.length+1, title: tipo.nome, courses: online, type: 2, card: 'online', name: 'Online', show: show };
											coursesList.push(listOnline);
										}
									}else listOnline.show = true;

									listEvents = coursesList.find(function (list){ return list.type == 'eventos' });
									classroom = filterTypes(courses, 10);
									events = classroom.filter(function (course){ return course.eventos && course.eventos.length });
									if(!listEvents && events){
										events.map( function (course){
											course.eventos.map( function (edicao){
												if(edicao.cidade && edicao.cidade.estado) {
													edicao.show = true;
													edicao.timestart = $filter('date')( edicao.data_inicio*1000, 'dd/MM/yy' );
													edicao.timeend   = $filter('date')( edicao.data_fim*1000, 'dd/MM/yy' );
													edicao.cidadeuf  = edicao.cidade.nome + ' - ' +edicao.cidade.estado.uf;
													edicao.uf = edicao.cidade.estado.uf;
												}
											});
										});
										show = (events.length) ? true : false;
										listEvents = { id: coursesList.length+1, title: 'Cursos Presencial - Eventos', courses: events, type: 'eventos', card: 'eventos', name: 'Eventos', show: show };
										coursesList.push(listEvents);
									}else if(listEvents) listEvents.show = true;

									listSeries = coursesList.find(function (list){ return list.type == 32 });
									if(!listSeries) {
										if(tipo = dataCoursesFilter.find(function(el){ return el.id == 32 })){
											series = filterTypes(courses, 32);
											show = (series && series.length) ? true : false;
											listSeries = { id: coursesList.length+1, title: tipo.nome, courses: series, type: 32, card: 'serie', name: 'Series', show: show };
											coursesList.push(listSeries);
										}
									}else listSeries.show = true;

									listPacks = coursesList.find(function (list){ return list.type == 17 });
									if(!listPacks) {
										if(tipo = dataCoursesFilter.find(function(el){ return el.id == 17 })){
											packages = filterTypes(courses, 17);
											show = (packages && packages.length) ? true : false;
											listPacks = { id: coursesList.length+1, title: tipo.nome, courses: packages, type: 17, card: 'pacotes', name: 'Pacotes', show: show };
											coursesList.push(listPacks);
										}
									}else listPacks.show = true;

									listSingle = coursesList.find(function (list){ return list.type == 12 });
									if(!listSingle) {
										single = filterTypes(courses, 12);
										show = (single && single.length) ? true : false;
										listSingle = { title: 'Cursos Presencial - Individual ', courses: single, type: 12, card: 'online', name: 'Individual', show: show };
										coursesList.push(listSingle);
									}else listSingle.show = true;

									listClass = coursesList.find(function (list){ return list.type == 10 });
									if(!listClass) {
										classroom = classroom.filter(function (course){ return !course.eventos });
										classroom = classroom.filter( function (course){ if(!course.categorias.find(function(tipo){ return tipo.id == 12 })) return true; });
										show = (classroom && classroom.length) ? true : false;
										listClass = { id: coursesList.length+1, title: 'Cursos Presencial', courses: classroom, type: 10, card: 'online', name: 'Presencial', show: show};
										coursesList.push(listClass);
									}else listClass.show = true;
								}

							}

							coursesList.map(function(list, i){
								if(list && list.courses && list.courses.length){
									len = (i == 0 && list.card == 'online') ? 3 : 1;
									while(len--) if(list.courses[len]) list.courses[len].show = true;
								}
							});

							if(($location.path().indexOf('/cursos/presenciais') >= 0) || ($location.path().indexOf('/cursos/online') >= 0 && $location.path() !== '/cursos/online/gratuito') ){
								ordem.map(function(name){
									coursesList.map(function(curso){
										if (name == curso.name)
											auxiliar.push(curso);
									});
								});
								return coursesList = auxiliar;
							}else
								return coursesList;

						},

						getCourseListAll : function(){
							var series, packages, classroom, events, single, online,
								listOnline, listSeries, listPacks, listSingle, listEvents, listClass,
								show, tipo, len, filterTypes = $filter('byTypes'),
								ordem = ['Online','Series','Pacotes','Eventos','Individual','Presencial'], auxiliar = [];
								
							if($location.path().indexOf('/cursos/presenciais')>=0)
								ordem = ['Eventos','Individual','Presencial','Online','Series','Pacotes'];

							if(courses){
								listOnline = coursesList.find(function (list){ return list.type == 2 });
								if(!listOnline) {
									if(tipo = dataCoursesFilter.find(function(el){ return el.id == 2 })){
										online = filterTypes(courses, 2);
										online = online.filter(function (course){ if(!course.categorias.find(function (tipo){ return (tipo.id == 32 || tipo.id == 33 || tipo.id == 17 || tipo.id == 22  || tipo.id == 9 || tipo.id == 8) })) return true; });
										show = (online && online.length) ? true : false;
										listOnline = { id: coursesList.length+1, title: tipo.nome, courses: online, type: 2, card: 'online', name: 'Online', show: show };
										coursesList.push(listOnline);
									}
								}else listOnline.show = true;

								listEvents = coursesList.find(function (list){ return list.type == 'eventos' });
								classroom = filterTypes(courses, 10);
								events = classroom.filter(function (course){ return course.eventos && course.eventos.length });
								if(!listEvents && events){
									events.map( function (course){
										course.eventos.map( function (edicao){
											if(edicao.cidade && edicao.cidade.estado) {
												edicao.show = true;
												edicao.timestart = $filter('date')( edicao.data_inicio*1000, 'dd/MM/yy' );
												edicao.timeend   = $filter('date')( edicao.data_fim*1000, 'dd/MM/yy' );
												edicao.cidadeuf  = edicao.cidade.nome + ' - ' +edicao.cidade.estado.uf;
												edicao.uf = edicao.cidade.estado.uf;
											}
										});
									});
									show = (events.length) ? true : false;
									listEvents = { id: coursesList.length+1, title: 'Cursos Presencial - Eventos', courses: events, type: 'eventos', card: 'eventos', name: 'Eventos', show: show };
									coursesList.push(listEvents);
								}else if(listEvents) listEvents.show = true;

								listSeries = coursesList.find(function (list){ return list.type == 32 });
								if(!listSeries) {
									if(tipo = dataCoursesFilter.find(function(el){ return el.id == 32 })){
										series = filterTypes(courses, 32);
										show = (series && series.length) ? true : false;
										listSeries = { id: coursesList.length+1, title: tipo.nome, courses: series, type: 32, card: 'serie', name: 'Series', show: show };
										coursesList.push(listSeries);
									}
								}else listSeries.show = true;

								listPacks = coursesList.find(function (list){ return list.type == 17 });
								if(!listPacks) {
									if(tipo = dataCoursesFilter.find(function(el){ return el.id == 17 })){
										packages = filterTypes(courses, 17);
										show = (packages && packages.length) ? true : false;
										listPacks = { id: coursesList.length+1, title: tipo.nome, courses: packages, type: 17, card: 'pacotes', name: 'Pacotes', show: show };
										coursesList.push(listPacks);
									}
								}else listPacks.show = true;

								listSingle = coursesList.find(function (list){ return list.type == 12 });
								if(!listSingle) {
									single = filterTypes(courses, 12);
									show = (single && single.length) ? true : false;
									listSingle = { title: 'Cursos Presencial - Individual ', courses: single, type: 12, card: 'online', name: 'Individual', show: show };
									coursesList.push(listSingle);
								}else listSingle.show = true;

								listClass = coursesList.find(function (list){ return list.type == 10 });
								if(!listClass) {
									classroom = classroom.filter(function (course){ return !course.eventos });
									classroom = classroom.filter( function (course){ if(!course.categorias.find(function(tipo){ return tipo.id == 12 })) return true; });
									show = (classroom && classroom.length) ? true : false;
									listClass = { id: coursesList.length+1, title: 'Cursos Presencial', courses: classroom, type: 10, card: 'online', name: 'Presencial', show: show};
									coursesList.push(listClass);
								}else listClass.show = true;

								coursesList.map(function(list){
									list.show = true;
									list.courses.map(function(curso){ curso.show = true });
									auxiliar[ordem.indexOf(list.name)] = list;
								});
								
								return auxiliar;
							}
						},

							getFilterData : function () {

										var deferred = $q.defer(), promise,
											filterZpad = $filter('zpad');

										var setData = function (filtro){ 
											var filter;
											if( filtro && Array.isArray(filtro.inputs) && filtro.inputs.length){
												filtro.inputs.map (function (el, i){ 
													el.qtds = 0;
													if(filtro.type == 'checkbox' && !el.name) { el.name = filtro.name+i; }
													filter  = dataCoursesFilter.find(function (value){ return el.type == value.id })
													if(filter) el.qtds += parseInt(filter.produtos);
													if(el.presencial){
														filter = dataCoursesFilter.find(function (value){ return el.presencial == value.id })
														if(filter) el.qtds += parseInt(filter.produtos);
													}
													if(el.pacotes){
														filter = dataCoursesFilter.find(function (value){ return el.pacotes == value.id })
														if(filter) el.qtds += parseInt(filter.produtos);
													}
													el.qtds = filterZpad(el.qtds);
												});
											}
										};


										if( Array.isArray(dataCoursesFilter) && dataCoursesFilter.length ){
											deferred.resolve( dataCoursesFilter );
											return deferred.promise;
										}else{

											promise = $http({ 
															cache: true, 
															method: 'GET', 
															url: Config.baseUrl+'/produto/wsc-produto/produtos-tipos-id'
														});

											return promise.then( function (response){
														if(response && response.status == 200 && response.data && response.data.retorno){
															dataCoursesFilter = response.data.retorno;

															if( Array.isArray(dataCoursesFilter) && dataCoursesFilter.length){
																Config.filters.online.map(setData);
																Config.filters.presencial.map(setData);
																deferred.resolve( dataCoursesFilter );
															}else 
																deferred.reject([]);
														} else 
															deferred.reject([]);

														return deferred.promise;
													}, function (response) {
														deferred.reject( response );
														return deferred.promise;
													});

										}
							},

							identidadeVisual : function (email) {
										var promise = $http({ 
															method: 'GET', 
															loading : true,
															url: Config.baseUrl+'/identidade-visual/'+email
														});

										promise.then( handleSuccess, handleError );

										return promise;
							},

							newsletter : function (email) {
										var promise = $http({ 
															method: 'GET', 
															loading : true,
															url: Config.baseUrl+'/newsletter/'+email
														});

										promise.then( handleSuccess, handleError );

										return promise;
							},

							remember : function (data) {
									var promise = $http({ 
															method: 'POST', 
															loading : true,
															url: Config.baseUrl+'/wsc-user/lembrete-senha',
															data: data
														});

											promise.then( handleSuccess, handleError );

									return promise;
							},

							getConvenios : function () {
								var promise = $http({ 
															cache: true, 
															method: 'GET',
															url: Config.baseUrl+'/convenio/wsc-convenio/instituicoes-conveniadas'
														});

											promise.then( handleSuccess, handleError );

										return promise;

							},

						/*
						 * Função reponsável por inserir convênios
						 * Deve ser feito requisições do tipo POST, informando os seguintes parâmetros no formato JSON:
						 * {
						 *  ecm_convenio_tipo_instituicao_id: 1,
						 *  mdl_cidade_id: 11139,
						 *  nome_responsavel: (nome_responsavel),
						 *  nome_coordenador: (nome_coordenador),
						 *  nome_instituicao: (nome_instituicao),
						 *  curso: (curso),
						 *  disciplina: (disciplina),
						 *  cargo: (cargo),
						 *  email: (email),
						 *  telefone: (telefone)
						 * }
						 *
						 * Retornos:
						 * 1- {'sucesso':true}
						 * 2- {'sucesso':false, 'mensagem': 'Este Web Service não aceita esse tipo de requisição'}
						 * 5- {'sucesso':false, 'mensagem': 'Erro ao salvar repasse'}
						 * 6- {'sucesso':false, 'mensagem': 'Não foi possível inserir o convênio'}
						 * */
							addInstitution : function (data) {
								var promise = $http({
									method: 'POST',
									loading : true,
									url: Config.baseUrl+'/convenio/wsc-convenio/inserir',
									data: data
								});

								promise.then( handleSuccess, handleError );

								return promise;

							},
						/*
						 * Função reponsável por adicionar um interesse de um cliente em um convenio
						 * Deve ser feito requisições do tipo POST:
						 * http://{host}/convenio/wsc-convenio/add-interesse
						 *
						 * Retornos:
						 * 1- {'sucesso':true, 'mensagem': 'Interesse registrado com sucesso'}
						 * 2- {'sucesso':false, 'mensagem': 'O Interesse não pode ser registrado'}
						 * 3- {'sucesso':false, 'mensagem': 'Informe os parâmetros do Interesse'}
						 * 4- {'sucesso':false, 'mensagem': 'Informe o parâmetro Nome'}
						 * 5- {'sucesso':false, 'mensagem': 'Informe o parâmetro Telefone'}
						 * 6- {'sucesso':false, 'mensagem': 'Informe o parâmetro Email'}
						 * 7- {'sucesso':false, 'mensagem': 'Informe o id do convênio'}
						 * */
							addInteresse : function (data) {
								var promise = $http({
									method: 'POST',
									loading : true,
									url: Config.baseUrl+'/convenio/wsc-convenio/add-interesse',
									data: data
								});

								promise.then( handleSuccess, handleError );
								return promise;
							},
							/*
							 * Função responsável por listar todos os cursos e todos os descontos dos convenios
							 * Deve ser feito requisições do tipo GET, sem parâmetros:
							 * http://{host}/convenio/wsc-convenio/desconto-convenio
							 *
							 * Retornos:
							 * 1- {'sucesso': true, 'ecmProduto': lista de produtos dividida por tipo com valores e descontos}
							 *
							 * */
							descontoConvenio : function () {
								var promise = $http({
									method: 'GET',
									url: Config.baseUrl+'/convenio/wsc-convenio/desconto-convenio'
								});

								return promise.then( function(res){
									if((res && res.status == 200 && res.data)&&(res.data.retorno))
										return res.data.retorno;
									return false;
								}, function(res){ return res });
							}

						};

				return sdo;
				
			  	// private functions
				function handleSuccess(res) {
				    return res.data.retorno;
				}

				function handleError(error) {
				    return function () {
				        return { success: false, error: error };
				    };
				}
			}]);
}());
