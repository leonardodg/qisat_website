// var QiSatApp = angular.module('QiSatApp');

// QiSatApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
// 				    function($stateProvider, $urlRouterProvider, $locationProvider) {
// 						      // $urlRouterProvider.otherwise('/');

// 						      $stateProvider
// 								      .state('index', {
// 								        url: '/',
// 								        views: {
// 										            'instructors@': { 
// 										                templateUrl: './views/instructors.html',
// 										               	controller : 'instructorsController as self'
// 										            },

// 										            'header@' : {
// 										            		templateUrl: './views/header.html'
// 										            },

// 										            'footer@' : {
// 										            		templateUrl: './views/footer.html'
// 										            }
// 										        }
											        
// 								    	})
// 									      .state('cursos',{ absolute: true});
			    			
// 			    			  // $locationProvider.html5Mode({ enabled: true, requireBase: true }).hashPrefix('!');
// 			    			  // $locationProvider.html5Mode({ enabled: true, requireBase: true });
// 			    			  $locationProvider.html5Mode(true);
// 			    			}]);
(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.value("Config", {
				baseUrl : "http://webservice.qisat.com:3000",
				imagensUrl : "http://webservice.qisat.com:3000/imagens/instrutores/",
				imagensUrlDefault : "http://webservice.qisat.com:3000/imagens/instrutores/instrutor.png",
				imgCursoUrlDefault : "http://webservice.qisat.com:3000/imagens/produtos/default.png",

				filters : { 

						online : [


										 { 
										   id : 4,
										   type : 'checkbox', 
										   name : 'Combinacoes',
										   title : 'Combinações', 
												inputs : [
															{ title: 'Séries de Capítulos', type : 32, name : 'series' },
															{ title: 'Pacotes de Cursos', type : 17, name : 'pacotes' }
														]},

										 { 
										   id : 5,
										   type : 'checkbox',
										   name : 'Area', 
										   title : 'Área de Atuação', 
												inputs : [
															{ title: 'Estrutural', type : 3, pacotes : 18, name : 'estrutural' },
															{ title: 'Elétrica', type : 4,  pacotes : 19,  name : 'eletrica' },
															{ title: 'Hidráulica', type : 6,pacotes : 20,  name : 'hidraulica' },
															{ title: 'Agronômica', type : 34, name : 'agronomica' },
															{ title: 'Arquitetônica', type : 35, name : 'arquitetonica' },
															{ title: 'CAD', type : 5, name : 'cad' }
														]},


										 { 
										   id : 6,
										   type : 'checkbox', 
										   name : 'Area-Complementar',
										   title : 'Área Complementar', 
												inputs : [
															{ title: 'Administração', type : 36, name : 'adm' },
															{ title: 'Qualidade e Desempenho', type : 37, name : 'desempenho' },
															{ title: 'Gestão de Projetos', type : 38, name : 'gestao' }
														]},	

										 { 
										   id : 7,
										   type : 'checkbox',
										   name : 'Tipo',
										   title : 'Tipo', 
												inputs : [
															{ title: 'Cursos Teóricos', type : 24, },
															{ title: 'Cursos Software AltoQi', type : 23 }
														]}

								 ],
						presencial : [

										  { id : 3, type : 'dropdown', name: 'estado', title: 'Estado', inputs : [] },	

										  {
										  	id : 5,
										    type : 'checkbox', 
										    name : 'Area',
										    title : 'Área de Atuação', 
												inputs : [
															{ title: 'Estrutural', type : 25, name : 'estrutural' },
															{ title: 'Elétrica', type : 26, name : 'eletrica' },
															{ title: 'Hidráulica', type : 27, name : 'hidraulica' }
														]},

										   { 
										   	 id : 7,
										   	 type : 'checkbox', 
										     name : 'Tipo',
										     title : 'Tipo', 
												inputs : [
															{ title: 'Cursos Teóricos', type : 24, presencial : 13 },
															{ title: 'Cursos Software AltoQi', type : 23, presencial : 11 },
														]},

											{ 
										   	 id : 10,
										   	 type : 'checkbox', 
										     name : 'Tipo',
												inputs : [
															{ title: 'Cursos Individuais', type : 12, name : '#Tipo2' }
														]}
						]
				}
			});
})();
(function() {
    'use strict';

	var setNavFilters, startCourseList;

	angular
		.module('QiSatApp')
		.controller("CoursesController",
			function($scope, $filter, $location, QiSatAPI, Config, getWatchCount ){

						var filterTypes = $filter('byTypes'),
							filterZpad = $filter('zpad'),
							filterLimitName = $filter('limitName');

							$scope.filters = [];
							$scope.navLinks = [];
							$scope.navFilters = [];
							$scope.coursesList = [];
							$scope.states = "Selecione o Estado";

							//$scope.totalShow = 0;

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
								  		$scope.filters = Config.filters.online;
								  		$scope.navLinks.push({title:"Online"});
								    break;
								  case "/cursos/presenciais":
								  	  	$scope.filters = Config.filters.presencial;
								  	  	$scope.navLinks.push({title:"Presenciais" });
								  	  	presencial = true;
								    break;
								  case "/cursos/lancamentos":
								  	  	$scope.navLinks.push({title:"Lançamentos" });
								    break;
								  case "/cursos/gratuitos":
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

						var setDataFilters = function(){ 
							var inputStates;

							function subChars(text){
							      text = text.toLowerCase();
							      return '#'+text.split(' ').map(function(e){ return e.charAt(0).toUpperCase() + e.slice(1); }).join('_');
						    }

							// Buscar Estados no WebService 
							inputStates = Config.filters.presencial.find(function (el){ return el.name == 'estado' })
							if(inputStates){
								QiSatAPI.getStates()
										.then( function ( response ){
											var data = [];
											if(response.status == 200) data = response.data;
											data.map(function (el){
												el.name = el.Estado+' - '+el.uf;
												el.id = subChars(el.Estado);
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
																if(filter) el.qtds += filter.produtos;
																if(el.presencial){
																	filter = data.find(function (value){ return el.presencial == value.id })
																	if(filter) el.qtds += filter.produtos;
																}
																if(el.pacotes){
																	filter = data.find(function (value){ return el.pacotes == value.id })
																	if(filter) el.qtds += filter.produtos;
																}
																el.qtds = filterZpad(el.qtds);
															});
														};
											if(response.status == 200) data = response.data;
											Config.filters.presencial.map(setData);
											Config.filters.online.map(setData);
									});
						};

						startCourseList = function(uncheck){
								var  remove, series, packages, classroom, events, single, releases, 
									 free, online, list, filter, elemts, selected;

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
								
								if($scope.courses && $scope.courses.length > 0){

									filter = $scope.coursesList.filter(function (list){ return list.show || list.selected });
									filter.map( function (list){ list.show = false; list.selected = false; });

									if( $scope.path == '/cursos/lancamentos' ){

										list = $scope.coursesList.find(function (list){ return list.type == 39 });
										if(!list) {
											releases = filterTypes($scope.courses, 39);
											releases.map( function (course){ course.show = true });
											$scope.coursesList.push({ title : 'Lançamentos', courses : releases, type: 39, show : true, card : 'online', limit:6 });
										}else list.show = true;

									}else if( $scope.path == '/cursos/gratuitos' ){

										list = $scope.coursesList.find(function (list){ return list.type == 8 });
										if(!list) {
											free = filterTypes($scope.courses, 8);
											free.map( function (course){ course.show = true });
											$scope.coursesList.push({ title : 'Cursos Gratuitos', courses : free, type: 8, show : true, card : 'online', limit:6 });
										}else list.show = true;

									}else if( $scope.path == '/cursos/online' ){

										list = $scope.coursesList.find(function (list){ return list.type == 2 });
										if(!list) {
											online = filterTypes($scope.courses, 2);
											remove = [];
											online.map(function (course, i){ if(!course.info || course.categorias.find(function (tipo){ return (tipo.id == 32 || tipo.id == 33 || tipo.id == 17 || tipo.id == 22  || tipo.id == 9) })) remove.push(i); })
											remove.map( function (i){ delete(online[i]) });
											online = online.filter( function (el){ return el });
											online.map( function (course){ course.show = true });
											$scope.coursesList.push({ title : 'Cursos Online', courses : online, type: 2, show : true, card : 'online', name : 'Online', limit:6 });
										}else list.show = true;

										list = $scope.coursesList.find(function (list){ return list.type == 32 });
										if(!list) {
											series = filterTypes($scope.courses, 32);
											remove = [];
											series.map( function (course, i){ if(!course.info) remove.push(i); });
											remove.map( function (i){ delete(series[i]) });
											series = series.filter( function (el){ return el });
											series.map( function (course){ course.show = true });
											$scope.coursesList.push({ title : 'Série Online', courses : series, type: 32, show : true, card : 'serie', name : 'Series', limit:3 }); // >>>> CORRETO SERIE
										}else list.show = true;

										list = $scope.coursesList.find(function (list){ return list.type == 17 });
										if(!list) {
											packages = filterTypes($scope.courses, 17);
											remove = [];
											packages.map( function (course, i){ if(!course.info) remove.push(i); });
											remove.map( function (i){ delete(packages[i]) });
											packages = packages.filter( function (el){ return el });
											packages.map( function (course){ course.show = true });
											$scope.coursesList.push({ title : 'Pacote de Cursos Online', courses : packages, type: 17, show : true, card : 'pacotes', name : 'Pacotes', limit:3 }); // >>>> CORRETO SERIE
										}else list.show = true;
									
									}else if( $scope.path == '/cursos/presenciais' ){

										list = $scope.coursesList.find(function (list){ return list.type == 12 });
										if(!list) {
											single = filterTypes($scope.courses, 12);
											// remove = [];
											// single.map( function (course, i){ if(!course.info) remove.push(i); });
											// remove.map( function (i){ delete(single[i]) });
											// single = classroom.filter( function (el){ return el });
											single.map( function (course){ course.show = true });
											$scope.coursesList.push({ title : 'Cursos Presencial - Individual ', courses : single, type: 12, show : true, card : 'online', name : 'Individual', limit:3 });
										}else list.show = true;

										list = $scope.coursesList.find(function (list){ return list.type == 10 });
										if(!list) {
											classroom = filterTypes($scope.courses, 10);
											events = classroom.filter(function (course){ return course.eventos && course.eventos.length });
											classroom = classroom.filter(function (course){ return !course.eventos });
											remove = [];
											classroom.map( function (course, i){ if(!course.info || course.categorias.find(function(tipo){ return tipo.id == 12 })) remove.push(i); });
											remove.map( function (i){ delete(classroom[i]) });
											classroom = classroom.filter( function (el){ return el });
											classroom.map( function (course){ course.show = true });
											$scope.coursesList.push({ title : 'Cursos Presencial', courses : classroom, type: 10, show : true, card : 'online', name : 'Presencial', limit:6 });
										}else list.show = true;

										list = $scope.coursesList.find(function (list){ return list.type == 'eventos' });
										if(!list && events){
											events.map( function (course){
												course.show = true;
												course.eventos.map( function (edicao){
													edicao.show = true;
													edicao.uf = edicao.local[0].detalhes.uf;
													edicao.timestart = $filter('date')( edicao.timestart*1000, 'dd/MM/yy' );
													edicao.timeend   = $filter('date')( edicao.timeend*1000, 'dd/MM/yy' );
													edicao.endereco  = (edicao.local && edicao.local.length) ? edicao.local[0].detalhes.cidade + ' - ' +edicao.local[0].detalhes.uf : 'Á Definir';
												});
											});
											events.map( function (course){ course.show = true });
											$scope.coursesList.push({ title : 'Cursos Presencial - Eventos', courses : events, type: 'eventos', show : true, card : 'eventos', name : 'Eventos', limit:3 });
										}else if(list) list.show = true;

									}else{

										list = $scope.coursesList.find(function (list){ return list.type == 2 });
										if(!list) {
											online = filterTypes($scope.courses, 2);
											remove = [];
											online.map(function (course, i){ if(!course.info || course.categorias.find(function (tipo){ return (tipo.id == 32 || tipo.id == 33 || tipo.id == 17 || tipo.id == 22  || tipo.id == 9) })) remove.push(i); })
											remove.map( function (i){ delete(online[i]) });
											online = online.filter( function (el){ return el });
											online.map( function (course){ course.show = true });
											$scope.coursesList.push({ title : 'Cursos Online', courses : online, type: 2, show : true, card : 'online', name : 'Online'  });
										}else list.show = true;

										list = $scope.coursesList.find(function (list){ return list.type == 12 });
										if(!list) {
											single = filterTypes($scope.courses, 12);
											// remove = [];
											// single.map( function (course, i){ if(!course.info) remove.push(i); });
											// remove.map( function (i){ delete(single[i]) });
											// single = classroom.filter( function (el){ return el });
											single.map( function (course){ course.show = true });
											$scope.coursesList.push({ title : 'Cursos Presencial - Individual ', courses : single, type: 12, show : true, card : 'online', name : 'Individual', limit:3 });
										}else list.show = true;

										list = $scope.coursesList.find(function (list){ return list.type == 10 });
										if(!list) {
											classroom = filterTypes($scope.courses, 10);
											events = classroom.filter(function (course){ return course.eventos && course.eventos.length });
											classroom = classroom.filter(function (course){ return !course.eventos });
											remove = [];
											classroom.map( function (course, i){ if(!course.info || course.categorias.find(function(tipo){ return tipo.id == 12 })) remove.push(i); });
											remove.map( function (i){ delete(classroom[i]) });
											classroom = classroom.filter( function (el){ return el });
											classroom.map( function (course){ course.show = true });
											$scope.coursesList.push({ title : 'Cursos Presencial', courses : classroom, type: 10, show : true, card : 'online', name : 'Presencial', limit:6 });
										}else list.show = true;

										list = $scope.coursesList.find(function (list){ return list.type == 'eventos' });
										if(!list && events){
											events.map( function (course){
												course.show = true;
												course.eventos.map( function (edicao){
													edicao.show = true;
													edicao.uf = edicao.local[0].detalhes.uf;
													edicao.timestart = $filter('date')( edicao.timestart*1000, 'dd/MM/yy' );
													edicao.timeend   = $filter('date')( edicao.timeend*1000, 'dd/MM/yy' );
													edicao.endereco  = (edicao.local && edicao.local.length) ? edicao.local[0].detalhes.cidade + ' - ' +edicao.local[0].detalhes.uf : 'Á Definir';
												});
											});
											events.map( function (course){ course.show = true });
											$scope.coursesList.push({ title : 'Cursos Presencial - Eventos', courses : events, type: 'eventos', show : true, card : 'eventos', name : 'Eventos',limit:3 });
										}else if(list) list.show = true;

										list = $scope.coursesList.find(function (list){ return list.type == 32 });
										if(!list) {
											series = filterTypes($scope.courses, 32);
											remove = [];
											series.map( function (course, i){ if(!course.info) remove.push(i); });
											remove.map( function (i){ delete(series[i]) });
											series = series.filter( function (el){ return el });
											series.map( function (course){ course.show = true });
											$scope.coursesList.push({ title : 'Série Online', courses : series, type: 32, show : true, card : 'serie', name : 'Series', limit:3 }); // >>>> CORRETO SERIE
										}else list.show = true;

										list = $scope.coursesList.find(function (list){ return list.type == 17 });
										if(!list) {
											packages = filterTypes($scope.courses, 17);
											remove = [];
											packages.map( function (course, i){ if(!course.info) remove.push(i); });
											remove.map( function (i){ delete(packages[i])});
											packages = packages.filter( function (el){ return el });
											packages.map( function (course){ course.show = true });
											$scope.coursesList.push({ title : 'Pacote de Cursos Online', courses : packages, type: 17, show : true, card : 'pacotes', name : 'Pacotes',limit:3 }); // >>>> CORRETO SERIE
										}else list.show = true;
									}
								}
						}

						var getCoursesList = function(){ 
							QiSatAPI.getCourses()
									.then( function ( response ){
										var courses = [];
										if(response.status == 200) courses = response.data;
										courses.map( function (course, i) {
											var imagemFile;
											if(course){
												course.preco = $filter('currency')(course.preco, 'R$');
												course.imgSrc = Config.imgCursoUrlDefault;
												
												if(course.info){
													if(course.info.files){
														imagemFile = course.info.files.find(function(img) { return img.tipo == '5' });
														if(imagemFile) course.imgSrc =  Config.baseUrl+imagemFile.path.replace(/["\\"]/g,'/').replace( "public" ,'');
													}

													course.nome = filterLimitName(course.info.titulo);

													if( course.categorias.find(function(tipo){ return tipo.id == 32 })) { // Séries
														course.modalidade = "Série Online";
														course.link =  "/curso/online/"+course.info.seo.url ;
														course.info.conteudos.map( function (conteudo){
																	 var aux =  conteudo.titulo.split('-');
																	 conteudo.capitulo = aux[0];
																	 conteudo.nome = aux[1];
																	});
													}else if( course.categorias.find(function(tipo){ return tipo.id == 17 })){ // Pacotes
														course.modalidade = "Pacote de Cursos Online";
														course.link =  "/curso/online/"+course.info.seo.url ;
													}else if( course.categorias.find(function(tipo){ return tipo.id == 40 })){ // PALESTRAS
														course.modalidade = "Palestra Online";
														course.link =  "/curso/online/"+course.info.seo.url ;
													}else if( course.categorias.find(function(tipo){ return tipo.id == 12 })){ // Presenciais Individuais
														course.modalidade = "Curso Presencial - individual";
														course.link =  "/curso/presencial/"+course.info.seo.url ;
													}else if( course.categorias.find(function(tipo){ return tipo.id == 10 })){ // Presencial
														course.modalidade = "Curso Presencial";
														course.link = "/curso/presencial/"+course.info.seo.url;
													}else if( course.categorias.find(function(tipo){ return tipo.id == 2 })){ // A Dinstancia
														course.modalidade = "Curso Online";
														course.link = "/curso/online/"+course.info.seo.url ;
													}
												}

												// PARA PACOTES
												// if(course.produtos){
												// 	course.produtos.map(function(produto){
												// 		if(produto.info && produto.info.seo && produto.info.seo.url){
												// 			produto.url = "/curso/online/"+produto.info.seo.url;
												// 		}
												// 	});
												// }
											}
										});
										$scope.courses = courses;
										startCourseList();
									});
						}
							
							
						// -------------------------------------------------- //
						// ----------------  watchCount   ------------------- //
						// -------------------------------------------------- //
						var startWatchCount = function () { 
							// I hold the current count of watchers in the current page. This extends
							// beyond the current scope, and will hold the count for all scopes on 
							// the entire page.
							$scope.watchCount = 0;

							// I hold the bookmarkletized version of the function to provide a take-
							// away feature that can be used on any AngularJS page.
							$scope.bookmarklet = getWatchCount.bookmarklet;

							// Every time the digest runs, it's possible that we'll change the number
							// of $watch() bindings on the current page. 
							$scope.$watch(
								function watchCountExpression() {
									return( getWatchCount() );
								},
								function handleWatchCountChange( newValue ) {
									$scope.watchCount = newValue;
								}
							);
						}
						

						$scope.filterTypes = function ( $event, item ) {
							var checkbox = $event.target;
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

										// elemts = list.courses.filter(function (course){ return course.show });
										// if(elemts)
										// 	totalShow += elemts.length;

									 });
									// $scope.totalShow = totalShow;
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

										// elemts = list.courses.filter(function (course){ return course.show });
										// if(elemts)
										// 	totalShow += elemts.length;
									}
									// $scope.totalShow = totalShow;
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


									filter = $scope.coursesList.filter( function (el){ return (el.parent == 2 || el.parent == 10 || el.parent == 12 || el.parent == 17 || el.parent == 32 || el.parent == 'eventos' ) && el.selected });	
									if(!filter.length)
										filter = $scope.coursesList.filter( function (el){ return (el.type == 2 || el.type == 10 || el.type == 12 || el.type == 17 || el.type == 32 || el.type == 'eventos' ) && !el.show });
									filter.map(function(el){ if(el.courses.length) el.show = true });

									elemts = angular.element('.map__state.active');
									elemts.removeClass('active');
								}
								// console.log($scope.coursesList);
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
							var checkbox = $event.target;
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
							var checkbox = $event.target;
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

											if(!courses.length) show = false;
											else addNavFilter(parent.name+'-'+item.title+'-'+el.name);
											newList = { title : el.title+' - '+item.title, courses : courses , type: item.type, show : show , parent : el.type, selected : true, card : el.card, anchor : parent.name+'-'+item.title+'-'+el.name, limit:3 };
											$scope.coursesList.splice(index, 0, newList);
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
						setDataFilters();
						getCoursesList();
						startWatchCount();

			}).run(function($rootScope, $location, $anchorScroll) {
			    $rootScope.$on('$locationChangeSuccess', function (event, newUrl, oldUrl) {
			    	if($location.hash()) {
			    		$anchorScroll();
			    	}else{
						setNavFilters();
						startCourseList(true);
			    	}
			    });
			});
}());
(function() {
    'use strict';

	/* Link Ativo no HEADER 

		OBS.: utilizado apenas para include do HEADER
	*/

	angular
		.module('QiSatApp')
		.controller("headerCtrl",
					function(){
						var path = window.location.pathname;
						if(path == '/'){
							angular.element('.header-main__list[data-linkA="home"]').addClass('header-main__list-current');
						}else if( path.toLowerCase().indexOf('/cursos') >= 0 ){
							angular.element('.header-main__list[data-linkA="cursos"]').addClass('header-main__list-current');
						}else if( path.toLowerCase().indexOf('/aluno') >= 0 ){
							angular.element('.header-main__list[data-linkA="aluno"]').addClass('header-main__list-current');
						}else if( path.toLowerCase().indexOf('/institucional') >= 0 ){
							angular.element('.header-main__list[data-linkA="institucional"]').addClass('header-main__list-current');
						}
				});
})();
(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller("instructorsController",
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
})();
(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller("TopCoursesController",
			function($scope, QiSatAPI, Config){
						QiSatAPI.getCoursesTop()
								.then( function ( response ){
									var courses = [];
									if(response.status == 200) courses = response.data;
									courses.map( function (course) {
										var imagemFile;
										if(course){
											course.imgSrc = Config.imgCursoUrlDefault;
											course.modalidade = "Cursos Online";

											if(course.info){
												if(course.info.files){
													imagemFile = course.info.files.find(function(img) {return img.tipo == '5' });
													if(imagemFile) course.imgSrc =  Config.baseUrl+imagemFile.path.replace(/["\\"]/g,'/').replace( "public" ,'');
												}

												if(course.info.seo && course.info.seo.url){
													course.url = "/curso/online/"+course.info.seo.url;
												}

												course.nome = course.info.titulo;
											}
											
										}
									});
									$scope.topCourses = courses;
								 });
			});
})();
(function() {
    'use strict';

	 angular
	 	.module('QiSatApp')
	 	.controller("WatchCount",
				function( $scope, getWatchCount ) {
					

					// I hold the current count of watchers in the current page. This extends
					// beyond the current scope, and will hold the count for all scopes on 
					// the entire page.
					$scope.watchCount = 0;

					// I hold the bookmarkletized version of the function to provide a take-
					// away feature that can be used on any AngularJS page.
					$scope.bookmarklet = getWatchCount.bookmarklet;


					// Every time the digest runs, it's possible that we'll change the number
					// of $watch() bindings on the current page. 
					$scope.$watch(
						function watchCountExpression() {

							return( getWatchCount() );

						},
						function handleWatchCountChange( newValue ) {

							$scope.watchCount = newValue;

						}
					);
				}
			);
}());
(function () {
  "use strict";

  var directive = function(){
		    return function(scope, element, attrs){
		        var url = attrs.backImg;
		        element.css({
		            'background-image' : 'url(' + url +')'
		        });
		    };
		};

  angular
  	.module('QiSatApp')
  	.directive('backImg', directive);
  
}());
(function () {
  "use strict";

  var directive = function () {
    return {

    };
  };

  angular
  	.module('QiSatApp')
  	.directive('directiveName', directive);
  
}());
(function() {
  'use strict';

  angular
    .module('QiSatApp')
    .config( function ($locationProvider) {

                // use the HTML5 History API
                $locationProvider.html5Mode({
                                              enabled: true, 
                                              requireBase: false,
                                              rewriteLinks: 'internal'
                                            });      

                // $locationProvider.html5Mode(true).hashPrefix('!');            
            });
})();
(function() {
    'use strict';

	 angular
	 	.module('QiSatApp')
	 	.factory("QiSatAPI", function($http, Config){

				var _getInstructorsTop = function () {
					return $http({ cache: true, method: 'GET', url: Config.baseUrl+'/instrutores/top'});
				};

				var _getCoursesTop = function () {
					return $http({ cache: true, method: 'GET', url: Config.baseUrl+'/moodle/produtos/top'});
				};

				var _getCourses = function () {
					return $http({ cache: true, method: 'GET', url: Config.baseUrl+'/moodle/produtos'});
				};

				var _getStates = function () {
					return $http({ cache: true, method: 'GET', url: Config.baseUrl+'/moodle/eventos/estados'});
				};

				var _getFilterData = function () {
					return $http({ cache: true, method: 'GET', url: Config.baseUrl+'/moodle/tipo/dados'});
				};

				return {
					getInstructorsTop : _getInstructorsTop,
					getCoursesTop : _getCoursesTop,
					getCourses : _getCourses,
					getStates : _getStates,
					getFilterData : _getFilterData
				};
			});
}());
(function() {
    'use strict';

	// -------------------------------------------------- //
	// http://www.bennadel.com/blog/2698-counting-the-number-of-watchers-in-angularjs.htm
	// -------------------------------------------------- //

	// I get a rough estimate of the number of watchers on the page. This assumes 
	// that the entire page is inside the same AngularJS application. 
	angular
		.module('QiSatApp')
		.factory( "getWatchCount",
				function() {

					// I return the count of watchers on the current page.
					function getWatchCount() {

						var total = 0;

						// AngularJS denotes new scopes in the HTML markup by appending the
						// class "ng-scope" to appropriate elements. As such, rather than 
						// attempting to navigate the hierarchical Scope tree, we can simply
						// query the DOM for the individual scopes. Then, we can pluck the 
						// watcher-count from each scope.
						// --
						// NOTE: Ordinarily, it would be a HUGE SIN for an AngularJS service
						// to access the DOM (Document Object Model). But, in this case,
						// we're not really building a true AngularJS service, so we can 
						// break the rules a bit.
						angular.element( ".ng-scope" ).each(
							function ngScopeIterator() {

								// Get the scope associated with this element node.
								var scope = $( this ).scope();

								// The $$watchers value starts out as NULL. 
								total += scope.$$watchers ? scope.$$watchers.length : 0 ;
							}
						);
						
						return( total );

					}

					// For convenience, let's serialize the above method and convert it to 
					// a bookmarklet that can easily be run on ANY AngularJS page. 
					getWatchCount.bookmarklet = ( 
						"javascript:alert('Watchers:'+(" + 
						getWatchCount.toString()
							.replace( /\/\/.*/g, " " )
							.replace( /\s+/g, " " ) +
						")());void(0);" 
					);

					return( getWatchCount );

				}
			);
}());

  // Foundation JavaScript
  // Documentation can be found at: http://foundation.zurb.com/docs
  //$(document).foundation();

   // $("#menu").metisMenu({
   //   collapseInClass: 'in';
   // });

