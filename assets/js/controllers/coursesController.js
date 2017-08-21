(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller("CoursesController",
			[ '$scope', '$controller', '$filter', '$location', 'QiSatAPI', 'Config', 'authService', '$timeout', 'DataCoursesStates', 'DataCoursesFilter',
			function( scope, $controller, $filter, $location, QiSatAPI, Config, authService, $timeout, dataCoursesStates, dataCoursesFilter ){

						var filterTypes = $filter('byTypes'),
							filterZpad = $filter('zpad'),
							filterLimitName = $filter('limitName'),
							modalController = $controller('modalController'), vm = this;

							vm.filters = [];
							vm.navLinks = [];
							vm.navFilters = [];
							vm.states = "Selecione o Estado";
							vm.loading = true;
							vm.tipos = dataCoursesFilter;


						QiSatAPI.getCourses().then( function(courses){
								startCourseList();
								vm.loading = false;
						});


						function resetFilterEvents(){
								var filter, coursesList;
								
								if( coursesList = vm.coursesList.filter(function (el) { return el.type == 'eventos' || el.parent == 'eventos' })){
									coursesList.map(function (list) {
										if(list && list.courses){
											list.courses.map( function (course) {
												course.show = true;
												if( filter = course.eventos.filter( function (edicao) { return !edicao.show }))
													filter.map( function (edicao) { edicao.show = true });
											});
										}
									});
								}
						};

						function setNavFilters(){ 
							var elemts, elem, presencial = false;
								elemts = angular.element('.menu-filter-sidebar-item--link');
								if(elemts) elemts.removeClass('active');

								vm.filters = [];

								if($location.path() && $location.path().indexOf("/cursos") == 0)
									vm.navLinks = [{ title:"Todos os cursos", href : "/cursos"}];
								else if($location.path() == "/certificacoes")
									vm.navLinks = [{ title:"Todas as Certificações ", href : "/certificacoes"}];
								else
									vm.navLinks = [];

								switch ($location.path()) {
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
								  		vm.filters = Config.filters.online;
								  		vm.navLinks.push({title:"Online"});
								    break;
								  case "/cursos/presenciais":
								  case "/cursos/presenciais/individuais":
								  case "/cursos/presenciais/teorico":
								  case "/cursos/presenciais/software":
								  case "/cursos/presenciais/estrutural":
								  case "/cursos/presenciais/eletrica":
								  case "/cursos/presenciais/hidraulica":
								  	  	vm.filters = Config.filters.presencial;
								  	  	vm.navLinks.push({title:"Presenciais" });
								  	  	presencial = true;
								    break;
								  case "/cursos/lancamentos":
								  	  	vm.navLinks.push({title:"Lançamentos" });
								    break;
								  case "/cursos/online/gratuito":
								  	  	vm.navLinks.push({title:"Gratuitos" });
								    break;
							  	  default:
								  	  break;
								}

								elemts.map( function (el){ var elm = angular.element(elemts[el]); if( elm.attr('href') == $location.path() ) elem = elm });
								if(!elem) elemts.map( function (el){ var elm = angular.element(elemts[el]); if( elm.attr('href') == "/cursos" ) elem = elm });
								if(elem)  elem.addClass('active');
								vm.presencial = presencial;

						};
						setNavFilters();


						function startCourseList (uncheck){
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
									var elemts = vm.filters.find(function(el){ return el.name == tipoName }),
										elem = angular.element(tipoSelector), inputs;

										if(elemts && elemts.inputs && elemts.inputs.length)
											inputs = elemts.inputs.find(function(el){ return el.type == tipoId });
										
										elem.prop('checked', true);

										if(tipoName == 'Tipo')
											vm.filterTypes(elem, inputs);
										else if(tipoName == 'Combinacoes' )
											vm.filterTypesProduts(elem, inputs);
										else if(tipoName == 'Area')
											vm.addListFilter(elem, inputs, elemts);
								};


								vm.coursesList = QiSatAPI.getCourseList();

								switch($location.path()){
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
								// console.log(vm.coursesList);
						};

						vm.trackCourse = function(course){
							return course.id;
						};

						vm.inscricao = function(produto){
							var auth = authService.Authenticated();

							function enrol(){
								authService.inscricao(produto)
				 					   .then(function (res) {
				 							if(res.status == 200 && res.data && res.data.retorno && res.data.retorno.sucesso && res.data.retorno.link){
				 								modalController.alert({ success : true, main : { title : "Matricula no curso realizada!", subtitle : " Você será redirecionado para página do curso." } });
				 								$timeout(function() {
											      	window.location = res.data.retorno.link;
											      }, 10000);
				 							}else
				 								modalController.alert({ error : true, main : { title : "Falha para realizar Matricula!", subtitle : " Entre em contato com a central de Inscrições." } });

				 						}, function(){
				 							modalController.alert({ error : true, main : { title : "Falha para realizar Matricula!", subtitle : " Entre em contato com a central de Inscrições." } });
				 						});
							};

					 		if(auth === true){
				 				enrol();
					 		}else if (auth === false){
					 			modalController.login('/aluno/cursos', false, enrol);
					 		}else{
					 			auth.then(function(res){
				 					if(auth === true){
						 				enrol();
							 		}else{
							 			modalController.login('/aluno/cursos', false, enrol);
							 		}
					 			});
					 		}
					 	};

						vm.loadMore = function (list) {
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

						vm.myFilter = function (item) {
							function retira_acentos(palavra) {
								var com_acento = 'áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ';
								var sem_acento = 'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC';
								var nova = '';
								for(var i=0;i<palavra.length;i++) {
									if (com_acento.search(palavra.substr(i,1))>=0) {
										nova += sem_acento.substr(com_acento.search(palavra.substr(i,1)),1);
									} else {
										nova += palavra.substr(i,1);
									}
								}
								return nova;
							};
							if(vm.search)
								return ((item.nome && retira_acentos(item.nome).toLowerCase().indexOf(retira_acentos(vm.search).toLowerCase()) >= 0)
									 || (item.info && retira_acentos(item.info['metatag_key']).toLowerCase().indexOf(retira_acentos(vm.search).toLowerCase())>= 0));
							return true;
						};

						vm.filterTypes = function ( $event, item ) {
							var checkbox = $event.target||$event[0];
							var selected, filter, elemts;
							var otherItem;
								
							selected = vm.coursesList.find( function (el){ return el.type == item.type });
							if(checkbox && checkbox.checked) {
								if(item.type == 12){
									selected.selected = true;
 									selected.show = true;
 									filter = vm.coursesList.filter( function (el){ 
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
									vm.navLinks.push({title:"Individuais" });
									if(vm.navFilters.length) vm.navFilters = [];

								}else{
									otherItem = vm.coursesList.find( function (el){ return el.type == 12 });
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

  									filter = vm.coursesList.filter( function (el){
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
									vm.navLinks.splice(vm.navLinks.findIndex(function(el){return el.title == 'Individuais'}), 1);
								}else{
									if(item.type == 23){
										otherItem = 24;
									 	selected = angular.element('#Tipo0')[0];
									}else{
										otherItem = 23;
									 	selected = angular.element('#Tipo1')[0];
									}

									filter = vm.coursesList.filter( function (el){
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

						vm.filterStates = function ( item ) {

								var coursesList, filter, selected, elemts;
									selected = vm.coursesList.find(function (el) { return el.type == 'eventos' });

								if(item && item.uf){
									if(selected.selected) resetFilterEvents();
									else selected.selected = true;

									coursesList = vm.coursesList.filter(function (el) { return ( el.type == 'eventos' || el.parent == 'eventos' ) });
									coursesList.map(function (list) {
											list.courses.map(function (course) {
												var filter = course.eventos.filter( function (edicao) { return edicao.uf != item.uf });
												if(filter.length == course.eventos.length)
													course.show = false;
												else
													filter.map( function (edicao) { edicao.show = false });
											});
										});
									filter = vm.coursesList.filter(function (el) { return el.parent && el.selected });
									if(filter.length)
										filter.map(function (list) { list.show = true });
									else{
										filter = vm.coursesList.find(function (el) { return  el.type == 'eventos' });
										if(!filter.show) filter.show = true;
									}

									coursesList = vm.coursesList.filter(function (el) { return ( (!el.parent && el.show && (el.type != 'eventos')) || (el.parent && el.show && (el.parent != 'eventos')) ) });
									coursesList.map(function (el) { el.show = false });

									filter = vm.coursesList.filter( function (el){ return (el.type == 12 ||  el.type == 32 || el.type == 17 || el.parent == 12 ||  el.parent == 32 || el.parent == 17 ) && el.selected });
									filter.map( function (el) { el.selected = false });

									elemts = angular.element('.filter-types-produts:checked, #Tipo2');
									elemts.map( function (el) { elemts[el].checked = false });


									elemts = angular.element('.map__state.active');
									if(elemts) elemts.removeClass('active');
									elemts = angular.element(item.id);
									selected = elemts.find('.map__state');
									selected.addClass('active');

									console.log(item);

									vm.states = item.local;

								}else{
									vm.states = "Selecione o Estado";

									selected.selected = false;
									resetFilterEvents();

									elemts = angular.element('#selectStates option');
									elemts.map(function (el){ if (el && (elemts[el]) && elemts[el].selected ) angular.element(elemts[selected]).prop('selected', false); });


									filter = vm.coursesList.filter( function (el){ return ( el.parent == 10 || el.parent == 12 || el.parent == 'eventos' ) && el.selected });
									if(!filter.length)
										filter = vm.coursesList.filter( function (el){ return ( el.type == 10 || el.type == 12 || el.type == 'eventos' ) && !el.show });
									filter.map(function(el){ if(el.courses.length) el.show = true });

									elemts = angular.element('.map__state.active');
									elemts.removeClass('active');
								}
						};


						// INTEGRAÇÃO MAP E SELECT
						vm.mapFilterStates = function($event){
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

								vm.filterStates(item);

							}else vm.states = "Nenhum Curso Presencial no Estado Selecionado";
						}

						vm.filterTypesProduts = function ( $event, item ) {
							var checkbox = $event.target||$event[0];
							var otherType = (item.type == 32) ? 17 : 32;
							var selected, otherSelected, filter, elemts;

							if(checkbox.checked) {

								selected = vm.coursesList.find( function (el){ return el.type == item.type });
								selected.selected = true;
								filter = vm.coursesList.filter( function (el){ return (( el.parent == item.type ) && el.selected) });
								if(!filter.length) selected.show = true;
								else filter.map(function (el){ if(el.courses.length && !el.show ) el.show = true });

								filter = vm.coursesList.filter( function (el){
									return ((el.type == 2 || el.type == 10 || el.parent == 2 || el.parent == 10 || el.type == 'eventos' || el.parent == 'eventos' || el.type == 12 || el.parent == 12 ) && el.show );
								});
								filter.map(function(el){ el.show = false });

								otherSelected = vm.coursesList.find( function (el){ return el.type == otherType && el.selected });
								if(!otherSelected){
									filter = vm.coursesList.filter( function (el){ return ((el.type == otherType || el.parent == otherType ) && el.show )});
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

								selected = vm.coursesList.find( function (el){ return  el.type == item.type });
								selected.selected = false;
								selected.show = false;

								filter = vm.coursesList.filter( function (el){ return (el.parent == item.type) && el.selected });
								otherSelected = vm.coursesList.find( function (el){ return el.type == otherType && el.selected });

								if(!filter.length && !otherSelected){
									filter = vm.coursesList.filter(function (el){ return (el.type == 2 || el.type == 10 || el.type == 12 || el.type == 17 || el.type == 32 || el.type == 'eventos' )});
								}else if(filter.length && !otherSelected){
									filter = vm.coursesList.filter(function (el){
										return ((el.parent == 2 || el.parent == 10 || el.parent == 12 || el.parent == 17 || el.parent == 32 || el.parent == 'eventos' ) && el.selected)
									});
								}else if(filter.length && otherSelected){
									filter.map( function (el){ if(el.courses.length) el.show = false });
									filter = vm.coursesList.filter(function (el){
										return ((el.parent == otherSelected.type  ) && el.selected)
									});
								}
								filter.map( function (el){ if(el.courses.length) el.show = true });
							}
							// console.log(vm.coursesList);
						};

						vm.addListFilter = function ( $event, item, parent ) {
							var checkbox = $event.target||$event[0];
							var index, newList, filter, courses, selected, show, card;

							var addNavFilter = function(name){
								var navLink, navParent;
								navParent = vm.navFilters.find(function (el){ return parent.name == el.name });
								if(navParent){
									navLink = navParent.inputs.find(function (el){ return el.name == name });
									if(navLink)
										navLink.selected = true;
									else
										navParent.inputs.push({selected : true, name: name, hash : '#'+name, type: item.type });

									navParent.selected++;
								}else{
									navParent = { selected : 1, inputs : [{selected : true, name: name, hash : '#'+name, type: item.type }], name : parent.name, title : parent.title, type: item.type };
									vm.navFilters.push(navParent);
								}
							};

							if(checkbox.checked) {

								selected = vm.coursesList.filter( function (el){ return (el.type == 17 || el.type == 32 || el.type == 'eventos' ) && el.selected });
								filter = vm.coursesList.filter(function(el){ return el.type == item.type });
								if(filter.length){

									filter.map(function (el){
												show = ( el.courses.length && (!(selected.length) || (selected.length && selected.find(function(i){ return i.type == el.parent })))) ? true : false;
												el.show = show;
												el.selected = true;
												if(show) addNavFilter(el.anchor);
											});

									filter = vm.coursesList.filter( function (el){ return (el.type == 2 || el.type == 10 || el.type == 12 || el.type == 17 || el.type == 32 || el.type == 'eventos' ) && el.show });
									filter.map(function (el){ el.show = false });

								}else{
									filter = vm.coursesList.filter( function (el){ return (el.type == 2 || el.type == 10 || el.type == 17 || el.type == 32  || el.type == 'eventos' ) });
									filter.map( function (el, i){
										show = (!selected.length || (selected.length && selected.find(function(i){ return i.type == el.type }))) ? true : false;
										// inserir primeira posicao de cada lista
										index = vm.coursesList.findIndex( function (list){ return list.parent == el.type && list.show });
										if(index < 0) index = vm.coursesList.findIndex( function (list){ return list.type == el.type });
										if(index >= 0){

											if(item.presencial && (el.type == 10 || el.type == 12 || el.type == 'eventos'))
												courses = filterTypes(el.courses, item.presencial);
											else if(item.pacotes && el.type == 17)
												courses = filterTypes(el.courses, item.pacotes);
											else
												courses = filterTypes(el.courses, item.type);

											if(courses.length){
												addNavFilter(parent.name+'-'+item.title+'-'+el.name);
												newList = { id: vm.coursesList.length+1, title : el.title+' - '+item.title, courses : courses , type: item.type, show : show , parent : el.type, selected : true, card : el.card, anchor : parent.name+'-'+item.title+'-'+el.name};
												vm.coursesList.splice(index, 0, newList);
											}

										}
										el.show = false;
									});
									filter = vm.coursesList.find( function (el){ return el.type == 12 });
									if(filter) filter.show = false;
								}

							}else{

								selected = vm.coursesList.filter( function (el){ return  el.type == item.type });
								selected.map( function (el){ el.show = false; el.selected = false; });
								selected = vm.coursesList.filter( function (el){ return (el.type == 17 || el.type == 32 || el.type == "eventos" ) && el.selected });
								if(selected.length){
									filter = vm.coursesList.filter( function (el){ return (el.parent == 17 || el.parent == 32 || el.parent == "eventos") && el.selected });
									if(!filter.length){
										selected.map(function (el){ if(el.courses.length) el.show = true });
									}else{
										filter.map(function (el){ if(el.courses.length) el.show = true });
									}

								}
								
								filter = vm.coursesList.filter( function (el) { return el.show || el.selected });
								if(!filter.length) startCourseList();

								filter = vm.navFilters.find(function (el){ return parent.name == el.name });
								if(filter){
									selected = filter.inputs.filter( function (el) { return item.type == el.type });
									selected.map( function (el) { el.selected = false; filter.selected--; });
									if(!filter.selected) vm.navFilters.splice(vm.navFilters.findIndex(function (el){ return parent.name == el.name }),1);
								} 
							}
						};

			}]);
}());