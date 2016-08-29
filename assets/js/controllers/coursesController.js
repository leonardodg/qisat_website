var QiSatApp = angular.module('QiSatApp');

QiSatApp.controller("topCoursesCtrl",
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
													course.url = Config.cursoOnlineUrl+course.info.seo.url;
												}

												course.nome = course.info.titulo;
											}
											
										}
									});
									$scope.topCourses = courses;
								 });
			}).controller("coursesCtrl",
			function($scope, $filter, QiSatAPI, Config){

						var filterTypes = $filter('byTypes'),
							filterZpad = $filter('zpad'),
							filterLimitName = $filter('limitName'),
							inputStates;

							$scope.path = window.location.pathname;
							$scope.coursesList  = [];
							//$scope.totalShow = 0;

						var resetFilterEvents = function(){
								var coursesList = $scope.coursesList.filter(function (el) { return el.type == 'eventos' || el.parent == 'eventos' });
								coursesList.map(function (list) {
									list.courses.map( function (course) {
										course.show = true;
										filter = course.eventos.filter( function (edicao) { return !edicao.show });
										filter.map( function (edicao) { edicao.show = true });
									});
								});
						};

						var startCoursesList = function(){ 
							var coursesList;
							if( $scope.path.indexOf('/online') >= 0){
								coursesList = $scope.coursesList.filter( function (el){ 
										return (el.type == 2 || el.type == 17 || el.type == 32 ) && !el.show;
									});
								coursesList.map(function(el){ el.show = true });
							}else if( $scope.path.indexOf('/presenciais') >= 0){
								coursesList = $scope.coursesList.filter( function (el){ 
										return (el.type == 'eventos' || el.type == 10 || el.type == 12 ) && !el.show;
									});
								coursesList.map(function(el){ el.show = true });		
							}else if( $scope.path.indexOf('/cursos') >= 0){
								coursesList = $scope.coursesList.filter( function (el){ 
										return (el.type == 2 || el.type == 17 || el.type == 32 || el.type == 'eventos' || el.type == 10 || el.type == 12 ) && !el.show;
									});
								coursesList.map(function(el){ el.show = true });
							}
						};

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
										return ((el.type == 2 || el.type == 10 || el.parent == 2 || el.type == 32 || el.parent == 32 || el.type == 17 || el.parent == 17  || el.parent == 10 || el.type == 'eventos' || el.parent == 'eventos' ) && el.show )
												||
											   ((el.type == 2 || el.type == 10 || el.parent == 2 || el.type == 32 || el.parent == 32 || el.type == 17 || el.parent == 17  || el.parent == 10 || el.type == 'eventos' || el.parent == 'eventos' ) && el.selected );
									});
									filter.map(function(el){ el.show = false; el.selected = false; });

									// REGRAS DE COMPORTAMENTE ELEMENTOS DA PÁGINA 
									elemts = angular.element('.filter-types-produts:checked, .filter-area:checked, #tipo0, #tipo1');
									elemts.map( function (el) { elemts[el].checked = false });

									elemts = angular.element('#selectStates option');
									selected = null;
									elemts.map(function(el){ if (el && (elemts[el]) && elemts[el].selected ) selected = el; });

									if (selected){
										elemts[selected].selected = false; 
										elemts[0].selected = true;
										resetFilterEvents();
									}

								}else{
									otherItem = $scope.coursesList.find( function (el){ return el.type == 12 });
									if(otherItem && otherItem.selected){
										otherItem.selected = false;
 										otherItem.show = false;

 										elemts = angular.element('#tipo2');
										elemts.map( function (el) { elemts[el].checked = false });
										startCoursesList();
									}

									if(item.type == 23){
										otherItem = 24;
									 	selected = angular.element('#tipo0')[0];
									}else{
										otherItem = 23;
									 	selected = angular.element('#tipo1')[0];
									}
									
  									filter = $scope.coursesList.filter( function (el){ 
										return ((el.type == 2 || el.type == 10 || el.type == 32 || el.type == 17 || el.type == 'eventos' ) && el.show )
												||
											   ((el.parent == 2 || el.parent == 32 || el.parent == 17  || el.parent == 10 || el.parent == 'eventos' ) && el.selected );
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
									startCoursesList();
								}else{
									if(item.type == 23){
										otherItem = 24;
									 	selected = angular.element('#tipo0')[0];
									}else{
										otherItem = 23;
									 	selected = angular.element('#tipo1')[0];
									}

									filter = $scope.coursesList.filter( function (el){ 
										return ((el.type == 2 || el.type == 10 || el.type == 32 || el.type == 17 || el.type == 'eventos' ) && el.show )
												||
											   ((el.parent == 2 || el.parent == 32 || el.parent == 17  || el.parent == 10 || el.parent == 'eventos' ) && el.selected );
										});

									if(!selected.checked){
										filter.map(function (list){ 
											list.courses.map( function (course){
													course.show = true;
											});
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
									filter = $scope.coursesList.filter(function (el) { return el.parent });
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

									elemts = angular.element('.filter-types-produts:checked, #tipo2');
									elemts.map( function (el) { elemts[el].checked = false });

								}else{
									selected.selected = false;
									resetFilterEvents();

									filter = $scope.coursesList.filter( function (el){ return (el.parent == 2 || el.parent == 10 || el.parent == 12 || el.parent == 17 || el.parent == 32 || el.parent == 'eventos' ) && el.selected });	
									if(!filter.length)
										filter = $scope.coursesList.filter( function (el){ return (el.type == 2 || el.type == 10 || el.type == 12 || el.type == 17 || el.type == 32 || el.type == 'eventos' ) && !el.show });
									filter.map(function(el){ if(el.courses.length) el.show = true });
								}
								// console.log($scope.coursesList);
						};


						$scope.filterTypesProduts = function ( $event, item ) {
							var checkbox = $event.target;
							var otherType = (item.type == 32) ? 17 : 32;
							var selected, otherSelected, filter;

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

						$scope.addListFilter = function ( $event, item ) {
							var checkbox = $event.target;
							var index, newList, filter, courses, selected, show, card;
							if(checkbox.checked) {

								selected = $scope.coursesList.filter( function (el){ return (el.type == 17 || el.type == 32 || el.type == 'eventos' ) && el.selected });
								filter = $scope.coursesList.filter(function(el){ return el.type == item.type });
								if(filter.length){
									
									filter.map(function (el){ 
												show = ( el.courses.length && (!(selected.length) || (selected.length && selected.find(function(i){ return i.type == el.parent })))) ? true : false;
												el.show = show; 
												el.selected = true; 
											});

									filter = $scope.coursesList.filter( function (el){ return (el.type == 2 || el.type == 10 || el.type == 12 || el.type == 17 || el.type == 32 || el.type == 'eventos' ) && el.show });
									filter.map(function (el){ el.show = false });
								}else{
									filter = $scope.coursesList.filter( function (el){ return (el.type == 2 || el.type == 10 || el.type == 17 || el.type == 32  || el.type == 'eventos' ) });
									filter.map( function (el){
										show = (!selected.length || (selected.length && selected.find(function(i){ return i.type == el.type }))) ? true : false;
										// inserir primeira posicao de cada lista
										index = $scope.coursesList.findIndex( function (list){ return list.parent == el.type && list.show }); 
										if(index < 0) index = $scope.coursesList.findIndex( function (list){ return list.type == el.type });
										if(index >= 0){

											if(item.presencial && (el.type == 10 || el.type == 12 || el.type == 'eventos'))
												courses = filterTypes(el.courses, item.presencial);
											else if(item.pacote && el.type == 17)
												courses = filterTypes(el.courses, item.pacote);
											else
												courses = filterTypes(el.courses, item.type);

											if(!courses.length) show = false;
											newList = { title : el.title+' - '+item.title, courses : courses , type: item.type, show : show , parent : el.type, selected : true, card : el.card };
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
								selected = $scope.coursesList.filter( function (el){ return (el.type == 17 || el.type == 32) && el.selected });
								if(selected.length){
									filter = $scope.coursesList.filter( function (el){ return (el.parent == 17 || el.parent == 32) && el.selected });
									if(!filter.length){
										selected.map(function (el){ if(el.courses.length) el.show = true });
									}else{
										filter.map(function (el){ if(el.courses.length) el.show = true });
									}

								}
								
								filter = $scope.coursesList.filter( function (el) { return el.show });
								if(!filter.length){
									if( $scope.path.indexOf('/online') >= 0){
										filter = $scope.coursesList.filter( function (el){ return el.type == 2 || el.type == 17 || el.type == 32 });
										filter.map(function(el){ if(el.courses.length) el.show = true });
									}else if( $scope.path.indexOf('/presenciais') >= 0){
										filter = $scope.coursesList.filter( function (el){ return el.type == 10 || el.type == 12 || el.type == 'eventos' });
										filter.map(function(el){ if(el.courses.length) el.show = true });
									}else { 
										filter = $scope.coursesList.filter( function (el){ return el.type == 2 || el.type == 10 || el.type == 12 || el.type == 17 || el.type == 32 || el.type == 'eventos' });
										filter.map(function(el){ if(el.courses.length) el.show = true });
									}
								}
							}
							// console.log($scope.coursesList);
						};

						if( $scope.path.indexOf('/online') >= 0){
							$scope.filters = Config.filters.online;
						}else if( $scope.path.indexOf('/presenciais') >= 0){
							$scope.filters = Config.filters.presencial;
						}else if( $scope.path.indexOf('/cursos') >= 0){
							$scope.filters = Config.filters.all;
						}

						QiSatAPI.getCourses()
								.then( function ( response ){
									var courses = [], remove = [], coursesList  = [], series, pacotes, presencial, eventos, individual;
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

												// if(course.info.seo && course.info.seo.url){
												// 	course.url = Config.cursoOnlineUrl+course.info.seo.url;
												// }
												course.nome = filterLimitName(course.info.titulo);

												if( course.categorias.find(function(tipo){ return tipo.id == 32 })) { // Séries
													course.modalidade = "Série Online";
													course.link =  "/curso/online/"+course.info.seo.url ;
													remove.push(i); 

													course.info.conteudos.map( function (conteudo){
														 var aux =  conteudo.titulo.split('-');
														 conteudo.capitulo = aux[0];
														 conteudo.nome = aux[1];
													});

												}else if( course.categorias.find(function(tipo){ return tipo.id == 17 })){ // Pacotes
													course.modalidade = "Pacote de Cursos Online";
													course.link =  "/curso/online/"+course.info.seo.url ;
													remove.push(i); 
												}else if( course.categorias.find(function(tipo){ return tipo.id == 40 })){ // PALESTRAS
													course.modalidade = "Palestra Online";
													course.link =  "/curso/online/"+course.info.seo.url ;
												}else if( course.categorias.find(function(tipo){ return tipo.id == 12 })){ // Presenciais Individuais
													course.modalidade = "Curso Presencial - individual";
													course.link =  "/curso/presencial/"+course.info.seo.url ;
													remove.push(i); 
												}else if( course.categorias.find(function(tipo){ return tipo.id == 10 })){ // Presencial
													course.modalidade = "Curso Presencial";
													course.link = "/curso/presencial/"+course.info.seo.url;
													remove.push(i); 
												}else if( course.categorias.find(function(tipo){ return tipo.id == 16 })){ // Prazo Extra
													remove.push(i);
												}else if( course.categorias.find(function(tipo){ return tipo.id == 22 }) ){ // WebConferência
													remove.push(i);
												}else if( course.categorias.find(function(tipo){ return tipo.id == 9  })){ // Interno
													remove.push(i);
												}else if( course.categorias.find(function(tipo){ return tipo.id == 2 })){ // A Dinstancia
													course.modalidade = "Curso Online";
													course.link = "/curso/online/"+course.info.seo.url ;
												}else{
													remove.push(i); // ">> SEM CATEGORIA <<";
												}



											}else{
												remove.push(i);
											}

											// PARA PACOTES
											// if(course.produtos){
											// 	course.produtos.map(function(produto){
											// 		if(produto.info && produto.info.seo && produto.info.seo.url){
											// 			produto.url = Config.cursoOnlineUrl+produto.info.seo.url;
											// 		}
											// 	});
											// }

											
										}
									});


									//courses = courses.filter(function(course){ return course.visivel == 'true' });
					
									$scope.coursesAll = angular.copy(courses);
									series = filterTypes(courses, 32);
									pacotes = filterTypes(courses, 17);
									individual = filterTypes(courses, 12);
									presencial = filterTypes(courses, 10);
									eventos = presencial.filter(function (course){ return course.eventos && course.eventos.length });
									presencial = presencial.filter(function (course){ return !course.eventos });

									eventos.map( function (course){
										course.show = true;
										course.eventos.map( function (edicao){
											edicao.show = true;
											edicao.uf = edicao.local[0].detalhes.uf;
											edicao.timestart = $filter('date')( edicao.timestart*1000, 'dd/MM/yy' );
											edicao.timeend   = $filter('date')( edicao.timeend*1000, 'dd/MM/yy' );
											edicao.endereco  = (edicao.local && edicao.local.length) ? edicao.local[0].detalhes.cidade + ' - ' +edicao.local[0].detalhes.uf : 'Á Definir';
										});
									});
									
									remove.map( function (i){ delete(courses[i]) });
									courses = courses.filter( function (el){ return el });
									courses = filterTypes(courses, 2);

									remove = [];
									presencial.map( function (course, i){ if(course.categorias.find(function(tipo){ return tipo.id == 12 })) remove.push(i); });
									remove.map( function (i){ delete(presencial[i]) });
									presencial = presencial.filter( function (el){ return el });

									remove = [];
									series.map( function (course, i){ if(!course.info) remove.push(i); });
									remove.map( function (i){ delete(series[i]) });
									series = series.filter( function (el){ return el });

									remove = [];
									pacotes.map( function (course, i){ if(!course.info) remove.push(i); });
									remove.map( function (i){ delete(pacotes[i]) });
									pacotes = pacotes.filter( function (el){ return el });

									if( $scope.path.indexOf('/online') >= 0){
										courses.map( function (course){ course.show = true });
										pacotes.map( function (course){ course.show = true });
										series.map( function (course){ course.show = true });
										$scope.coursesList.push({ title : 'Cursos Online', courses : courses, type: 2, show : true, card : 'online'  });
										$scope.coursesList.push({ title : 'Pacote de Cursos Online', courses : pacotes, type: 17, show : true , card : 'pacotes' }); // >>>> CORRETO SERIE
										$scope.coursesList.push({ title : 'Série Online', courses : series, type: 32, show : true, card : 'serie' }); // >>>> CORRETO SERIE
									}else if( $scope.path.indexOf('/presenciais') >= 0){
										eventos.map( function (course){ course.show = true });
										presencial.map( function (course){ course.show = true });
										individual.map( function (course){ course.show = true });
										$scope.coursesList.push({ title : 'Cursos Presencial - Eventos', courses : eventos, type: 'eventos', show : true, card : 'eventos' });
										$scope.coursesList.push({ title : 'Cursos Presencial', courses : presencial, type: 10, show : true, card : 'online' });
										$scope.coursesList.push({ title : 'Cursos Presencial - Individual ', courses : individual, type: 12, show : true, card : 'online' });
									}else { 
										courses.map( function (course){ course.show = true });
										pacotes.map( function (course){ course.show = true });
										series.map( function (course){ course.show = true });
										eventos.map( function (course){ course.show = true });
										presencial.map( function (course){ course.show = true });
										individual.map( function (course){ course.show = true });

										$scope.coursesList.push({ title : 'Cursos Online', courses : courses, type: 2, show : true, card : 'online'  });
										$scope.coursesList.push({ title : 'Cursos Presencial - Eventos', courses : eventos, type: 'eventos', show : true, card : 'eventos' });
										$scope.coursesList.push({ title : 'Cursos Presencial', courses : presencial, type: 10, show : true, card : 'online' });
										$scope.coursesList.push({ title : 'Cursos Presencial - Individual ', courses : individual, type: 12, show : true, card : 'online' });
										$scope.coursesList.push({ title : 'Pacote de Cursos Online', courses : pacotes, type: 17, show : true , card : 'pacotes' }); // >>>> CORRETO SERIE
										$scope.coursesList.push({ title : 'Série Online', courses : series, type: 32, show : true, card : 'serie' }); // >>>> CORRETO SERIE
									}
									// console.log($scope.coursesList);
								});
							
							inputStates = $scope.filters.find(function (el){ return el.name == 'estado' })
							if(inputStates){
								QiSatAPI.getStates()
										.then( function ( response ){
											var data = [];
											if(response.status == 200) data = response.data;
											else return;
											data.map(function (el){
												el.name = el.Estado+' - '+el.uf;
												inputStates.inputs.push(el);
											});
										});
							}


							QiSatAPI.getFilterData()
									.then( function ( response ){
										var data = [];
										if(response.status == 200) data = response.data;
										$scope.filters.map (function (filtro){ 

											filtro.inputs.map (function (el, i){ 
												if(filtro.type == 'checkbox') el.name = filtro.name+i;
												el.qtds = 0;
												filter  = data.find(function (value){ return el.type == value.id })
												if(filter) el.qtds += filter.cursos;
												if(el.presencial){
													filter = data.find(function (value){ return el.presencial == value.id })
													if(filter) el.qtds += filter.cursos;
												}
												if(el.pacote){
													filter = data.find(function (value){ return el.pacote == value.id })
													if(filter) el.qtds += filter.cursos;
												}
												el.qtds = filterZpad(el.qtds);
											});
										});
									});
			});