$(document).foundation('equalizer', 'reflow');



 $(document).foundation(

 {
"magellan-expedition": {
  active_class: 'navigation_courses__list-item-active', // specify the class used for active sections
  threshold: 0, // how many pixels until the magellan bar sticks, 0 = auto
  destination_threshold: 20, // pixels from the top of destination for it to be considered active
  throttle_delay: 50, // calculation throttling to increase framerate
  fixed_top: 0, // top distance in pixels assigend to the fixed element on scroll
  offset_by_height: true // whether to offset the destination by the expedition height. Usually you want this to be true, unless your expedition is on the side.
}
}

);










$(function() {
  $('.anchor').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });

   $(".map__state").click(function() {
      $(".mapa .map__state").removeClass("active");
      $(this).addClass("active");
  });
   
});




 $('.header-main__item-cart,  #cd-shadow-layer, .cd-go-to-cart').on('click', function(event){
         event.preventDefault();
        $("#cd-cart, #cd-shadow-layer, .header-main__list-cart").toggleClass("actived");
 });




  
$(document).ready(function() {
  if ( $('#sidebar-styker').length ) {
       $("#sidebar-styker").stick_in_parent({
        offset_top: 80,
        recalc_every: 1,
       });
  }

   if ( $('#sidebar-styker--courses').length ) {
       $("#sidebar-styker--courses").stick_in_parent({
        offset_top: 200,
        recalc_every: 1,
       });
  }

}());





   $(document).ready(function() {

     $(".owl-carousel-testimonials-home").owlCarousel({
         navigation : false, // Show next and prev buttons
         slideSpeed : 300,
         paginationSpeed : 400,
         singleItem:true,
         autoHeight:true,

         //"singleItem:true" is a shortcut for:
          items : 1,
         itemsDesktop : false,
         itemsDesktopSmall : false,
         itemsTablet: false,
         itemsMobile : false
     });

   });


