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
			function($scope, QiSatAPI, Config ){

						// $scope.typesFilter = dataFilter.types;

						QiSatAPI.getCourses()
								.then( function ( response ){
									var courses = [], remove = [];
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
												course.nome = course.nome.replace(/curso/ig, '');
											}

											if( course.categorias.find(function(tipo){ return tipo.id == 32 })){ // Séries
												course.modalidade = "Série Online";
											}else if( course.categorias.find(function(tipo){ return tipo.id == 17 })){ // Pacotes
												course.modalidade = "Pacote de Cursos Online";
											}else if( course.categorias.find(function(tipo){ return tipo.id == 40 })){ // PALESTRAS
												course.modalidade = "Palestra Online";
											}else if( course.categorias.find(function(tipo){ return tipo.id == 12 })){ // Presenciais Individuais
												remove.push(i); 
											}else if( course.categorias.find(function(tipo){ return tipo.id == 10 })){ // Presencial
												course.modalidade = "Curso Presencial";
											}else if( course.categorias.find(function(tipo){ return tipo.id == 16 })){ // Prazo Extra
												remove.push(i);
											}else if( course.categorias.find(function(tipo){ return tipo.id == 22 }) ){ // WebConferência
												remove.push(i);
											}else if( course.categorias.find(function(tipo){ return tipo.id == 9  })){ // Interno
												remove.push(i);
											}else if( course.categorias.find(function(tipo){ return tipo.id == 2 })){ // A Dinstancia
												course.modalidade = "Curso Online";
											}else{
												course.modalidade = ">> SEM CATEGORIA <<";
											}

										}
									});

									remove.map(function(index){
										delete(courses[index]);
									});
									courses = courses.filter(function(el){return el});

									// Series: Categoria = 32
									series = courses.filter(function(course){
										return course.categorias.find(function(tipo){return tipo.id == 32 });
									});

									// Pacotes: Categoria = 17
									pacotes = courses.filter(function(course){
										return course.categorias.find(function(tipo){return tipo.id == 17 });
									});									

									// Curso Presencial: Categoria = 10
									classCourses = courses.filter(function(course){
										return course.categorias.find(function(tipo){return tipo.id == 10 });
									});

									// Curso Online: Categoria = 2
									onlineCourses = courses.filter(function(course){
										return course.categorias.find(function(tipo){return tipo.id == 2 });
									});


									$scope.courses = courses;
									$scope.onlineCourses = onlineCourses;
									$scope.classCourses = classCourses;
									$scope.series = series;
									$scope.pacotes = pacotes;

									// console.log(courses);
								 });
			});