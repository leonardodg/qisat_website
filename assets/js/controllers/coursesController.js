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

						var filterTypes = $filter('byTypes');
							$scope.path = window.location.pathname;
							$scope.coursesList  = [];
							$scope.types  = [];

						$scope.addList = function ( $event, item ) {
							var checkbox = $event.target;
							var index, newList, filter, courses, selected, type, show, check;
							if(checkbox.checked) {
								if( item.type == 32 || item.type == 17 ) {
									type = (item.type == 32) ? 17 : 32;
									selected = $scope.coursesList.find( function (el){ return el.type == item.type });
									selected.selected = true;
									filter = $scope.coursesList.filter( function (el){ return (( el.parent == item.type ) && el.selected) });
									if(!filter.length) selected.show = true;
									else filter.map(function (el){ if(el.courses.length && !el.show ) el.show = true });

									filter = $scope.coursesList.filter( function (el){ return ((el.type == 2 || el.type == 10 || el.parent == 2 || el.parent == 10 ) && el.show )});
									filter.map(function(el){ el.show = false });

									selected = $scope.coursesList.find( function (el){ return el.type == type && el.selected });
									if(!selected){
										filter = $scope.coursesList.filter( function (el){ return ((el.type == type || el.parent == type ) && el.show )});
										filter.map(function(el){ el.show = false });
									}

								}else{
									selected = $scope.coursesList.filter( function (el){ return (el.type == 17 || el.type == 32) && el.selected });

									filter = $scope.coursesList.filter(function(el){ return el.type == item.type });
									if(filter.length){
										
										filter.map(function (el){ 
													show = ( el.courses.length && (!(selected.length) || (selected.length && selected.find(function(i){ return i.type == el.parent })))) ? true : false;
													el.show = show; 
													el.selected = true; 
												});

										filter = $scope.coursesList.filter( function (el){ return (el.type == 2 || el.type == 10 || el.type == 17 || el.type == 32 ) && el.show });
										filter.map(function (el){ el.show = false });
									}else{
										filter = $scope.coursesList.filter( function (el){ return (el.type == 2 || el.type == 10 || el.type == 17 || el.type == 32 ) });
										filter.map( function (el){
											show = (!selected.length || (selected.length && selected.find(function(i){ return i.type == el.type }))) ? true : false;

											index = $scope.coursesList.findIndex( function (list){ return list.parent == el.type && list.show }); // inserir primeira posicao
											if(index < 0) index = $scope.coursesList.findIndex( function (list){ return list.type == el.type });
											if(index >= 0){
												
												if(item.presencial && el.type == 10)
													courses = filterTypes(el.courses, item.presencial);
												else if(item.pacote && el.type == 17)
													courses = filterTypes(el.courses, item.pacote);
												else
													courses = filterTypes(el.courses, item.type);

												if(!courses.length) show = false
												newList = { title : el.title+' - '+item.title, courses : courses , type: item.type, show : show , parent : el.type, selected : true };
												$scope.coursesList.splice(index, 0, newList);
											}
											if(el.show) el.show = false;
										});
									}
								}

							}else{

								if(item.type == 17 || item.type == 32){
									selected = $scope.coursesList.find( function (el){ return  el.type == item.type });
									filter = $scope.coursesList.filter( function (el){ return (el.parent == item.type) && el.selected });
									if(!filter.length){
										selected.show = false;
										selected.selected = false;	
									}else{
										filter = $scope.coursesList.filter(function (el){
											return ((el.parent == 10 || el.parent == 2 || el.parent == 32 || el.parent == 17) && el.selected) 
										});
										filter.map( function (el){ if(el.courses.length) el.show = true });
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
								}
								
								filter = $scope.coursesList.filter( function (el) { return el.show });
								if(!filter.length){
									if( $scope.path.indexOf('/online') >= 0){
										filter = $scope.coursesList.filter( function (el){ return el.type == 2 });
										filter.map(function(el){ if(el.courses.length) el.show = true });
									}else if( $scope.path.indexOf('/presenciais') >= 0){
										filter = $scope.coursesList.filter( function (el){ return el.type == 10 });
										filter.map(function(el){ if(el.courses.length) el.show = true });
									}else { 
										filter = $scope.coursesList.filter( function (el){ return el.type == 2 || el.type == 10 || el.type == 32 || el.type == 17 });
										filter.map(function(el){ if(el.courses.length) el.show = true });
									}
								}
							}
							console.log($scope.coursesList);
						};

						$scope.addFilter = function ( $event, item ) {
							var checkbox = $event.target;
							if(checkbox.checked) {
								$scope.types.push( item.type );
							}else{
								$scope.types.splice( $scope.types.findIndex( function (el){ return item.type == el }),1);
							}
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
									var courses = [], remove = [], coursesList  = [], series, pacotes, presencial;
									if(response.status == 200) courses = response.data;
									courses.map( function (course, i) {
										var imagemFile;
										if(course){
											course.imgSrc = Config.imgCursoUrlDefault;
											
											if(course.info){
												if(course.info.files){
													imagemFile = course.info.files.find(function(img) { return img.tipo == '5' });
													if(imagemFile) course.imgSrc =  Config.baseUrl+imagemFile.path.replace(/["\\"]/g,'/').replace( "public" ,'');
												}

												if(course.info.seo && course.info.seo.url){
													course.url = Config.cursoOnlineUrl+course.info.seo.url;
												}

												course.nome = course.info.titulo.replace(/curso/ig, '');
											}else{
												remove.push(i);
											}

											if( course.categorias.find(function(tipo){ return tipo.id == 32 })) { // Séries
												course.modalidade = "Série Online";
												course.link = (course.info) ? "/curso/online/"+course.info.seo.url : '';
												remove.push(i); 
											}else if( course.categorias.find(function(tipo){ return tipo.id == 17 })){ // Pacotes
												course.modalidade = "Pacote de Cursos Online";
												course.link = (course.info) ? "/curso/online/"+course.info.seo.url : '';
												remove.push(i); 
											}else if( course.categorias.find(function(tipo){ return tipo.id == 40 })){ // PALESTRAS
												course.modalidade = "Palestra Online";
												course.link = (course.info) ? "/curso/online/"+course.info.seo.url : '';
											}else if( course.categorias.find(function(tipo){ return tipo.id == 12 })){ // Presenciais Individuais
												remove.push(i); 
											}else if( course.categorias.find(function(tipo){ return tipo.id == 10 })){ // Presencial
												course.modalidade = "Curso Presencial";
												course.link = (course.info) ? "/curso/presencial/"+course.info.seo.url : '';
												remove.push(i); 
											}else if( course.categorias.find(function(tipo){ return tipo.id == 16 })){ // Prazo Extra
												remove.push(i);
											}else if( course.categorias.find(function(tipo){ return tipo.id == 22 }) ){ // WebConferência
												remove.push(i);
											}else if( course.categorias.find(function(tipo){ return tipo.id == 9  })){ // Interno
												remove.push(i);
											}else if( course.categorias.find(function(tipo){ return tipo.id == 2 })){ // A Dinstancia
												course.modalidade = "Curso Online";
												course.link = (course.info) ? "/curso/online/"+course.info.seo.url : '';
											}else{
												// ">> SEM CATEGORIA <<";
												remove.push(i); 
											}
										}
									});

									series = filterTypes(courses, 32);
									pacotes = filterTypes(courses, 17);
									presencial = filterTypes(courses, 10);

									remove.map( function (i){ delete(courses[i]) });
									courses = courses.filter( function (el){ return el });
									$scope.courses = courses;
									courses = filterTypes(courses, 2);

									if( $scope.path.indexOf('/online') >= 0){
										$scope.coursesList.push({ title : 'Cursos Online', courses : courses, type: 2, show : true });
										$scope.coursesList.push({ title : 'Pacote de Cursos Online', courses : pacotes, type: 17, show : true });
										$scope.coursesList.push({ title : 'Série Online', courses : series, type: 32, show : true });
									}else if( $scope.path.indexOf('/presenciais') >= 0){
										$scope.coursesList.push({ title : 'Cursos Presencial', courses : presencial, type: 10, show : true });
									}else { 
										$scope.coursesList.push({ title : 'Cursos Online', courses : courses, type: 2, show : true });
										$scope.coursesList.push({ title : 'Cursos Presencial', courses : presencial, type: 10, show : true });
										$scope.coursesList.push({ title : 'Pacote de Cursos Online', courses : pacotes, type: 17, show : true });
										$scope.coursesList.push({ title : 'Série Online', courses : series, type: 32, show : true });
									}

								 });
			});