/* Temporário
   temporário, usado somente para testar, a ideia é que seja feito em php,
   se favorirar adicionar a class .buttom-favorite-active  */
     $(function() {
       if ( $('.buttom-favorite').length ) {
             $('.buttom-favorite').on('click', function(){
                   event.preventDefault();
                  // alert("foi")
                  $(this).toggleClass("buttom-favorite-active");
             });


             $('.form-button-call-me').on('click', function(){
                        event.preventDefault();
                       $(".section-call__form").css({"height": "0", "overflow": "hidden"});
                       $(".section-call__done").css({"height": "initial", "overflow": "initial"});
              });
        }
      }());
/* end página cursos > botão favoritar*/




/* Temporário
   temporário, usado somente para testar,
   se clicar  .cd-item-remove  */

$(function() {
  if ( $('.cd-item-remove').length ) {
           $('.cd-item-remove').on('click', function(event){
                   //event.preventDefault();
                  $(this).parent().addClass("remove");
                    console.log("clicado");
          });
  }
});










//zurb foundation animate accordion
$(function() {
  if ( $('.accordion').length ) {
        // se accordion estiver presente, executa esse codigo
        $(".accordion").on("click", "dd", function () {
                if($(this).hasClass('active')){
                    $("dd.active").removeClass('active').find(".content").slideUp("fast");
                }
                else {
                    $("dd.active").removeClass('active').find(".content").slideUp("fast");
                    $(this).addClass('active').find(".content").slideToggle("fast");
                }
        });
  }
});
//end zurb foundation animate accordion




