(function() {
    'use strict';

	var setNavFilters, startCourseList;

	angular
		.module('QiSatApp')
		.config( function ($locationProvider) {
	               $locationProvider.html5Mode({
                                              enabled: true, 
                                              requireBase: false,
                                              rewriteLinks: 'internal'
                                            });
	     })
		.controller("CoursesController",
			[ '$scope', '$controller', '$filter', '$location', 'QiSatAPI', 'Config', 'getWatchCount', 'authService', function($scope, $controller, $filter, $location, QiSatAPI, Config, getWatchCount, authService ){

						var filterTypes = $filter('byTypes'),
							filterZpad = $filter('zpad'),
							filterLimitName = $filter('limitName');
							$scope.filters = [];
							$scope.navLinks = [];
							$scope.navFilters = [];
							$scope.coursesList = [];
							$scope.states = "Selecione o Estado";
							$scope.loading = true;
						var modalController = $controller('modalController');

						var Authenticated = false;
						(function(){
	                    		authService.isAuth() || 
	                            authService.verifyAuth()
	                                       .then( function (res){ 
                                                   Authenticated = (res) ? true : false; 
                                                });
	                  	}());							

						var setDataFilters = (function(){ 
							var inputStates;

							// Buscar Estados no WebService 
							inputStates = Config.filters.presencial.find(function (el){ return el.name == 'estado' })
							if(inputStates){
								QiSatAPI.getCourseStates()
										.then( function ( response ){
											var data = [];
											if(response.status == 200 && response.data) data = response.data.retorno;
											data.map(function (el){
													var id = el.estado.toLowerCase();
							     						id = '#'+id.split(' ').map(function(e){ return e.charAt(0).toUpperCase() + e.slice(1); }).join('_');	
													el.id = id;
													inputStates.inputs.push(el);
											});
										});
							}

							// Buscar Quantidade de curso no Filtro
							QiSatAPI.getFilterData()
									.then( function ( response ){
											var data = [], filter;
											var setData = function (filtro){ 
															filtro.inputs.map (function (el, i){ 
																el.qtds = 0;
																if(filtro.type == 'checkbox' && !el.name) { el.name = filtro.name+i; }
																filter  = data.find(function (value){ return el.type == value.id })
																if(filter) el.qtds += parseInt(filter.produtos);
																if(el.presencial){
																	filter = data.find(function (value){ return el.presencial == value.id })
																	if(filter) el.qtds += parseInt(filter.produtos);
																}
																if(el.pacotes){
																	filter = data.find(function (value){ return el.pacotes == value.id })
																	if(filter) el.qtds += parseInt(filter.produtos);
																}
																el.qtds = filterZpad(el.qtds);
															});
														};
											if(response.status == 200) data = response.data.retorno;
											Config.filters.presencial.map(setData);
											Config.filters.online.map(setData);
											$scope.tipos = data;
									});
						}());

						var startWatchCount = function () { 
			                $scope.watchCount = 0;
			                $scope.bookmarklet = getWatchCount.bookmarklet;
			                $scope.$watch(
			                    function watchCountExpression() {
			                        return( getWatchCount() );
			                    },
			                    function handleWatchCountChange( newValue ) {
			                        $scope.watchCount = newValue;
			                    }
			                );
						};

						var resetFilterEvents = function(){
								var filter, coursesList = $scope.coursesList.filter(function (el) { return el.type == 'eventos' || el.parent == 'eventos' });
									coursesList.map(function (list) {
										list.courses.map( function (course) {
											course.show = true;
											filter = course.eventos.filter( function (edicao) { return !edicao.show });
											filter.map( function (edicao) { edicao.show = true });
										});
									});
						};

						setNavFilters = function(){ 
							var elemts, elem, presencial = false;
								elemts = angular.element('.menu-filter-sidebar-item--link');
								if(elemts) elemts.removeClass('active');

								$scope.path = $location.path().toLowerCase();
								if($scope.path[$scope.path.length-1] == "/") $scope.path = $scope.path.substring($scope.path.length-1,0);

								$scope.filters = [];
								$scope.navLinks = [{title:"Todos os cursos", href : "/cursos"}];
								switch ($scope.path) {
								  case "/cursos/online":
								  case "/cursos/online/serie":
								  case "/cursos/online/pacote":
								  case "/cursos/online/teorico":
								  case "/cursos/online/software":
								  case "/cursos/online/estrutural":
								  case "/cursos/online/eletrica":
								  case "/cursos/online/hidraulica":
								  case "/cursos/online/arquitetonica":
								  case "/cursos/online/agronomica":
								  		$scope.filters = Config.filters.online;
								  		$scope.navLinks.push({title:"Online"});
								    break;
								  case "/cursos/presenciais":
								  case "/cursos/presenciais/individuais":
								  case "/cursos/presenciais/teorico":
								  case "/cursos/presenciais/software":
								  case "/cursos/presenciais/estrutural":
								  case "/cursos/presenciais/eletrica":
								  case "/cursos/presenciais/hidraulica":
								  	  	$scope.filters = Config.filters.presencial;
								  	  	$scope.navLinks.push({title:"Presenciais" });
								  	  	presencial = true;
								    break;
								  case "/cursos/lancamentos":
								  	  	$scope.navLinks.push({title:"Lançamentos" });
								    break;
								  case "/cursos/online/gratuito":
								  	  	$scope.navLinks.push({title:"Gratutitos" });
								    break;
							  	  default:
								  	  break;
								}

								elemts.map( function (el){ var elm = angular.element(elemts[el]); if( elm.attr('href') == $scope.path ) elem = elm });
								if(!elem) elemts.map( function (el){ var elm = angular.element(elemts[el]); if( elm.attr('href') == "/cursos" ) elem = elm });
								elem.addClass('active');
								$scope.presencial = presencial;
						};

						startCourseList = function(uncheck){
								var  series, packages, classroom, events, single, releases, free, online, 
									 list, listOnline, listSeries, listPacks, listSingle, listEvents, listClass, 
									 filter, elemts, elem, inputs, selected, show, tipo, len;

								// ALTERAR ELEMENTOS DOM
								if(uncheck){
									elemts = angular.element('.filter-checkbox:checked');
									elemts.map( function (el) { elemts[el].checked = false });

									elemts = angular.element('#selectStates option');
									selected = null;
									elemts.map(function (el){ if (el && (elemts[el]) && elemts[el].selected ) selected = el; });
									if(selected){
										angular.element(elemts[selected]).prop('selected', false);
										angular.element(elemts[0]).prop('selected', true);
										resetFilterEvents();
									}
								}

								function setFilterTipo(tipoName, tipoId, tipoSelector){
									var elemts = $scope.filters.find(function(el){ return el.name == tipoName }),
										elem = angular.element(tipoSelector), inputs;

										if(elemts && elemts.inputs && elemts.inputs.length)
											inputs = elemts.inputs.find(function(el){ return el.type == tipoId });
										
										elem.prop('checked', true);

										if(tipoName == 'Tipo')
											$scope.filterTypes(elem, inputs);
										else if(tipoName == 'Combinacoes' )
											$scope.filterTypesProduts(elem, inputs);
										else if(tipoName == 'Area')
											$scope.addListFilter(elem, inputs, elemts);
								};

								if($scope.courses && $scope.courses.length > 0){

									filter = $scope.coursesList.filter(function (list){ return list.show || list.selected });
									filter.map( function (list){ list.show = false; list.selected = false; });

									if($scope.path == '/cursos/lancamentos'){
										list = $scope.coursesList.find(function (list){ return list.type == 39 });
										if(!list) {
											tipo = $scope.tipos.find(function(el){ return el.id == 39 });
											releases = filterTypes($scope.courses, 39);
											show = (releases && releases.length) ? true : false;
											list = { title: tipo.nome, courses: releases, type: 39, card: 'online', show: show };
											$scope.coursesList.push(list);
										}else list.show = true;
									}else if($scope.path == '/cursos/online/gratuito') { 
										list = $scope.coursesList.find(function (list){ return list.type == 8 });
										if(!list) {
											tipo = $scope.tipos.find(function(el){ return el.id == 8 });
											free = filterTypes($scope.courses, 8);
											show = (free && free.length) ? true : false;
											list = { title: tipo.nome, courses: free, type: 8, card: 'online', show: show };
											$scope.coursesList.push(list);
										}else list.show = true;
									}else if($scope.path.indexOf('/cursos/online')>=0){ 
										listOnline = $scope.coursesList.find(function (list){ return list.type == 2 });
										if(!listOnline) {
											tipo = $scope.tipos.find(function(el){ return el.id == 2 });
											online = filterTypes($scope.courses, 2);
											online = online.filter(function (course){ if(!course.categorias.find(function (tipo){ return (tipo.id == 32 || tipo.id == 33 || tipo.id == 17 || tipo.id == 22  || tipo.id == 9) })) return true; });
											show = (online && online.length) ? true : false;
											listOnline = { title: tipo.nome, courses: online, type: 2, card: 'online', name: 'Online', show: show };
											$scope.coursesList.push(listOnline);
										}else listOnline.show = true;

										listSeries = $scope.coursesList.find(function (list){ return list.type == 32 });
										if(!listSeries) {
											tipo = $scope.tipos.find(function(el){ return el.id == 32 });
											series = filterTypes($scope.courses, 32);
											show = (series && series.length) ? true : false;
											listSeries = { title: tipo.nome, courses: series, type: 32, card: 'serie', name: 'Series', show: show };
											$scope.coursesList.push(listSeries);
										}else listSeries.show = true;

										listPacks = $scope.coursesList.find(function (list){ return list.type == 17 });
										if(!listPacks) {
											tipo = $scope.tipos.find(function(el){ return el.id == 17 });
											packages = filterTypes($scope.courses, 17);
											show = (packages && packages.length) ? true : false;
											listPacks = { title: tipo.nome, courses: packages, type: 17, card: 'pacotes', name: 'Pacotes', show: show };
											$scope.coursesList.push(listPacks);
										}else listPacks.show = true;

										if($scope.path == '/cursos/online/serie')
											list = listSeries;
										else if($scope.path == '/cursos/online/pacote')
											list = listPacks;
										else
											list = listOnline;

									}else if($scope.path.indexOf('/cursos/presenciais')>=0){ 

										if($scope.path == '/cursos/presenciais/individuais'){

											listSingle = $scope.coursesList.find(function (list){ return list.type == 12 });
											if(!listSingle) {
												single = filterTypes($scope.courses, 12);
												show = (single && single.length) ? true : false;
												listSingle = { title: 'Cursos Presencial - Individual ', courses: single, type: 12, card: 'online', name: 'Individual', show: show };
												$scope.coursesList.push(listSingle);
											}else listSingle.show = true;

											listEvents = $scope.coursesList.find(function (list){ return list.type == 'eventos' });
											classroom = filterTypes($scope.courses, 10);
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
												listEvents = { title: 'Cursos Presencial - Eventos', courses: events, type: 'eventos', card: 'eventos', name: 'Eventos', show: show };
												$scope.coursesList.push(listEvents);
											}else if(listEvents) listEvents.show = true;


										}else{

											listEvents = $scope.coursesList.find(function (list){ return list.type == 'eventos' });
											classroom = filterTypes($scope.courses, 10);
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
												listEvents = { title: 'Cursos Presencial - Eventos', courses: events, type: 'eventos', card: 'eventos', name: 'Eventos', show: show };
												$scope.coursesList.push(listEvents);
											}else if(listEvents) listEvents.show = true;

											listSingle = $scope.coursesList.find(function (list){ return list.type == 12 });
											if(!listSingle) {
												single = filterTypes($scope.courses, 12);
												show = (single && single.length) ? true : false;
												listSingle = { title: 'Cursos Presencial - Individual ', courses: single, type: 12, card: 'online', name: 'Individual', show: show };
												$scope.coursesList.push(listSingle);
											}else listSingle.show = true;

										}

										listClass = $scope.coursesList.find(function (list){ return list.type == 10 });
										if(!listClass) {
											classroom = classroom.filter(function (course){ return !course.eventos });
											classroom = classroom.filter( function (course){ if(!course.categorias.find(function(tipo){ return tipo.id == 12 })) return true; });
											show = (classroom && classroom.length) ? true : false;
											listClass = { title: 'Cursos Presencial', courses: classroom, type: 10, card: 'online', name: 'Presencial', show: show}; 
											$scope.coursesList.push(listClass);
										}else listClass.show = true;


									}else{

										listOnline = $scope.coursesList.find(function (list){ return list.type == 2 });
										if(!listOnline) {
											tipo = $scope.tipos.find(function(el){ return el.id == 2 });
											online = filterTypes($scope.courses, 2);
											online = online.filter(function (course){ if(!course.categorias.find(function (tipo){ return (tipo.id == 32 || tipo.id == 33 || tipo.id == 17 || tipo.id == 22  || tipo.id == 9) })) return true; });
											show = (online && online.length) ? true : false;
											listOnline = { title: tipo.nome, courses: online, type: 2, card: 'online', name: 'Online', show: show };
											$scope.coursesList.push(listOnline);
										}else listOnline.show = true;

										listEvents = $scope.coursesList.find(function (list){ return list.type == 'eventos' });
										classroom = filterTypes($scope.courses, 10);
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
											listEvents = { title: 'Cursos Presencial - Eventos', courses: events, type: 'eventos', card: 'eventos', name: 'Eventos', show: show };
											$scope.coursesList.push(listEvents);
										}else if(listEvents) listEvents.show = true;

										listSeries = $scope.coursesList.find(function (list){ return list.type == 32 });
										if(!listSeries) {
											tipo = $scope.tipos.find(function(el){ return el.id == 32 });
											series = filterTypes($scope.courses, 32);
											show = (series && series.length) ? true : false;
											listSeries = { title: tipo.nome, courses: series, type: 32, show: false, card: 'serie', name: 'Series', show: show };
											$scope.coursesList.push(listSeries);
										}else listSeries.show = true;

										listPacks = $scope.coursesList.find(function (list){ return list.type == 17 });
										if(!listPacks) {
											tipo = $scope.tipos.find(function(el){ return el.id == 17 });
											packages = filterTypes($scope.courses, 17);
											show = (packages && packages.length) ? true : false;
											listPacks = { title: tipo.nome, courses: packages, type: 17, show: false, card: 'pacotes', name: 'Pacotes', show: show };
											$scope.coursesList.push(listPacks);
										}else listPacks.show = true;

										listSingle = $scope.coursesList.find(function (list){ return list.type == 12 });
										if(!listSingle) {
											single = filterTypes($scope.courses, 12);
											show = (single && single.length) ? true : false;
											listSingle = { title: 'Cursos Presencial - Individual ', courses: single, type: 12, card: 'online', name: 'Individual', show: show };
											$scope.coursesList.push(listSingle);
										}else listSingle.show = true;

										listClass = $scope.coursesList.find(function (list){ return list.type == 10 });
										if(!listClass) {
											classroom = classroom.filter(function (course){ return !course.eventos });
											classroom = classroom.filter( function (course){ if(!course.categorias.find(function(tipo){ return tipo.id == 12 })) return true; });
											show = (classroom && classroom.length) ? true : false;
											listClass = { title: 'Cursos Presencial', courses: classroom, type: 10, card: 'online', name: 'Presencial', show: show}; 
											$scope.coursesList.push(listClass);
										}else listClass.show = true;
									}

									if($scope.coursesList.length){
										$scope.coursesList.map(function(list, i){
											if(list && list.courses && list.courses.length){
												len = (i == 0 && list.card == 'online') ? 3 : 1;
												while(len--) if(list.courses[len]) list.courses[len].show = true;
											}
										});
									}
									
									switch($scope.path){
											case '/cursos/online/serie':
												setFilterTipo('Combinacoes', 32, '#series');
												break;
											case '/cursos/online/pacote':
												setFilterTipo('Combinacoes', 17, '#pacotes');
												break;
											case '/cursos/online/teorico':
												setFilterTipo('Tipo', 24, '#Tipo0');
												break;
											case '/cursos/online/software':
												setFilterTipo('Tipo', 23, '#Tipo1');
												break;
											case "/cursos/online/estrutural":
												setFilterTipo('Area', 3, '#estrutural');
												break;
											case "/cursos/online/eletrica" :
												setFilterTipo('Area', 4, '#eletrica');
												break;
											case "/cursos/online/hidraulica":
												setFilterTipo('Area', 6, '#hidraulica');
												break;
											case "/cursos/online/agronomica":
												setFilterTipo('Area', 34, '#agronomica');
												break;
											case "/cursos/online/arquitetonica" :
												setFilterTipo('Area', 35, '#arquitetonica');
												break;
											case '/cursos/presenciais/teorico':
												setFilterTipo('Tipo', 13, '#Tipo0');
												break;
											case '/cursos/presenciais/software':
												setFilterTipo('Tipo', 11, '#Tipo1');
												break;
											case "/cursos/presenciais/estrutural":
												setFilterTipo('Area', 25, '#estrutural');
												break;
											case "/cursos/presenciais/eletrica":
												setFilterTipo('Area', 26, '#eletrica');
												break;
											case "/cursos/presenciais/hidraulica":
												setFilterTipo('Area', 27, '#hidraulica');
												break;
									}
								}
								// console.log($scope.coursesList);
						};

						$scope.inscricao = function(){
					 		if(!Authenticated)
					 			modalController.login('/aluno/cursos', '/cadastro');
					 		else
					 			window.location = '/aluno/cursos';
					 	};

						$scope.loadMore = function (list) {
							var filter, pos = 0, len;
							if(list && list.courses && list.courses.length){
							 	filter = list.courses.filter(function(el){ return el.show; });
							 	if(filter && filter.length)
								 	pos = list.courses.findIndex(function(el){ return el.id == filter[filter.length-1].id; });
							 	
							 	len = pos+3;
							 	if(len >= list.courses.length)
							 		list.noscroll = true;

								for( ; pos <= len; pos++)
									if(list.courses[pos]) list.courses[pos].show = true;

							}
						};

						$scope.filterTypes = function ( $event, item ) {
							var checkbox = $event.target||$event[0];
							var selected, filter, elemts;
							var otherItem;
								
							selected = $scope.coursesList.find( function (el){ return el.type == item.type });
							if(checkbox.checked) {
								if(item.type == 12){
									selected.selected = true;
 									selected.show = true;
 									filter = $scope.coursesList.filter( function (el){ 
										return (((el.type == 2 || el.type == 10 || el.parent == 2 || el.type == 32 || el.parent == 32 || el.type == 17 || el.parent == 17  || el.parent == 10 || el.type == 'eventos' || el.parent == 'eventos' ) && el.show ) || ((el.type == 2 || el.type == 10 || el.parent == 2 || el.type == 32 || el.parent == 32 || el.type == 17 || el.parent == 17  || el.parent == 10 || el.type == 'eventos' || el.parent == 'eventos' ) && el.selected ));
									});
									filter.map(function(el){ el.show = false; el.selected = false; });

									// REGRAS DE COMPORTAMENTE ELEMENTOS DA PÁGINA 
									elemts = angular.element('.filter-types-produts:checked, .filter-area:checked, #Tipo0, #Tipo1');
									elemts.map( function (el) { elemts[el].checked = false });

									elemts = angular.element('#selectStates option');
									selected = null;
									elemts.map(function(el){ if (el && (elemts[el]) && elemts[el].selected ) selected = el; });

									if(selected){
										angular.element(elemts[selected]).prop('selected', false);
										angular.element(elemts[0]).prop('selected', true);
										resetFilterEvents();
									}
									$scope.navLinks.push({title:"Individuais" });
									if($scope.navFilters.length) $scope.navFilters = [];

								}else{
									otherItem = $scope.coursesList.find( function (el){ return el.type == 12 });
									if(otherItem && otherItem.selected){
										otherItem.selected = false;
 										otherItem.show = false;

 										elemts = angular.element('#Tipo2');
										elemts.map( function (el) { elemts[el].checked = false });
										startCourseList();
									}

									if(item.type == 23){
										otherItem = 24;
									 	selected = angular.element('#Tipo0')[0];
									}else{
										otherItem = 23;
									 	selected = angular.element('#Tipo1')[0];
									}

  									filter = $scope.coursesList.filter( function (el){ 
										return (((el.type == 2 || el.type == 10 || el.type == 32 || el.type == 17 || el.type == 'eventos' ) && el.show ) || ((el.parent == 2 || el.parent == 32 || el.parent == 17  || el.parent == 10 || el.parent == 'eventos' ) && el.selected ))
									});

									filter.map(function (list){ 
										var courses, type, outherType;

										if(item.presencial && (list.type == 10 || list.type == 12 || list.type == 'eventos')){
											type = item.presencial;	
											outherType = item.presencial;
										}else{
											type = item.type;
											outherType = otherItem;
										}

										if(!selected.checked)
											courses = list.courses.filter(function (course){
													return course.categorias.find(function(tipo){ return tipo.id == type })
											    });
										else
											courses = list.courses.filter(function (course){
													return course.categorias.find(function(tipo){ return tipo.id == type || tipo.id == outherType })
											    });

										list.courses.map( function (course){
											if(!courses.find( function (el){ return course.id == el.id }))
												course.show = false;
											else
												course.show = true;
										});
									 });
								}
							}else{

								if(item.type == 12){
									selected.selected = false;
 									selected.show = false;
									startCourseList();
									$scope.navLinks.splice($scope.navLinks.findIndex(function(el){return el.title == 'Individuais'}), 1);
								}else{
									if(item.type == 23){
										otherItem = 24;
									 	selected = angular.element('#Tipo0')[0];
									}else{
										otherItem = 23;
									 	selected = angular.element('#Tipo1')[0];
									}

									filter = $scope.coursesList.filter( function (el){ 
											return(((el.type == 2 || el.type == 10 || el.type == 32 || el.type == 17 || el.type == 'eventos' ) && el.show )||((el.parent == 2 || el.parent == 32 || el.parent == 17  || el.parent == 10 || el.parent == 'eventos' ) && el.selected ))
										});

									if(!selected.checked){
										filter.map(function (list){ 
											list.courses.map( function (course){ course.show = true });
										 });
									}else{

										filter.map(function (list){ 
											var coursesUnselected, coursesSelected, type, outherType;

											if(item.presencial && (list.type == 10 || list.type == 12 || list.type == 'eventos')){
												type = item.presencial;	
												outherType = (item.presencial == 11) ? 13 : 11;
											}else{
												type = item.type;
												outherType = otherItem;
											}

											coursesUnselected = list.courses.filter( function (course){
													return course.categorias.find( function (tipo){ return tipo.id == type })
											    });

											coursesSelected = list.courses.filter( function (course){
													return course.categorias.find( function (tipo){ return tipo.id == outherType })
											    });

											list.courses.map( function (course){
												if(!coursesSelected.find( function (el){ return course.id == el.id }) && coursesUnselected.find( function (el){ return course.id == el.id }))
													course.show = false;
											});
										});
									}
								}
							}
						};

						$scope.filterStates = function ( item ) {
							
								var coursesList, filter, selected, elemts;
									selected = $scope.coursesList.find(function (el) { return el.type == 'eventos' });

								if(item && item.uf){
									if(selected.selected) resetFilterEvents();
									else selected.selected = true;

									coursesList = $scope.coursesList.filter(function (el) { return ( el.type == 'eventos' || el.parent == 'eventos' ) });
									coursesList.map(function (list) {
											list.courses.map(function (course) {
												var filter = course.eventos.filter( function (edicao) { return edicao.uf != item.uf });
												if(filter.length == course.eventos.length)
													course.show = false;
												else
													filter.map( function (edicao) { edicao.show = false });
											});
										});
									filter = $scope.coursesList.filter(function (el) { return el.parent && el.selected });
									if(filter.length)
										filter.map(function (list) { list.show = true });
									else{
										filter = $scope.coursesList.find(function (el) { return  el.type == 'eventos' });
										if(!filter.show) filter.show = true;
									}

									coursesList = $scope.coursesList.filter(function (el) { return ( (!el.parent && el.show && (el.type != 'eventos')) || (el.parent && el.show && (el.parent != 'eventos')) ) });
									coursesList.map(function (el) { el.show = false });

									filter = $scope.coursesList.filter( function (el){ return (el.type == 12 ||  el.type == 32 || el.type == 17 || el.parent == 12 ||  el.parent == 32 || el.parent == 17 ) && el.selected });
									filter.map( function (el) { el.selected = false });

									elemts = angular.element('.filter-types-produts:checked, #Tipo2');
									elemts.map( function (el) { elemts[el].checked = false });


									elemts = angular.element('.map__state.active');
									if(elemts) elemts.removeClass('active');
									elemts = angular.element(item.id);
									selected = elemts.find('.map__state');
									selected.addClass('active');

									$scope.states = item.name;

								}else{
									$scope.states = "Selecione o Estado";

									selected.selected = false;
									resetFilterEvents();

									elemts = angular.element('#selectStates option');
									elemts.map(function (el){ if (el && (elemts[el]) && elemts[el].selected ) angular.element(elemts[selected]).prop('selected', false); });


									filter = $scope.coursesList.filter( function (el){ return ( el.parent == 10 || el.parent == 12 || el.parent == 'eventos' ) && el.selected });	
									if(!filter.length)
										filter = $scope.coursesList.filter( function (el){ return ( el.type == 10 || el.type == 12 || el.type == 'eventos' ) && !el.show });
									filter.map(function(el){ if(el.courses.length) el.show = true });

									elemts = angular.element('.map__state.active');
									elemts.removeClass('active');
								}
						};


						// INTEGRAÇÃO MAP E SELECT
						$scope.mapFilterStates = function($event){
							var id = '#'+angular.element($event.target).parent().attr('id');
							var inputStates = Config.filters.presencial.find(function (el){ return el.name == 'estado' });
							var item = inputStates.inputs.find(function (el) {return el.id == id });
							var elemts, selected = null;
							if(item){
									
								elemts = angular.element('#selectStates option');
								elemts.map(function (el){ if (el && (elemts[el]) && elemts[el].value == item.uf ) selected = el; });

								if(selected){
									angular.element(elemts[selected]).prop('selected', true);
									angular.element(elemts[0]).prop('selected', false);
								}

								$scope.filterStates(item);

							}else $scope.states = "Nenhum Curso Presencial no Estado Selecionado";
						}

						$scope.filterTypesProduts = function ( $event, item ) {
							var checkbox = $event.target||$event[0];
							var otherType = (item.type == 32) ? 17 : 32;
							var selected, otherSelected, filter, elemts;

							if(checkbox.checked) {

								selected = $scope.coursesList.find( function (el){ return el.type == item.type });
								selected.selected = true;
								filter = $scope.coursesList.filter( function (el){ return (( el.parent == item.type ) && el.selected) });
								if(!filter.length) selected.show = true;
								else filter.map(function (el){ if(el.courses.length && !el.show ) el.show = true });

								filter = $scope.coursesList.filter( function (el){ 
									return ((el.type == 2 || el.type == 10 || el.parent == 2 || el.parent == 10 || el.type == 'eventos' || el.parent == 'eventos' || el.type == 12 || el.parent == 12 ) && el.show );
								});
								filter.map(function(el){ el.show = false });

								otherSelected = $scope.coursesList.find( function (el){ return el.type == otherType && el.selected });
								if(!otherSelected){
									filter = $scope.coursesList.filter( function (el){ return ((el.type == otherType || el.parent == otherType ) && el.show )});
									filter.map(function(el){ el.show = false });
								}

								// ALTERAR ELEMENTOS DOM
								elemts = angular.element('#selectStates option');
								selected = null;
								elemts.map(function (el){ if (el && (elemts[el]) && elemts[el].selected ) selected = el; });

								if(selected){
									angular.element(elemts[selected]).prop('selected', false);
									angular.element(elemts[0]).prop('selected', true);
									// elemts[selected].selected = false; 
									// elemts[0].selected = true;
									resetFilterEvents();
								}

							}else{

								selected = $scope.coursesList.find( function (el){ return  el.type == item.type });
								selected.selected = false;
								selected.show = false;

								filter = $scope.coursesList.filter( function (el){ return (el.parent == item.type) && el.selected });
								otherSelected = $scope.coursesList.find( function (el){ return el.type == otherType && el.selected });

								if(!filter.length && !otherSelected){
									filter = $scope.coursesList.filter(function (el){ return (el.type == 2 || el.type == 10 || el.type == 12 || el.type == 17 || el.type == 32 || el.type == 'eventos' )});
								}else if(filter.length && !otherSelected){
									filter = $scope.coursesList.filter(function (el){
										return ((el.parent == 2 || el.parent == 10 || el.parent == 12 || el.parent == 17 || el.parent == 32 || el.parent == 'eventos' ) && el.selected)
									});
								}else if(filter.length && otherSelected){
									filter.map( function (el){ if(el.courses.length) el.show = false });
									filter = $scope.coursesList.filter(function (el){
										return ((el.parent == otherSelected.type  ) && el.selected)
									});
								}
								filter.map( function (el){ if(el.courses.length) el.show = true });
							}
							// console.log($scope.coursesList);
						};

						$scope.addListFilter = function ( $event, item, parent ) {
							var checkbox = $event.target||$event[0];
							var index, newList, filter, courses, selected, show, card;

							var addNavFilter = function(name){
								var navLink, navParent;
								navParent = $scope.navFilters.find(function (el){ return parent.name == el.name });
								if(navParent){
									navLink = navParent.inputs.find(function (el){ return el.name == name });
									if(navLink)
										navLink.selected = true;
									else
										navParent.inputs.push({selected : true, name: name, hash : '#'+name, type: item.type });
									
									navParent.selected++;
								}else{
									navParent = { selected : 1, inputs : [{selected : true, name: name, hash : '#'+name, type: item.type }], name : parent.name, title : parent.title, type: item.type };
									$scope.navFilters.push(navParent);
								}
							};

							if(checkbox.checked) {

								selected = $scope.coursesList.filter( function (el){ return (el.type == 17 || el.type == 32 || el.type == 'eventos' ) && el.selected });
								filter = $scope.coursesList.filter(function(el){ return el.type == item.type });
								if(filter.length){
									
									filter.map(function (el){ 
												show = ( el.courses.length && (!(selected.length) || (selected.length && selected.find(function(i){ return i.type == el.parent })))) ? true : false;
												el.show = show; 
												el.selected = true; 
												if(show) addNavFilter(el.anchor);
											});

									filter = $scope.coursesList.filter( function (el){ return (el.type == 2 || el.type == 10 || el.type == 12 || el.type == 17 || el.type == 32 || el.type == 'eventos' ) && el.show });
									filter.map(function (el){ el.show = false });

								}else{
									filter = $scope.coursesList.filter( function (el){ return (el.type == 2 || el.type == 10 || el.type == 17 || el.type == 32  || el.type == 'eventos' ) });
									filter.map( function (el, i){
										show = (!selected.length || (selected.length && selected.find(function(i){ return i.type == el.type }))) ? true : false;
										// inserir primeira posicao de cada lista
										index = $scope.coursesList.findIndex( function (list){ return list.parent == el.type && list.show }); 
										if(index < 0) index = $scope.coursesList.findIndex( function (list){ return list.type == el.type });
										if(index >= 0){

											if(item.presencial && (el.type == 10 || el.type == 12 || el.type == 'eventos'))
												courses = filterTypes(el.courses, item.presencial);
											else if(item.pacotes && el.type == 17)
												courses = filterTypes(el.courses, item.pacotes);
											else
												courses = filterTypes(el.courses, item.type);

											if(courses.length){
												addNavFilter(parent.name+'-'+item.title+'-'+el.name);
												newList = { title : el.title+' - '+item.title, courses : courses , type: item.type, show : show , parent : el.type, selected : true, card : el.card, anchor : parent.name+'-'+item.title+'-'+el.name};
												$scope.coursesList.splice(index, 0, newList);
											}
											
										}
										el.show = false;
									});
									filter = $scope.coursesList.find( function (el){ return el.type == 12 });
									if(filter) filter.show = false;
								}
								
							}else{
								
								selected = $scope.coursesList.filter( function (el){ return  el.type == item.type });
								selected.map( function (el){ el.show = false; el.selected = false; });
								selected = $scope.coursesList.filter( function (el){ return (el.type == 17 || el.type == 32 || el.type == "eventos" ) && el.selected });
								if(selected.length){
									filter = $scope.coursesList.filter( function (el){ return (el.parent == 17 || el.parent == 32 || el.parent == "eventos") && el.selected });
									if(!filter.length){
										selected.map(function (el){ if(el.courses.length) el.show = true });
									}else{
										filter.map(function (el){ if(el.courses.length) el.show = true });
									}

								}
								
								filter = $scope.coursesList.filter( function (el) { return el.show || el.selected });
								if(!filter.length) startCourseList();

								filter = $scope.navFilters.find(function (el){ return parent.name == el.name });
								if(filter){
									selected = filter.inputs.filter( function (el) { return item.type == el.type });
									selected.map( function (el) { el.selected = false; filter.selected--; });
									if(!filter.selected) $scope.navFilters.splice($scope.navFilters.findIndex(function (el){ return parent.name == el.name }),1);
								} 
							}
						};

						// Start Controller
						// startWatchCount();
						
						QiSatAPI.getCourses().then( function(response){
								$scope.courses = response.data.retorno;
								startCourseList();
								$scope.loading = false;
						});
					
			}]).run(function($rootScope, $location, $anchorScroll) {
			    $rootScope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {
						setNavFilters();
						startCourseList(true);
			    });
			});
}());