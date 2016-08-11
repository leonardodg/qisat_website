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
			function($scope, QiSatAPI, Config){

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

											if( course.categorias.find(function(tipo){ return tipo.id == 32 })){
												course.modalidade = "Série Online";
											}else if( course.categorias.find(function(tipo){ return tipo.id == 17 })){
												course.modalidade = "Pacote de Cursos Online";
											}else if( course.categorias.find(function(tipo){ return tipo.id == 12 })){
												remove.push(i); // Cursos Software Presenciais Individuais
											}else if( course.categorias.find(function(tipo){ return tipo.id == 10 })){
												course.modalidade = "Curso Presencial";
											}else if( course.categorias.find(function(tipo){ return tipo.id == 16 })){
												remove.push(i);
											}else if( course.categorias.find(function(tipo){ return tipo.id == 22 }) ){
												remove.push(i);
											}else if( course.categorias.find(function(tipo){ return tipo.id == 9  })){
												remove.push(i);
											}else if( course.categorias.find(function(tipo){ return tipo.id == 2 })){
												course.modalidade = "Curso Online";
											}else{
												course.modalidade = "";
											}

											// else if( course.categorias.find(function(tipo){ return tipo.id == 0 })){ // PALESTRAS
											// 	course.modalidade = "Palestra Online";
											// }

										}
									});

									remove.map(function(index){
										delete(courses[index]);
									});
									courses = courses.filter(function(el){return el});

									// Curso Online: Categoria = 14 e 15
									palestras = courses.filter(function(course){
										return course.categorias.find(function(tipo){ return tipo.id == 14 || tipo.id == 15 });
									});

									// Curso Online: Categoria = 2
									onlineCourses = courses.filter(function(course){
										return course.categorias.find(function(tipo){return tipo.id == 2 });
									});

									// Curso Presencial: Categoria = 10
									classCourses = courses.filter(function(course){
										return course.categorias.find(function(tipo){return tipo.id == 10 });
									});

									$scope.courses = courses;
									$scope.onlineCourses = onlineCourses;
									$scope.classCourses = classCourses;

									// console.log(courses);


								 });
			});