//toggle foter
if ( $('.footer-primary__list__item').length ) {
      if ($(window).width() < 640) {

          $(function() {
            $(".footer-primary__list__item").hide(200);

                 $('.footer-primary__list').children('.footer-primary__title').on('click', function(event){
                    event.preventDefault();
                    $(this).siblings(".footer-primary__list__item").slideToggle(200);
                 });
            }());
      } else{
         $(".footer-primary__list__item").show(200);
      }
}



//Smooth Scrolling : https://css-tricks.com/snippets/jquery/smooth-scrolling/
 $(function() {
   if ( $('.navigation_courses__list-item--link').length ) {

        $('.navigation_courses__list-item--link').click(function() {
          if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
              $('html, body').animate({
                scrollTop: (target.offset().top)-80
              }, 1000);
              return false;
            }
          }
        });
    }
});
  //end Smooth Scrolling








///simple modal image
   $(function() {
     if ( $('.section__course-gallery-list--link').length ) {
         $('.section__course-gallery-list--link').on('click', function(event){
               event.preventDefault();
              // alert("foi")
              $(this).toggleClass("active");

         });
       }
     }());













  ///cards para transformar em card ou linha
     $(function() {
        if ( $('.toggle-form-type').length ) {

             $('.toggle-form-type').on('click', function(event){
                   event.preventDefault();
                   $(this).toggleClass('toggle-form-type--active');

                  if($('.card-course').hasClass('card-format-block')) {
                    $(".card-course").removeClass("card-format-block").addClass("card-format-line");
                    $(".card-course").addClass("card-format-line");
                    $(".list-filter").removeClass("small-block-grid-1 medium-block-grid-3 large-block-grid-3").addClass("small-block-grid-1 medium-block-grid-1 large-block-grid-1");
 
                   }
                  else if($('.card-course').hasClass('card-format-line')) {
                    $(".card-course").removeClass("card-format-line").addClass("card-format-block");
                    $(".card-course").addClass("card-format-block");
                    $(".list-filter").removeClass("small-block-grid-1 medium-block-grid-1 large-block-grid-1").addClass("small-block-grid-1 medium-block-grid-3 large-block-grid-3");
                   }

 
             });
        }
      }());










