var QiSatApp = angular.module('QiSatApp');

QiSatApp.controller("coursesController",
			function($scope, QiSatAPI, Config){
						QiSatAPI.getCoursesTop()
								.then( function ( response ){
									var courses = [];
									if(response.status == 200) courses = response.data;
									courses.map( function (course) {
										var imagemFile;
										if(course){
											course.imgSrc = Config.imgCursoUrlDefault;
											if(course.info && course.info.files){
												imagemFile = course.info.files.find(function(img) {return img.tipo == '5' });
												if(imagemFile) course.imgSrc =  Config.baseUrl+imagemFile.path.replace(/["\\"]/g,'/').replace( "public" ,'');
											}

											if(course.info && course.info.seo && course.info.seo.url){
												course.url = Config.cursoOnlineUrl+course.info.seo.url;
											}

											course.modalidade = "Cursos Online";
										}
									});
									$scope.courses = courses;
									console.log(courses);
								 });
			});