// carrousel página institucional
$(document).ready(function() {
  if ( $('.owl-sync').length ) {

        var sync1 = $("#gallery-sync_bigger");
        var sync2 = $("#gallery-sync_thumb");
        var slidesPerPage = 6; //globaly define number of elements per page
        var syncedSecondary = true;

        sync1.owlCarousel({
          items : 1,
          slideSpeed : 2000,
          nav: true,
          autoplay: true,
          dots: false,
          loop: true,
          responsiveRefreshRate : 200,
          navText: ['<svg width="100%" height="100%" viewBox="0 0 11 20"><path style="fill:none;stroke-width: 1px;stroke: #000;" d="M9.554,1.001l-8.607,8.607l8.607,8.606"/></svg>','<svg width="100%" height="100%" viewBox="0 0 11 20" version="1.1"><path style="fill:none;stroke-width: 1px;stroke: #000;" d="M1.054,18.214l8.606,-8.606l-8.606,-8.607"/></svg>'],
        }).on('changed.owl.carousel', syncPosition);

        sync2
          .on('initialized.owl.carousel', function () {
            sync2.find(".owl-item").eq(0).addClass("current");
          })
          .owlCarousel({
          items : slidesPerPage,
          dots: false,
          nav: false,
          smartSpeed: 200,
          slideSpeed : 500,
          slideBy: slidesPerPage, //alternatively you can slide by 1, this way the active slide will stick to the first item in the second carousel
          responsiveRefreshRate : 100
        }).on('changed.owl.carousel', syncPosition2);

        function syncPosition(el) {
          //if you set loop to false, you have to restore this next line
          //var current = el.item.index;

          //if you disable loop you have to comment this block
          var count = el.item.count-1;
          var current = Math.round(el.item.index - (el.item.count/2) - 0.5);
          if(current < 0) {
            current = count;
          }
          if(current > count) {
            current = 0;
          }
          //end block

          sync2
            .find(".owl-item")
            .removeClass("current")
            .eq(current)
            .addClass("current");
          var onscreen = sync2.find('.owl-item.active').length - 1;
          var start = sync2.find('.owl-item.active').first().index();
          var end = sync2.find('.owl-item.active').last().index();

          if (current > end) {
            sync2.data('owl.carousel').to(current, 100, true);
          }
          if (current < start) {
            sync2.data('owl.carousel').to(current - onscreen, 100, true);
          }
        }

        function syncPosition2(el) {
          if(syncedSecondary) {
            var number = el.item.index;
            sync1.data('owl.carousel').to(number, 100, true);
          }
        }

        sync2.on("click", ".owl-item", function(e){
          e.preventDefault();
          var number = $(this).index();
          sync1.data('owl.carousel').to(number, 300, true);
        });

  }
});

// end carrousel página institucional












(function() {
   'use strict';

	angular
		.module('QiSatApp', [])
		.config(['$compileProvider', function ($compileProvider) {
				  $compileProvider.debugInfoEnabled(false);
				}]);
}());